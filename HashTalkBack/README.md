# HashTalk Back

Como testar a API no Postman usando as rotas protegidas.

## Variaveis de ambiente

Crie um arquivo `.env` com:

```env
PORT=3000
GEMINI_API_KEY="api"
JWT_SECRET="hashTalk_secret_key_2026"
```

## Fluxo de autenticacao

### 1. Registrar usuario

`POST http://localhost:3000/api/auth/register`

```json
{
  "empresaId": 1,
  "nomeEmpresa": "HashTalk",
  "nomeFuncionario": "Josuel Silva",
  "cargoFuncionario": "Desenvolvedor",
  "emailInstitucional": "josuel@hashtalk.com",
  "senha": "senha123"
}
```

### 2. Fazer login

`POST http://localhost:3000/api/auth/login`

```json
{
  "emailInstitucional": "josuel@hashtalk.com",
  "senha": "senha123"
}
```

Copie o `token` retornado na resposta.

### 3. Usar rotas protegidas

Em todas as rotas protegidas, envie o token no header:

```http
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

No Postman, use a aba **Authorization**, selecione **Bearer Token** e cole o token recebido no login.

## Rotas publicas

### Health check

`GET http://localhost:3000/health`

### Registrar usuario

`POST http://localhost:3000/api/auth/register`

### Login

`POST http://localhost:3000/api/auth/login`

## Rotas protegidas de autenticacao

### Verificar token

`GET http://localhost:3000/api/auth/verify`

### Logout

`POST http://localhost:3000/api/auth/logout`

### Dados do usuario autenticado

`GET http://localhost:3000/api/auth/me`

## Rotas protegidas de posts

### Listar todos os posts

`GET http://localhost:3000/api/posts`

### Criar post

`POST http://localhost:3000/api/posts`

```json
{
  "content": "Construindo minha propria API com Node.js e inteligencia artificial!"
}
```

O autor e os dados da empresa sao obtidos pelo token. Nao envie `usuario_id` nem `username` no body.

### Listar meus posts

`GET http://localhost:3000/api/posts/me`

### Listar posts por empresa

`GET http://localhost:3000/api/posts/empresa/1`

### Listar posts por nome da empresa

`GET http://localhost:3000/api/posts/empresa/nome/HashTalk`

### Listar posts por hashtag

`GET http://localhost:3000/api/posts/hashtag/nodejs`

### Deletar post

`DELETE http://localhost:3000/api/posts/1719250000000`

Somente o autor do post pode deletar.

## Rotas protegidas de hashtags

### Criar/processar hashtags

`POST http://localhost:3000/api/hashtags`

```json
{
  "hashtags": ["#NodeJS", "#IA", "#Fullstack"]
}
```

### Listar todas as hashtags

`GET http://localhost:3000/api/hashtags`

### Listar hashtags mais usadas

`GET http://localhost:3000/api/hashtags/top?limit=10`

### Listar posts de uma hashtag

`GET http://localhost:3000/api/hashtags/nodejs/posts`
