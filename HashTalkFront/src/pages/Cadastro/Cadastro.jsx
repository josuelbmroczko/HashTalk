import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";
import logoHashTalk from "../../assets/logo.jpeg";

function Cadastro() {
  const navigate = useNavigate();

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cargo, setCargo] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (!nomeEmpresa || !nomeResponsavel || !cargo || !emailCorporativo || !senha) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    if (senha.length < 8) {
      setErrorMsg("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (!emailCorporativo.includes("@")) {
      setErrorMsg("Insira um e-mail válido.");
      return;
    }

    const dadosCadastro = {
      nomeEmpresa,
      nomeFuncionario: nomeResponsavel,
      cargoFuncionario: cargo,
      emailInstitucional: emailCorporativo,
      senha,
      role: "EMPRESA"
    };

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosCadastro)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErrorMsg(resultado.error || "Erro ao cadastrar empresa.");
        return;
      }

      setSuccessMsg("Empresa cadastrada com sucesso!");

      setNomeEmpresa("");
      setNomeResponsavel("");
      setCargo("");
      setEmailCorporativo("");
      setSenha("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setErrorMsg("Erro ao conectar com o servidor.");
    }
  };

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">
        <aside className="cadastro-side">
          <img
            src={logoHashTalk}
            alt="Logo HashTalk"
            className="logo-cadastro"
          />

          <p>Rápido e fácil! Sua empresa pronta em minutos.</p>
        </aside>

        <section className="cadastro-content">
          <div className="brand">
            <img
              src={logoHashTalk}
              alt="Logo HashTalk"
              className="brand-logo"
            />
          </div>

          <h1>Criar conta</h1>
          <p className="subtitle">É rápido e fácil</p>

          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div>
              <label>Nome da empresa</label>
              <input
                type="text"
                placeholder="Ex: Tech Solutions Ltda."
                value={nomeEmpresa}
                onChange={(event) => setNomeEmpresa(event.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div>
                <label>Nome do responsável</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={nomeResponsavel}
                  onChange={(event) => setNomeResponsavel(event.target.value)}
                  required
                />
              </div>

              <div>
                <label>Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: CEO, Gerente..."
                  value={cargo}
                  onChange={(event) => setCargo(event.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label>E-mail corporativo</label>
              <input
                type="email"
                placeholder="responsavel@empresa.com"
                value={emailCorporativo}
                onChange={(event) => setEmailCorporativo(event.target.value)}
                required
              />
            </div>

            <div>
              <label>Senha</label>
              <input
                 type="password"
                placeholder="Mín. 8 caracteres"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <button type="submit">Cadastrar</button>
          </form>

          {errorMsg && (
            <div className="mensagem-erro">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mensagem-sucesso">
              {successMsg}
            </div>
          )}

          <p className="login-text">
            Já tem uma conta?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Entrar
            </button>
          </p>
        </section>
      </section>
    </main>
  );
}

export default Cadastro;