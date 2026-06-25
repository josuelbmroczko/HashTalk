const bcrypt = require('bcryptjs');
const prisma = require('../database/prismaClient');

const toPublicUser = (usuario) => {
    if (!usuario) {
        return null;
    }

    return {
        id: usuario.id,
        empresaId: usuario.empresa_id || usuario.id,
        nomeEmpresa: usuario.nome_empresa || usuario.nomecompleto,
        nomeFuncionario: usuario.nomecompleto,
        cargoFuncionario: usuario.cargo_responsavel,
        emailInstitucional: usuario.email,
        username: usuario.username,
        role: usuario.role
    };
};

class UserService {
    async findUserByEmail(email) {
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        return usuario;
    }

    async findUserById(id) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: parseInt(id) }
        });

        return toPublicUser(usuario);
    }

    async createUser(userData) {
        const existingUser = await this.findUserByEmail(userData.emailInstitucional);
        if (existingUser) {
            throw new Error('Email institucional ja cadastrado');
        }

        const senhaHash = await bcrypt.hash(userData.senha, 10);
        const isEmpresa = !userData.empresaId || userData.role === 'EMPRESA';

        const usuario = await prisma.usuario.create({
            data: {
                nomecompleto: userData.nomeFuncionario,
                username: userData.username || userData.emailInstitucional.split('@')[0],
                email: userData.emailInstitucional,
                senha: senhaHash,
                role: isEmpresa ? 'EMPRESA' : 'FUNCIONARIO',
                cargo_responsavel: userData.cargoFuncionario || null,
                nome_empresa: userData.nomeEmpresa || null,
                empresa_id: isEmpresa ? null : parseInt(userData.empresaId)
            }
        });

        return toPublicUser(usuario);
    }

    async validateLogin(email, senha) {
        const usuario = await this.findUserByEmail(email);
        if (!usuario) {
            throw new Error('Usuario nao encontrado');
        }

        const isValidPassword = await bcrypt.compare(senha, usuario.senha);
        if (!isValidPassword) {
            throw new Error('Senha invalida');
        }

        return toPublicUser(usuario);
    }
}

module.exports = new UserService();
