import React from "react";
import { useNavigate } from "react-router-dom";
import "./SplashPage.css";

import logoIcon from "../../assets/logo.jpeg";

const SplashPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container-main">
      <div className="container-left">
        <div className="container-content">
          <div className="logo">
            <img src={logoIcon} alt="HashTalk Logo" className="logo-img" />
          </div>
          <span className="logo-b2b">B2B</span>
          <div className="card1">
            <p>Novo parceiro B2B</p>
          </div>
          <div className="card2">
            <p>Vamos fechar negócio!</p>
          </div>
        </div>
      </div>

      <div className="container-rigth">
        <div className="content">
          <div className="splash-title-section">
            <h1 className="splash-title">
              Conecte <span className="highlight">ideias</span>.
            </h1>
            <h2 className="splash-subtitle">
              Compartilhe o que <span className="highlight">importa</span>.
            </h2>
          </div>
          <div className="splash-description">
            <p className="splash-text">
              A rede exclusiva para empresas que lideram. Publique com hashtags
              geradas por IA e amplie sua presença no mercado{" "}
              <strong>B2B</strong>.
            </p>
          </div>
          <div className="splash-actions">
            <button className="btn-primary btn-start" onClick={handleStart}>
              <span>Começar</span>
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            <button className="btn-secondary btn-login" onClick={handleLogin}>
              Já tenho uma conta?{" "}
              <span className="login-highlight">Entrar</span>
            </button>
          </div>
          <div className="splash-badge">
            <span className="badge-text">Novo parceiro B2B</span>
          </div>
        </div>
        <div className="splash-footer">
          <p className="footer-text">
            Vamos fechar <span className="highlight">negócio</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
