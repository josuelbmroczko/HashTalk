import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailInstitucional: "",
    senha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailInstitucional || !formData.senha) {
      setError("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/postagem");
    } catch (error) {
      setError(error.message || "Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      {/* Lado Esquerdo - Apenas com a Logo e nome */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">
            <div className="logo-placeholder">
              <span className="logo-text">HashTalk</span>
              <span className="logo-b2b">B2B</span>
            </div>
          </div>
          <div className="login-welcome">
            <h2 className="welcome-title">Bem-vindo de volta</h2>
            <p className="welcome-subtitle">Acesse sua conta corporativa</p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h1 className="login-title">Faça login</h1>
            <p className="login-subtitle">Entre com suas credenciais corporativas</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="emailInstitucional" className="form-label">
                E-mail corporativo
              </label>
              <input
                type="email"
                id="emailInstitucional"
                name="emailInstitucional"
                className="form-input"
                placeholder="empresa@dominio.com"
                value={formData.emailInstitucional}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  name="senha"
                  className="form-input"
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex="-1"
                  disabled={isLoading}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="form-options">
              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="login-footer">
            <p className="register-text">
              Ainda não tem conta?{" "}
              <button
                type="button"
                className="register-link"
                onClick={handleRegister}
                disabled={isLoading}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;