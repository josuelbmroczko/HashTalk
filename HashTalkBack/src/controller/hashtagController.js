const feedService = require('../service/feedService');

class HashtagController {
    createHashtags(req, res) {
        try {
            const { hashtags } = req.body;
            
            if (!hashtags || !Array.isArray(hashtags)) {
                return res.status(400).json({
                    error: 'Lista de hashtags é obrigatória'
                });
            }

            res.status(201).json({
                message: 'Hashtags processadas com sucesso',
                hashtags: hashtags
            });

        } catch (error) {
            console.error('Erro ao criar hashtags:', error);
            res.status(500).json({ error: 'Erro ao processar hashtags' });
        }
    }

    // Listar todas as hashtags únicas
    getAllHashtags(req, res) {
        try {
            const posts = feedService.getPost();
            
            // Extrair todas as hashtags dos posts
            const allHashtags = posts.reduce((acc, post) => {
                if (post.hashtags && Array.isArray(post.hashtags)) {
                    return [...acc, ...post.hashtags];
                }
                return acc;
            }, []);

            // Remover duplicatas
            const uniqueHashtags = [...new Set(allHashtags)];

            res.json({
                total: uniqueHashtags.length,
                hashtags: uniqueHashtags
            });

        } catch (error) {
            console.error('Erro ao listar hashtags:', error);
            res.status(500).json({ error: 'Erro ao buscar hashtags' });
        }
    }

    getPostsByHashtag(req, res) {
        try {
            const { hashtag } = req.params;
            const posts = feedService.getPost();
            
            const hashtagPosts = posts.filter(post => 
                post.hashtags && post.hashtags.some(tag => 
                    tag.toLowerCase() === `#${hashtag.toLowerCase()}`
                )
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
    }

    // Buscar hashtags mais populares
    getTopHashtags(req, res) {
        try {
            const posts = feedService.getPost();
            const limit = parseInt(req.query.limit) || 10;
            
            // Contar frequência das hashtags
            const hashtagCount = {};
            posts.forEach(post => {
                if (post.hashtags && Array.isArray(post.hashtags)) {
                    post.hashtags.forEach(tag => {
                        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
                    });
                }
            });

            // Ordenar por frequência
            const sortedHashtags = Object.entries(hashtagCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([tag, count]) => ({ tag, count }));

            res.json({
                topHashtags: sortedHashtags
            });

        } catch (error) {
            console.error('Erro ao buscar top hashtags:', error);
            res.status(500).json({ error: 'Erro ao buscar hashtags populares' });
        }
    }
}

module.exports = new HashtagController();