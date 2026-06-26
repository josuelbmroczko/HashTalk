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
                senha,
                role
            } = req.body;

            if (!nomeEmpresa) {
                return res.status(400).json({ error: 'Nome da empresa e obrigatorio' });
            }

            if (!nomeFuncionario) {
                return res.status(400).json({ error: 'Seu nome completo e obrigatorio' });
            }

            if (!cargoFuncionario) {
                return res.status(400).json({ error: 'O cargo que voce presta na empresa e obrigatorio' });
            }

            if (!emailInstitucional) {
                return res.status(400).json({ error: 'O email institucional e obrigatorio' });
            }

            if (!senha || senha.length < 6) {
                return res.status(400).json({ error: 'A senha deve ter no minimo 6 caracteres' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInstitucional)) {
                return res.status(400).json({ error: 'Email institucional invalido' });
            }

            const newUser = await userService.createUser({
                empresaId,
                nomeEmpresa,
                nomeFuncionario,
                cargoFuncionario,
                emailInstitucional,
                senha,
                role
            });

            res.status(201).json({
                message: 'Usuario criado com sucesso',
                usuario: newUser
            });
        } catch (error) {
            console.error('Erro no registro:', error);

            if (error.message.includes('Email institucional')) {
                return res.status(409).json({ error: error.message });
            }

            if (error.code === 'P2003') {
                return res.status(400).json({
                    error: 'A empresa informada nao existe. Remova empresaId para criar uma nova empresa automaticamente.'
                });
            }

            if (error.code === 'P2002') {
                return res.status(409).json({
                    error: 'Este email ou nome de usuário já está em uso por outra conta.'
                });
            }

            res.status(500).json({ error: 'Erro ao criar usuario', details: error.message });
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

    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token nao fornecido' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await userService.findUserById(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'Usuario nao encontrado' });
            }

            res.json({
                valid: true,
                usuario: user
            });
        } catch (error) {
            res.status(401).json({
                valid: false,
                error: 'Token invalido'
            });
        }
    }

    async logout(req, res) {
        res.json({
            message: 'Logout realizado com sucesso'
        });
    }

    async updateMe(req, res) {
        try {
            const { avatarUrl, capaUrl, nomecompleto, cargoFuncionario, nomeEmpresa } = req.body;
            const updateData = {};
            
            if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
            if (capaUrl !== undefined) updateData.capa_url = capaUrl;
            if (nomecompleto !== undefined) updateData.nomecompleto = nomecompleto;
            if (cargoFuncionario !== undefined) updateData.cargo_responsavel = cargoFuncionario;
            if (nomeEmpresa !== undefined) updateData.nome_empresa = nomeEmpresa;

            const updated = await userService.updateUser(req.user.id, updateData);
            res.json({
                message: 'Perfil atualizado com sucesso',
                usuario: updated
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({ error: 'Erro interno ao atualizar perfil' });
        }
    }

    async getMe(req, res) {
        try {
            const user = await userService.findUserById(req.user.id);
            res.json({
                message: 'Usuário autenticado',
                usuario: user
            });
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            res.status(500).json({ error: 'Erro interno ao buscar dados do usuário' });
        }
    }
}

module.exports = new AuthController();
