const prisma = require('../database/prismaClient');

const enviarMensagem = async (req, res) => {
    try {
        const sender_id = parseInt(req.user.id);
        const { receiver_id, content } = req.body;

        if (!receiver_id || !content || content.trim() === '') {
            return res.status(400).json({ error: 'Campos receiver_id e content são obrigatórios.' });
        }

        const message = await prisma.message.create({
            data: {
                sender_id,
                receiver_id: parseInt(receiver_id),
                content: content.trim()
            },
            include: {
                sender: {
                    select: { id: true, nomecompleto: true, username: true, avatar_url: true }
                },
                receiver: {
                    select: { id: true, nomecompleto: true, username: true, avatar_url: true }
                }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ error: 'Erro interno ao enviar mensagem.' });
    }
};

const listarMensagensComUsuario = async (req, res) => {
    try {
        const loggedUserId = parseInt(req.user.id);
        const otherUserId = parseInt(req.params.userId);

        if (isNaN(otherUserId)) {
            return res.status(400).json({ error: 'ID do outro usuário é inválido.' });
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { sender_id: loggedUserId, receiver_id: otherUserId },
                    { sender_id: otherUserId, receiver_id: loggedUserId }
                ]
            },
            orderBy: {
                created_at: 'asc'
            },
            include: {
                sender: {
                    select: { id: true, nomecompleto: true, username: true, avatar_url: true }
                },
                receiver: {
                    select: { id: true, nomecompleto: true, username: true, avatar_url: true }
                }
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('Erro ao listar mensagens:', error);
        res.status(500).json({ error: 'Erro interno ao listar mensagens.' });
    }
};

const listarConversas = async (req, res) => {
    try {
        const loggedUserId = parseInt(req.user.id);

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { sender_id: loggedUserId },
                    { receiver_id: loggedUserId }
                ]
            },
            orderBy: {
                created_at: 'desc'
            },
            include: {
                sender: {
                    select: { id: true, nomecompleto: true, username: true, email: true, avatar_url: true, nome_empresa: true }
                },
                receiver: {
                    select: { id: true, nomecompleto: true, username: true, email: true, avatar_url: true, nome_empresa: true }
                }
            }
        });

        const conversationsMap = new Map();

        for (const msg of messages) {
            const otherUser = msg.sender_id === loggedUserId ? msg.receiver : msg.sender;
            if (!otherUser) continue;
            
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    otherUser,
                    lastMessage: {
                        id: msg.id,
                        content: msg.content,
                        created_at: msg.created_at,
                        sender_id: msg.sender_id
                    }
                });
            }
        }

        const conversations = Array.from(conversationsMap.values());
        res.json(conversations);
    } catch (error) {
        console.error('Erro ao listar conversas:', error);
        res.status(500).json({ error: 'Erro interno ao listar conversas.' });
    }
};

module.exports = {
    enviarMensagem,
    listarMensagensComUsuario,
    listarConversas
};
