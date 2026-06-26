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
        const loggedUserId = parseInt(req.user.id);
        const [usuarios, seguindo] = await Promise.all([
            prisma.usuario.findMany({
                where: {
                    id: { not: loggedUserId }
                },
                select: {
                    id: true, nomecompleto: true, username: true, email: true,
                    role: true, cargo_responsavel: true, nome_empresa: true,
                    empresa_id: true, criado_em: true, avatar_url: true,
                    _count: {
                        select: {
                            seguidores: true,
                            seguindo: true,
                            posts: true
                        }
                    }
                }
            }),
            prisma.follow.findMany({
                where: { followerId: loggedUserId },
                select: { followedId: true }
            })
        ]);

        const seguindoIds = new Set(seguindo.map((follow) => follow.followedId));

        res.json(usuarios.map((usuario) => {
            const { _count, ...dadosUsuario } = usuario;
            return {
                ...dadosUsuario,
                isFollowing: seguindoIds.has(usuario.id),
                totalSeguidores: _count.seguidores,
                totalSeguindo: _count.seguindo,
                totalPosts: _count.posts
            };
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
    }
};

const listarRelacionamentos = async (req, res) => {
    try {
        const loggedUserId = parseInt(req.user.id);
        const selectUsuario = {
            id: true,
            nomecompleto: true,
            username: true,
            email: true,
            role: true,
            cargo_responsavel: true,
            nome_empresa: true,
            avatar_url: true,
            _count: {
                select: {
                    seguidores: true,
                    seguindo: true,
                    posts: true
                }
            }
        };

        const [followingRows, followerRows] = await Promise.all([
            prisma.follow.findMany({
                where: { followerId: loggedUserId },
                orderBy: { created_at: 'desc' },
                include: { followed: { select: selectUsuario } }
            }),
            prisma.follow.findMany({
                where: { followedId: loggedUserId },
                orderBy: { created_at: 'desc' },
                include: { follower: { select: selectUsuario } }
            })
        ]);

        const followingIds = new Set(followingRows.map((row) => row.followedId));

        const suggestions = await prisma.usuario.findMany({
            where: {
                AND: [
                    { id: { not: loggedUserId } },
                    { id: { notIn: Array.from(followingIds) } }
                ]
            },
            orderBy: { criado_em: 'desc' },
            take: 8,
            select: selectUsuario
        });

        const normalize = (usuario, isFollowing = false) => {
            const { _count, ...dadosUsuario } = usuario;
            return {
                ...dadosUsuario,
                isFollowing,
                totalSeguidores: _count.seguidores,
                totalSeguindo: _count.seguindo,
                totalPosts: _count.posts
            };
        };

        res.json({
            following: followingRows.map((row) => normalize(row.followed, true)),
            followers: followerRows.map((row) => normalize(row.follower, followingIds.has(row.followerId))),
            suggestions: suggestions.map((usuario) => normalize(usuario, false)),
            counts: {
                following: followingRows.length,
                followers: followerRows.length,
                mutual: followerRows.filter((row) => followingIds.has(row.followerId)).length,
                suggestions: suggestions.length
            }
        });
    } catch (error) {
        console.error('Erro ao listar relacionamentos:', error);
        res.status(500).json({ error: 'Erro interno ao buscar parceiros.' });
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

        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: 'ID de usuario invalido.' });
        }

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

        // 3. Conta seguidores e seguindo
        const totalSeguidores = await prisma.follow.count({
            where: { followedId: usuarioId }
        });
        const totalSeguindo = await prisma.follow.count({
            where: { followerId: usuarioId }
        });

        // 4. Verifica se o usuário logado segue
        let isFollowing = false;
        if (req.user && req.user.id) {
            const loggedUserId = parseInt(req.user.id);
            if (loggedUserId !== usuarioId) {
                const followRecord = await prisma.follow.findUnique({
                    where: {
                        followerId_followedId: {
                            followerId: loggedUserId,
                            followedId: usuarioId
                        }
                    }
                });
                isFollowing = !!followRecord;
            }
        }

        // 5. Retorna os dados combinados
        res.json({ ...usuario, totalPosts, totalSeguidores, totalSeguindo, isFollowing });
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const loggedUserId = parseInt(req.user.id);
        const { id } = req.params;
        const targetUserId = parseInt(id);

        if (isNaN(targetUserId)) {
            return res.status(400).json({ error: 'ID de usuário inválido.' });
        }
        if (loggedUserId === targetUserId) {
            return res.status(400).json({ error: 'Você não pode seguir a si mesmo.' });
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: loggedUserId,
                    followedId: targetUserId
                }
            }
        });

        if (existingFollow) {
            await prisma.follow.delete({
                where: { id: existingFollow.id }
            });
            const totalSeguidores = await prisma.follow.count({ where: { followedId: targetUserId } });
            const totalSeguindo = await prisma.follow.count({ where: { followerId: loggedUserId } });
            return res.json({ following: false, totalSeguidores, totalSeguindo });
        } else {
            await prisma.follow.create({
                data: {
                    followerId: loggedUserId,
                    followedId: targetUserId
                }
            });
            const totalSeguidores = await prisma.follow.count({ where: { followedId: targetUserId } });
            const totalSeguindo = await prisma.follow.count({ where: { followerId: loggedUserId } });
            return res.status(201).json({ following: true, totalSeguidores, totalSeguindo });
        }
    } catch (error) {
        console.error('Erro ao alternar follow:', error);
        res.status(500).json({ error: 'Erro interno ao seguir usuário.' });
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

const buscarUsuarios = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        const loggedUserId = parseInt(req.user.id);
        const users = await prisma.usuario.findMany({
            where: {
                AND: [
                    { id: { not: loggedUserId } },
                    {
                        OR: [
                            { nomecompleto: { contains: q, mode: 'insensitive' } },
                            { username: { contains: q, mode: 'insensitive' } },
                            { email: { contains: q, mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                nomecompleto: true,
                username: true,
                email: true,
                avatar_url: true,
                nome_empresa: true,
                role: true
            },
            take: 20
        });
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
    }
};

module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    listarRelacionamentos,
    listarFuncionarios,
    listarEmpresas,
    getPerfilUsuario,
    listarColegas,
    buscarUsuarios,
    toggleFollow
};
