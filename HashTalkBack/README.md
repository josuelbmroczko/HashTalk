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

### 1. Listar Postagens
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts`

### 2. Criar uma Nova Postagem
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/posts`
- **Body (JSON):**
  ```json
  {
    "usuario_id": 25,
    "content": "Construindo minha própria API com Node.js e inteligência artificial!"
  }
  ```

### 3. Listar Postagens de um Usuário Específico (Seja funcionário ou conta de empresa)
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts/usuario/25`
*(Substitua o `25` pelo ID real do usuário que você deseja ver as postagens isoladas)*

### 4. Listar Postagens da Rede de uma Empresa (A Empresa + Todos seus Funcionários)
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/posts/empresa/1`
*(Substitua o `1` pelo ID da Empresa. Ele trará tudo que a empresa postou E tudo que os funcionários atrelados a ela postaram!)*

### 5. Gerar Hashtags
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/hashtags`
- **Body (JSON):**
  ```json
  {
    "texto": "Estou a desenvolver um projeto fullstack incrível usando inteligência artificial e Node.js"
  }
  ```

### 6. Listar Todos os Usuários
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/usuarios`

### 7. Listar Funcionários (Apenas)
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/usuarios/funcionarios`
*(Retorna todos os funcionários e os dados resumidos da empresa a qual eles pertencem)*

### 8. Listar Empresas (Apenas)
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/usuarios/empresas`
*(Retorna todas as empresas cadastradas e a lista de funcionários vinculados a elas)*

### 9. Cadastro de Usuário (Funcionário)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/usuarios/cadastro`
- **Body (JSON):**
  ```json
  {
    "nomecompleto": "João Silva",
    "username": "joaosilva",
    "email": "joao.silva@email.com",
    "senha": "senha_segura_123",
    "role": "FUNCIONARIO"
  }
  ```
*(O `id` do usuario e gerado automaticamente. Envie `empresa_id` somente se quiser vincular o funcionario a uma empresa que ja existe.)*

### 10. Cadastro de Usuário (Empresa)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/usuarios/cadastro`
- **Body (JSON):**
  ```json
  {
    "nomecompleto": "Maria Oliveira",
    "username": "maria_tech",
    "email": "contato@techsolutions.com",
    "senha": "senha_segura_456",
    "role": "EMPRESA",
    "cargo_responsavel": "Diretora de RH",
    "nome_empresa": "Tech Solutions LTDA"
  }
  ```
