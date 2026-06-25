import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Home from './pages/Home/Home';
import Postagem from './pages/Postagem/Postagem';
import SplashPage from './pages/Splash/SplashPage';
import LoginPage from './pages/Login/LoginPage';
import Cadastro from './pages/Cadastro/Cadastro';
// import Explorar from './paginas/explorar'; //depois vai criado//
// import Notificacoes from './paginas/notificacoes'; //depois vai criado//
import MinhaEmpresa from './pages/MinhaEmpresa/minhaEmpresa'; //depois vai criado//
// import Mensagens from './paginas/mensagens'; //depois vai criado//
import Perfil from './pages/Perfil/Perfil';
import Hashtag from './pages/Hashtag/Hashtag';
import Configuracoes from './pages/Configuracoes/Configuracoes';


function App() {
  
  return (
    // renderizando por rotas, cada tela é uma rota no sistema
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path="/register" element={<Cadastro />} />
      <Route path="/postagem" element={<Postagem />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/hashtag/:hashtag" element={<Hashtag />} />
      <Route path="//:hashtag" element={<Hashtag />} />
      {/* Adicione a linha abaixo para registrar a rota */}
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
  )
}

export default App;
