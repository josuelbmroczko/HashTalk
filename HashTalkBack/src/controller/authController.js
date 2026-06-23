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

            const newUser = await usuService.createUser({
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
            if (error.message === 'Email institucional já cadastrado') {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro ao criar usuário' });
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

