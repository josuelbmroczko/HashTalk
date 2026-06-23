const jwt = require('jsonwebtoken');
const userService = require('../service/userService');

const JWT_SECRET = process.env.JWT_SECRET || 'hashTalk_secret_key_2026';

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'token não fornecido'
            });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                error: 'Token inválido'
            });
        }
    },

    varifyUsersExists: async (res, req, next) => {
        try {
            const user = await userService.findUserById(req.user.id);
            if (!user) {
                return res.status(401).json({
                    error: 'Usuário não encontrado'
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                error: 'Errro ao verficar usuário'
            });
        }
    },

    // Extraindo infor do usuarios para usar em rotas.
    extractUsersInfo: (req, res, next) => {
        if (req.user) {
            req.userInfo = {
                id: req.user.id,
                empresaId: req.user.empresaId,
                nomeEmpresa: req.user.nomeEmpresa,
                cargoFuncionario: req.user.cargoFuncionario,
                emailInstitucional: req.user.emailInstitucional
            };
        }
        next();
    }
};

module.exports = authMiddleware;