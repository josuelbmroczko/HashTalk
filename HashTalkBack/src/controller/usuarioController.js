const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const cadastrarUsuario = async (req, res) => {
    try {
        const { nomecompleto, username, email, senha, role, cargo_responsavel, nome_empresa, empresa_id } = req.body;

        if (!nomecompleto || !username || !email || !senha) {
            return res.status(400).json({ error: 'Campos obrigatórios (nomecompleto, username, email, senha) não fornecidos.' });
        }

        if (role === 'EMPRESA') {
            if (!cargo_responsavel || !nome_empresa) {
                return res.status(400).json({ error: 'Para a role EMPRESA, cargo_responsavel e nome_empresa são obrigatórios.' });
            }
        }

        const usuario = await prisma.usuario.create({
            data: {
                nomecompleto,
                username,
                email,
                senha,
                role: role || 'FUNCIONARIO',
                cargo_responsavel: role === 'EMPRESA' ? cargo_responsavel : null,
                nome_empresa: role === 'EMPRESA' ? nome_empresa : null,
                empresa_id: (role !== 'EMPRESA' && empresa_id) ? parseInt(empresa_id) : null
            }
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Username ou email já estão em uso.' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'A empresa informada (empresa_id) não existe no sistema.' });
        }
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao cadastrar usuário.' });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true, nomecompleto: true, username: true, email: true,
                role: true, cargo_responsavel: true, nome_empresa: true,
                empresa_id: true, criado_em: true
            }
        });
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
    }
};

const listarFuncionarios = async (req, res) => {
    try {
        const funcionarios = await prisma.usuario.findMany({
            where: { role: 'FUNCIONARIO' },
            select: {
                id: true, nomecompleto: true, username: true, email: true,
                role: true, criado_em: true,
                empresa: { select: { id: true, nome_empresa: true } }
            }
        });
        res.json(funcionarios);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar funcionários.' });
    }
};

const listarEmpresas = async (req, res) => {
    try {
        const empresas = await prisma.usuario.findMany({
            where: { role: 'EMPRESA' },
            select: {
                id: true, nomecompleto: true, username: true, email: true,
                role: true, cargo_responsavel: true, nome_empresa: true,
                criado_em: true,
                funcionarios: { select: { id: true, nomecompleto: true, username: true } }
            }
        });
        res.json(empresas);
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({ error: 'Erro interno ao buscar empresas.' });
    }
};

// --- FUNÇÃO ADICIONADA: Busca perfil + contagem de posts ---
const getPerfilUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = parseInt(id);

        // 1. Busca o usuário
        const usuario = await prisma.usuario.findUnique({ 
            where: { id: usuarioId },
            select: {
                id: true, nomecompleto: true, username: true, email: true,
                role: true, cargo_responsavel: true, nome_empresa: true,
                criado_em: true, avatar_url: true, capa_url: true
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // 2. Conta os posts deste usuário
        const totalPosts = await prisma.post.count({
            where: { usuario_id: usuarioId }
        });

        // 3. Retorna os dados combinados
        res.json({ ...usuario, totalPosts });
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
    }
};

const listarColegas = async (req, res) => {
    try {
        const loggedUserId = parseInt(req.user.id);
        
        // 1. Busca o usuário logado para obter o contexto de empresa
        const me = await prisma.usuario.findUnique({
            where: { id: loggedUserId }
        });

        if (!me) {
            return res.status(404).json({ error: 'Usuário logado não encontrado.' });
        }

        const targetCompanyId = me.empresa_id || me.id;

        // 2. Busca outros usuários pertencentes a essa mesma empresa
        const colegas = await prisma.usuario.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { empresa_id: targetCompanyId },
                            { id: targetCompanyId }
                        ]
                    },
                    { id: { not: loggedUserId } } // Excluir a si mesmo
                ]
            },
            select: {
                id: true,
                nomecompleto: true,
                username: true,
                email: true,
                role: true,
                cargo_responsavel: true,
                nome_empresa: true,
                avatar_url: true,
                capa_url: true
            }
        });

        res.json({ total: colegas.length, colegas });
    } catch (error) {
        console.error('Erro ao listar colegas:', error);
        res.status(500).json({ error: 'Erro interno ao buscar colegas de trabalho.' });
    }
};

module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    listarFuncionarios,
    listarEmpresas,
    getPerfilUsuario,
    listarColegas
};