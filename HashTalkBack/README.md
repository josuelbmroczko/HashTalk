# HashTalk API

Uma API em Node.js com integração de Inteligência Artificial para gerenciar postagens e gerar hashtags automaticamente.

## Pré-requisitos
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## Como Rodar o Projeto (Automatizado)

Para facilitar o uso por qualquer pessoa da equipe, o projeto foi totalmente automatizado com scripts no NPM.

> **Importante:** Certifique-se de ter o **Docker** aberto e rodando no seu computador.

1. **Baixe e Instale as dependências:**
   ```bash
   npm install
   ```
   *(A mágica do nosso `postinstall` criará automaticamente o seu arquivo `.env` baseado no `.env.example`)*

2. **Inicie o projeto:**
   ```bash
   npm run dev
   ```
   *(Este comando irá automaticamente: Subir o banco de dados via Docker, rodar as migrations do Prisma, gerar o cliente e iniciar o servidor na porta 3000)*

---

## Endpoints da API (Testando no Postman)

> **Atenção:** As rotas de Postagens e Hashtags agora são **protegidas**. Você deve enviar no Header da requisição o Token JWT retornado no login.  
> Exemplo: `Authorization: Bearer seu_token_aqui`

### Autenticação

#### 1. Registrar Usuário (Empresa ou Funcionário)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body (JSON):**
  ```json
  {
    "nomeEmpresa": "Tech Solutions",
    "nomeFuncionario": "João Silva",
    "cargoFuncionario": "CEO",
    "emailInstitucional": "joao@techsolutions.com",
    "senha": "senha_segura_123",
    "role": "EMPRESA"
  }
  ```

#### 2. Login
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
  ```json
  {
    "emailInstitucional": "joao@techsolutions.com",
    "senha": "senha_segura_123"
  }
  ```
  *(Retorna o Token JWT)*

#### 3. Verificar Token
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/auth/verify`
- **Headers:** `Authorization: Bearer <token>`

#### 4. Dados do Usuário
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### 5. Logout
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

---

### Postagens (Exigem Token)

#### 6. Listar Todas as Postagens
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts`
- **Headers:** `Authorization: Bearer <token>`

#### 7. Criar uma Nova Postagem
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/posts`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "content": "Construindo minha própria API com Node.js e inteligência artificial!"
  }
  ```

#### 8. Meus Posts
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts/me`
- **Headers:** `Authorization: Bearer <token>`

#### 9. Posts por Usuário Específico
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts/usuario/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 10. Posts por Empresa (Empresa + Funcionários)
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts/empresa/:empresaId`
- **Headers:** `Authorization: Bearer <token>`

#### 11. Posts por Hashtag
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts/hashtag/:tag`
- **Headers:** `Authorization: Bearer <token>`

#### 12. Deletar Post
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>`

---

### Hashtags (Exigem Token)

#### 13. Gerar Hashtags (IA)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/hashtags`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "texto": "Estou a desenvolver um projeto fullstack incrível usando inteligência artificial e Node.js"
  }
  ```

#### 14. Listar Todas as Hashtags
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/hashtags`
- **Headers:** `Authorization: Bearer <token>`

#### 15. Hashtags Mais Populares
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/hashtags/top`
- **Headers:** `Authorization: Bearer <token>`
