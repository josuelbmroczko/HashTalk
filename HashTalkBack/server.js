require('dotenv').config()
const express = require('express');
const cors = require('cors');

const postRoutes = require('./src/routes/postRoutes')
const hashtagRoutes = require ('./src/routes/hashtagRoutes')
const usuarioRoutes = require('./src/routes/usuarioRoutes')
 
const app= express()

app.use(cors())
app.use(express.json())

app.use('/api/posts', postRoutes);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));