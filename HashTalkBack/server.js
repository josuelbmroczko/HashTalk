const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const hashtagRoutes = require('./src/routes/hashtagRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/hashtags', hashtagRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HashTalk B2B API está rodando!',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API HashTalk B2B',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      hashtags: '/api/hashtags'
    }
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

// 404 - Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`HashTalk B2B API rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`\nEndpoints disponíveis:`);
  console.log(`\nAutenticação:`);
  console.log(`POST/api/auth/register - Registrar usuário`);
  console.log(`POST/api/auth/login - Login`);
  console.log(`GET/api/auth/verify - Verificar token`);
  console.log(`POST/api/auth/logout - Logout`);
  console.log(`GET/api/auth/me - Dados do usuário`);
  console.log(`\Posts:`);
  console.log(`GET/api/posts - Listar todos os posts`);
  console.log(`POST/api/posts - Criar post`);
  console.log(`GET/api/posts/me - Meus posts`);
  console.log(`GET/api/posts/empresa/:id - Posts por empresa`);
  console.log(`GET/api/posts/hashtag/:tag - Posts por hashtag`);
  console.log(`DELETE/api/posts/:id - Deletar post`);
  console.log(`\Hashtags:`);
  console.log(`GET/api/hashtags - Listar todas as hashtags`);
  console.log(`POST/api/hashtags - Criar hashtag`);
  console.log(`GET/api/hashtags/top - Hashtags mais populares`);
  console.log(`GET/api/hashtags/:tag/posts - Posts por hashtag`);
});