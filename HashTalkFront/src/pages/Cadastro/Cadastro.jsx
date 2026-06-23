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

    const dadosCadastro = {
      nomeEmpresa,
      nomeFuncionario: nomeResponsavel,
      cargoFuncionario: cargo,
      emailInstitucional: emailCorporativo,
      senha: senha,
      role: "EMPRESA"
    };

    try {
      const resposta = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      navigate("/login");
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setErrorMsg("Erro ao conectar com o servidor.");
    }
  };

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">
        <aside className="cadastro-side">
          <img src={logoHashTalk} alt="Logo HashTalk" className="logo-cadastro" />
          <p>Rápido e fácil! Sua empresa pronta em minutos.</p>
        </aside>

        <section className="cadastro-content">
          <div className="brand">
            <img src={logoHashTalk} alt="Logo HashTalk" className="brand-logo" />
          </div>
          <h1>Criar conta</h1>
          <p className="subtitle">É rápido e fácil</p>
          
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div>
              <label>Nome da empresa</label>
              <input type="text" placeholder="Ex: Tech Solutions Ltda." value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} required />
            </div>
            <div className="form-row">
              <div>
                <label>Nome do responsável</label>
                <input type="text" placeholder="Nome completo" value={nomeResponsavel} onChange={(e) => setNomeResponsavel(e.target.value)} required />
              </div>
              <div>
                <label>Cargo</label>
                <input type="text" placeholder="Ex: CEO, Gerente..." value={cargo} onChange={(e) => setCargo(e.target.value)} required />
              </div>
            </div>
            <div>
              <label>E-mail corporativo</label>
              <input type="email" placeholder="responsavel@empresa.com" value={emailCorporativo} onChange={(e) => setEmailCorporativo(e.target.value)} required />
            </div>
            <div>
              <label>Senha</label>
              <input type="password" placeholder="Mín. 8 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={8} required />
            </div>
            <button type="submit">Cadastrar</button>
          </form>

          {errorMsg && <div className="mensagem-erro">{errorMsg}</div>}
          {successMsg && <div className="mensagem-sucesso">{successMsg}</div>}

          <p className="login-text">
            Já tem uma conta? <button type="button" onClick={() => navigate("/login")}>Entrar</button>
          </p>
        </section>
      </section>
    </main>
  );
}

export default Cadastro;