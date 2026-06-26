const geminiService = require('../service/geminiService');
const prisma = require('../database/prismaClient');

const postInclude = {
    usuario: {
        select: {
            id: true,
            nomecompleto: true,
            username: true,
            email: true,
            role: true,
            nome_empresa: true,
            empresa_id: true
        }
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: postInclude,
            orderBy: { created_at: 'desc' }
        });

        res.json({
            total: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro interno ao buscar postagens.' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content, usuario_id, image_url } = req.body;
        const usuarioId = req.userInfo?.id || usuario_id;

        if (!content) {
            return res.status(400).json({ error: 'O conteudo da postagem e obrigatorio.' });
        }

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario nao autenticado.' });
        }

        const usuarioExists = await prisma.usuario.findUnique({
            where: { id: parseInt(usuarioId) }
        });

        if (!usuarioExists) {
            return res.status(404).json({ error: 'Usuario nao encontrado.' });
        }

        let hashtags = [];
        try {
            hashtags = await geminiService.generateHashTags(content);
        } catch (aiError) {
            console.warn('Aviso: falha ao gerar hashtags com IA. O post sera salvo com fallback.');
            hashtags = ['#SemHashtag'];
        }

        const novoPost = await prisma.post.create({
            data: {
                content,
                hashtags,
                image_url,
                usuario_id: parseInt(usuarioId)
            },
            include: postInclude
        });

        res.status(201).json({
            message: 'Post criado com sucesso',
            post: novoPost
        });
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        res.status(500).json({
            error: 'Erro interno ao criar postagem.',
            details: error.message,
            stack: error.stack
        });
    }
};

const getMyPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { usuario_id: parseInt(req.userInfo.id) },
            include: postInclude,
            orderBy: { created_at: 'desc' }
        });

        res.json({
            usuario: req.userInfo.nomeFuncionario,
            email: req.userInfo.emailInstitucional,
            empresa: req.userInfo.nomeEmpresa,
            total: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erro ao listar meus posts:', error);
        res.status(500).json({ error: 'Erro ao buscar seus posts' });
    }
};

const getPostsByUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await prisma.post.findMany({
            where: { usuario_id: parseInt(id) },
            include: postInclude,
            orderBy: { created_at: 'desc' }
        });

        res.json({
            usuarioId: parseInt(id),
            total: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erro ao buscar postagens do usuario:', error);
        res.status(500).json({ error: 'Erro interno ao buscar postagens do usuario.' });
    }
};

const getPostsByEmpresa = async (req, res) => {
    try {
        const empresaId = parseInt(req.params.empresaId || req.params.id);
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { usuario_id: empresaId },
                    { usuario: { empresa_id: empresaId } }
                ]
            },
            include: postInclude,
            orderBy: { created_at: 'desc' }
        });

        res.json({
            empresaId,
            total: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erro ao buscar postagens da empresa:', error);
        res.status(500).json({ error: 'Erro interno ao buscar postagens corporativas.' });
    }
};

const getPostsByEmpresaNome = async (req, res) => {
    try {
        const { nomeEmpresa } = req.params;
        const posts = await prisma.post.findMany({
            where: {
                usuario: {
                    nome_empresa: {
                        contains: nomeEmpresa,
                        mode: 'insensitive'
                    }
                }
            },
            include: postInclude,
            orderBy: { created_at: 'desc' }
        });

        res.json({
            empresa: nomeEmpresa,
            total: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erro ao listar posts por nome da empresa:', error);
        res.status(500).json({ error: 'Erro ao buscar posts da empresa' });
    }
};

const getPostsByHashtag = async (req, res) => {
    try {
        const { hashtag } = req.params;
        const tag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
        const posts = await prisma.post.findMany({
            where: {
                hashtags: { has: tag }
            },
            include: postInclude,
            orderBy: { created_at: 'desc' }
        });

        res.json({
            hashtag: tag,
            total: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erro ao buscar posts por hashtag:', error);
        res.status(500).json({ error: 'Erro ao buscar posts por hashtag' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post nao encontrado' });
        }

        if (post.usuario_id !== parseInt(req.userInfo.id)) {
            return res.status(403).json({ error: 'Voce so pode deletar seus proprios posts' });
        }

        await prisma.post.delete({
            where: { id: parseInt(postId) }
        });

        res.json({
            message: 'Post deletado com sucesso',
            postId: parseInt(postId)
        });
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
};

module.exports = {
    getAllPosts,
    createPost,
    getMyPosts,
    getPostsByUsuario,
    getPostsByEmpresa,
    getPostsByEmpresaNome,
    getPostsByHashtag,
    deletePost
};
