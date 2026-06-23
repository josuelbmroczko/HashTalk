import { Routes, Route } from 'react-router-dom';
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import Home from './paginas/home'
import Postagem from './paginas/postagem';
import Explorar from './paginas/explorar';
import Notificacoes from './paginas/notificacoes';
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
      <Route path="/mensagens" element={<Mensagens />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
  )
}

export default App
