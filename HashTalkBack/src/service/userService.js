const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

class UserService {
    constructor(){
        this.usersPath = path.join(__dirname, '../data/users.js');
    }

    getUsers(){
        try {
            const data = fs.readFileSync(this.usersPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveUsers(users){
        fs.writeFileSync(this.usersPath, JSON.stringify(users, null, 2));
    }

    findUserByEmail(email){
        const users = this.getUsers();
        return users.find(user => user.emailInstitucional === email);
    }

    findUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    async createUser(userData){
        const users = this.getUsers();

        // verificando se já existe cadastro 
        const existingUser = this.findUserByEmail(userData.emailInstitucional);
        if(existingUser) {
            throw new Error('Email institucional já cadastrado');
        }

         // Criar novo usuario
        const newUser = {
            id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
            ...userData,
            senha: await bcrypt.hash(userData.senha, 10),
            dataCriacao: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        // Retornar usuário sem senha
        const { senha, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    
    // Validando login
    async validateLogin(email, senha) {
        const user = this.findUserByEmail(email);
        if(!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if(!isValidPassword) {
            throw new Error('Senha inválida');
        }

        const { senha: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

}

module.exports = new UserService();