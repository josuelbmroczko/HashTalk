# HashTalk API

API em Node.js com integracao de inteligencia artificial para gerenciar postagens e hashtags.

## Pre-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## Como rodar o projeto

1. Instale as dependencias:

   ```bash
   npm install
   ```

2. Inicie o projeto:

   ```bash
   npm run dev
   ```

O servidor da API roda em `http://localhost:3000`.

## Autenticacao

As rotas de posts e hashtags sao protegidas. Antes de acessa-las, faca login e envie o token retornado no header das requisicoes.

```http
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

No Postman, use **Authorization > Bearer Token** e cole o token recebido no login.

## Rotas publicas

### Health check

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/health`

### Registrar usuario

- **Metodo:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body:**

```json
{
  "empresaId": 1,
  "nomeEmpresa": "HashTalk",
  "nomeFuncionario": "Joao Silva",
  "cargoFuncionario": "Desenvolvedor",
  "emailInstitucional": "joao@hashtalk.com",
  "senha": "senha123"
}
```

### Login

- **Metodo:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body:**

```json
{
  "emailInstitucional": "joao@hashtalk.com",
  "senha": "senha123"
}
```

Copie o campo `token` da resposta para acessar as rotas protegidas.

## Rotas protegidas de autenticacao

### Verificar token

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/auth/verify`

### Logout

- **Metodo:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`

### Dados do usuario autenticado

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`

## Rotas protegidas de posts

### Listar postagens

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/posts`

### Criar uma nova postagem

- **Metodo:** `POST`
- **URL:** `http://localhost:3000/api/posts`
- **Body:**

```json
{
  "content": "Construindo minha propria API com Node.js e inteligencia artificial!"
}
```

Os dados do autor sao extraidos do token. Nao envie `usuario_id` nem `username` no body.

### Listar minhas postagens

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/posts/me`

### Listar postagens por empresa

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/posts/empresa/1`

### Listar postagens por nome da empresa

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/posts/empresa/nome/HashTalk`

### Listar postagens por hashtag

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/posts/hashtag/nodejs`

### Deletar postagem

- **Metodo:** `DELETE`
- **URL:** `http://localhost:3000/api/posts/1719250000000`

Somente o autor autenticado pode deletar a propria postagem.

## Rotas protegidas de hashtags

### Criar/processar hashtags

- **Metodo:** `POST`
- **URL:** `http://localhost:3000/api/hashtags`
- **Body:**

```json
{
  "hashtags": ["#NodeJS", "#IA", "#Fullstack"]
}
```

### Listar todas as hashtags

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/hashtags`

### Listar hashtags mais populares

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/hashtags/top?limit=10`

### Listar posts por hashtag

- **Metodo:** `GET`
- **URL:** `http://localhost:3000/api/hashtags/nodejs/posts`
