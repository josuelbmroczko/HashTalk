const prisma = require('../database/prismaClient');
const geminiService = require('../service/geminiService');

class HashtagController {
    async createHashtags(req, res) {
        try {
            const { texto } = req.body;

            if (!texto) {
                return res.status(400).json({
                    error: 'Texto e obrigatorio'
                });
            }

            const hashtags = await geminiService.generateHashTags(texto);

            res.status(201).json({
                message: 'Hashtags geradas com sucesso',
                hashtags
            });
        } catch (error) {
            console.error('Erro ao gerar hashtags:', error);
            res.status(500).json({ error: 'Erro ao gerar hashtags com IA', details: error.message, stack: error.stack });
        }
    }

    async getAllHashtags(req, res) {
        try {
            const posts = await prisma.post.findMany({
                select: { hashtags: true }
            });

            const allHashtags = posts.flatMap((post) => post.hashtags || []);
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

    async getPostsByHashtag(req, res) {
        try {
            const { hashtag } = req.params;
            const tag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
            const posts = await prisma.post.findMany({
                where: { hashtags: { has: tag } },
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
    }

    async getTopHashtags(req, res) {
        try {
            const posts = await prisma.post.findMany({
                select: { hashtags: true }
            });
            const limit = parseInt(req.query.limit) || 10;
            const hashtagCount = {};

            posts.forEach((post) => {
                (post.hashtags || []).forEach((tag) => {
                    hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
                });
            });

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
