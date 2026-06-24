
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react'

import './App.css'
import Home from './paginas/home'
import Postagem from './paginas/postagem';
// import Explorar from './paginas/explorar'; //depois vai criado//
// import Notificacoes from './paginas/notificacoes'; //depois vai criado//
// import MinhaEmpresa from './paginas/minhaempresa'; //depois vai criado//
// import Mensagens from './paginas/mensagens'; //depois vai criado//
//import Perfil from './paginas/perfil'; //depois vai criado//
import Configuracoes from './paginas/configuracoes';


function App() {
  
  return (
    // renderizando por rotas, cada tela é uma rota no sistema
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/postagem" element={<Postagem />} />
      {/* Adicione a linha abaixo para registrar a rota */}
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
  )
}

export default App;