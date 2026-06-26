import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Postagem from "./pages/Postagem/Postagem";
import SplashPage from "./pages/Splash/SplashPage";
import LoginPage from "./pages/Login/LoginPage";
import Cadastro from "./pages/Cadastro/Cadastro";
import Perfil from "./pages/Perfil/Perfil";
import Hashtag from "./pages/Hashtag/Hashtag";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import MinhaEmpresa from "./pages/MinhaEmpresa/minhaEmpresa";
import Pesquisa from "./pages/Buscar/Pesquisa";
import Mensagens from "./pages/Mensagens/Mensagens";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Cadastro />} />
      <Route path="/postagem" element={<Postagem />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil/:id?" element={<Perfil />} />
      <Route path="/hashtag/:hashtag" element={<Hashtag />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="/minhaempresa" element={<MinhaEmpresa />} />
      <Route path="/explorar" element={<Pesquisa />} />
      <Route path="/mensagens" element={<Mensagens />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
