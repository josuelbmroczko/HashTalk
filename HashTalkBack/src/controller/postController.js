const geminiService = require('../service/geminiService');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nomecompleto: true,
                        username: true,
                        role: true,
                        nome_empresa: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        res.json(posts);
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro interno ao buscar postagens.' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content, usuario_id } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'O conteúdo da postagem é obrigatório.' });
        }

        if (!usuario_id) {
            return res.status(400).json({ error: 'O id do usuário (usuario_id) é obrigatório.' });
        }

        // Verifica se o usuário existe para garantir a integridade
        const usuarioExists = await prisma.usuario.findUnique({
            where: { id: parseInt(usuario_id) }
        });

        if (!usuarioExists) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Gera as hashtags via IA (com fallback caso a cota do Gemini exceda)
        let hashtags = [];
        try {
            hashtags = await geminiService.generateHashTags(content);
        } catch (aiError) {
            console.warn('Aviso: Falha ao gerar hashtags com IA (possível limite de cota). O post será salvo sem hashtags automáticas.');
            hashtags = ["#SemHashtag"]; // Fallback
        }

        // Salva no banco
        const novoPost = await prisma.post.create({
            data: {
                content,
                hashtags,
                usuario_id: parseInt(usuario_id)
            }
        });

        res.status(201).json(novoPost);
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        res.status(500).json({ error: 'Erro interno ao criar postagem.' });
    }
};

const getPostsByUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await prisma.post.findMany({
            where: { usuario_id: parseInt(id) },
            include: {
                usuario: {
                    select: {
                        nomecompleto: true,
                        username: true,
                        role: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Nenhuma postagem encontrada para este usuário.' });
        }

        res.json(posts);
    } catch (error) {
        console.error('Erro ao buscar postagens do usuário:', error);
        res.status(500).json({ error: 'Erro interno ao buscar postagens do usuário.' });
    }
};

const getPostsByEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Busca os posts feitos pela própria empresa OU pelos seus funcionários
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { usuario_id: parseInt(id) }, // Feitos pela empresa
                    { usuario: { empresa_id: parseInt(id) } } // Feitos pelos funcionários
                ]
            },
            include: {
                usuario: {
                    select: {
                        nomecompleto: true,
                        username: true,
                        role: true,
                        nome_empresa: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Nenhuma postagem encontrada para esta rede da empresa.' });
        }

        res.json(posts);
    } catch (error) {
        console.error('Erro ao buscar postagens da empresa:', error);
        res.status(500).json({ error: 'Erro interno ao buscar postagens corporativas.' });
    }
};

module.exports = { getAllPosts, createPost, getPostsByUsuario, getPostsByEmpresa };
