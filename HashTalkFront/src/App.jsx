
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react'

import './App.css'
import Home from './paginas/home'
import Postagem from './paginas/postagem';
import Explorar from './paginas/explorar';
import Notificacoes from './paginas/notificacoes';
import MinhaEmpresa from './paginas/minhaempresa';
import Mensagens from './paginas/mensagens';
import Perfil from './paginas/perfil';
import Configuracoes from './paginas/configuracoes';


function App() {
  
  return (
    //reinderizando por rotas, cada tela é uma rota no sistema
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/postagem" element={<Postagem />} />
      <Route path="/explorar" element={<Explorar />} />
      <Route path="/notificacoes" element={<Notificacoes />} />
      <Route path="/minhaempresa" element={<MinhaEmpresa />} />
      <Route path="/mensagens" element={<Mensagens />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
   
  )

}

export default App;