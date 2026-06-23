const feedService = require('../service/feedService');
const geminiService = require('../service/geminiService');

// Listar todos os posts
const getAllPosts = (req, res) => {
    try {
        const posts = feedService.getPost();
        res.json({
            total: posts.length,
            posts: posts
        });
    } catch (error) {
        console.error('Erro ao listar posts:', error);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        
        // Validar conteúdo
        if (!content) {
            return res.status(400).json({ 
                error: 'Conteúdo do post é obrigatório' 
            });
        }

        // Pegar informações do usuário do middleware de autenticação
        const userInfo = req.userInfo;
        
        if (!userInfo) {
            return res.status(401).json({ 
                error: 'Usuário não autenticado' 
            });
        }

        // Gerar hashtags com Gemini
        const hashtags = await geminiService.generateHashTags(content);

        // Criar novo post com estrutura B2B
        const novoPost = {
            id: Date.now(),
            empresaId: userInfo.empresaId,
            nomeEmpresa: userInfo.nomeEmpresa,
            nomeFuncionario: userInfo.nomeFuncionario,
            cargoFuncionario: userInfo.cargoFuncionario,
            autorEmail: userInfo.emailInstitucional,
            content: content,
            hashtags: hashtags,
            timestamp: new Date().toISOString()
        };

        // Salvar post
        const posts = feedService.getPost();
        posts.unshift(novoPost);
        feedService.savePost(posts);

        res.status(201).json({
            message: 'Post criado com sucesso',
            post: novoPost
        });

    } catch (error) {
        console.error('Erro ao criar post:', error);
        res.status(500).json({ 
            error: 'Erro ao criar post',
            details: error.message 
        });
    }
};

// Listar posts do usuário autenticado
const getMyPosts = (req, res) => {
    try {
        const userInfo = req.userInfo;
        const posts = feedService.getPost();
        
        const myPosts = posts.filter(post => 
            post.autorEmail === userInfo.emailInstitucional
        );

        res.json({
            usuario: userInfo.nomeFuncionario,
            email: userInfo.emailInstitucional,
            empresa: userInfo.nomeEmpresa,
            total: myPosts.length,
            posts: myPosts
        });

    } catch (error) {
        console.error('Erro ao listar meus posts:', error);
        res.status(500).json({ error: 'Erro ao buscar seus posts' });
    }
};

// Listar posts por empresa
const getPostsByEmpresa = (req, res) => {
    try {
        const { empresaId } = req.params;
        const posts = feedService.getPost();
        
        const empresaPosts = posts.filter(post => 
            post.empresaId === parseInt(empresaId)
        );

        res.json({
            empresaId: parseInt(empresaId),
            total: empresaPosts.length,
            posts: empresaPosts
        });

    } catch (error) {
        console.error('Erro ao listar posts por empresa:', error);
        res.status(500).json({ error: 'Erro ao buscar posts da empresa' });
    }
};

// Listar posts de uma empresa específica
const getPostsByEmpresaNome = (req, res) => {
    try {
        const { nomeEmpresa } = req.params;
        const posts = feedService.getPost();
        
        const empresaPosts = posts.filter(post => 
            post.nomeEmpresa.toLowerCase().includes(nomeEmpresa.toLowerCase())
        );

        res.json({
            empresa: nomeEmpresa,
            total: empresaPosts.length,
            posts: empresaPosts
        });

    } catch (error) {
        console.error('Erro ao listar posts por nome da empresa:', error);
        res.status(500).json({ error: 'Erro ao buscar posts da empresa' });
    }
};

// Buscar posts por hashtag
const getPostsByHashtag = (req, res) => {
    try {
        const { hashtag } = req.params;
        const posts = feedService.getPost();
        
        const hashtagPosts = posts.filter(post => 
            post.hashtags && post.hashtags.includes(`#${hashtag}`)
        );

        res.json({
            hashtag: `#${hashtag}`,
            total: hashtagPosts.length,
            posts: hashtagPosts
        });

    } catch (error) {
        console.error('Erro ao buscar posts por hashtag:', error);
        res.status(500).json({ error: 'Erro ao buscar posts por hashtag' });
    }
};

// Deletar post - apenas o autor pode deletar
const deletePost = (req, res) => {
    try {
        const { postId } = req.params;
        const userInfo = req.userInfo;
        
        let posts = feedService.getPost();
        
        // Encontrar o post
        const postIndex = posts.findIndex(post => post.id === parseInt(postId));
        
        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Verificar se o usuário é o autor
        if (posts[postIndex].autorEmail !== userInfo.emailInstitucional) {
            return res.status(403).json({ 
                error: 'Você só pode deletar seus próprios posts' 
            });
        }

        // Remover o post
        posts.splice(postIndex, 1);
        feedService.savePost(posts);

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
    getPostsByEmpresa,
    getPostsByEmpresaNome,
    getPostsByHashtag,
    deletePost
};