const jwt = require('jsonwebtoken');
const userService = require('../service/userService');

const JWT_SECRET = process.env.JWT_SECRET || 'hashTalk_secret_key_2026';

class AuthController {
    async register(req, res) {
        try {
            const {
                empresaId,
                nomeEmpresa,
                nomeFuncionario,
                cargoFuncionario,
                emailInstitucional,
                senha
            } = req.body;

            if (!empresaId) {
                return res.status(400).json({
                    error: 'ID da empresa é obrigatório'
                });
            }

            if (!nomeEmpresa) {
                return res.status(400).json({ error: 'Nome da empresa é obrigatório' });
            }

            if (!nomeFuncionario) {
                return res.status(400).json({ error: 'Seu nome completo é obrigatório' });
            }

            if (!cargoFuncionario) {
                return res.status(400).json({ error: 'O cargo que você presta na empresa é obrigatório' });
            }

            if (!emailInstitucional) {
                return res.status(400).json({ error: 'O E-mail instituicional é obrigatório' });
            }

            if (!senha || senha.length < 6) {
                return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInstitucional)) {
                return res.status(400).json({ error: 'Email institucional inválido' });
            }

            const newUser = await userService.createUser({
                empresaId,
                nomeEmpresa,
                nomeFuncionario,
                cargoFuncionario,
                emailInstitucional,
                senha
            });

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                usuario: newUser
            });

        } catch (error) {
            console.error('Erro no registro:', error);
            if (error.message.includes('Email institucional')) {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }

    async login(req, res) {
        try {
            const { emailInstitucional, senha } = req.body;

            if (!emailInstitucional || !senha) {
                return res.status(400).json({
                    error: 'Email institucional e senha sao obrigatorios'
                });
            }

            const user = await userService.validateLogin(emailInstitucional, senha);
            const token = jwt.sign(
                {
                    id: user.id,
                    empresaId: user.empresaId,
                    nomeEmpresa: user.nomeEmpresa,
                    nomeFuncionario: user.nomeFuncionario,
                    cargoFuncionario: user.cargoFuncionario,
                    emailInstitucional: user.emailInstitucional
                },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({
                message: 'Login realizado com sucesso',
                token,
                usuario: user
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    // Verificar token
    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await userService.findUserById(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const { senha, ...userWithoutPassword } = user;
            res.json({
                valid: true,
                usuario: userWithoutPassword
            });

        } catch (error) {
            res.status(401).json({
                valid: false,
                error: 'Token inválido'
            });
        }
    }

    async logout(req, res) {
        res.json({
            message: 'Logout realizado com sucesso'
        });
    }
}

module.exports = new AuthController();

