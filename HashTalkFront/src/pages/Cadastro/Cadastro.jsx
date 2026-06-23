import { useState } from "react";
import "./Cadastro.css";
import logoHashTalk from "../../assets/LogoHashTalk.jpeg";

function Cadastro() {
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cargo, setCargo] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dadosCadastro = {
      nomecompleto: nomeResponsavel,
      username: emailCorporativo,
      email: emailCorporativo,
      senha: senha,
      role: "EMPRESA",
      cargo_responsavel: cargo,
      nome_empresa: nomeEmpresa
    };

    try {
      const resposta = await fetch(
        "http://localhost:3000/api/usuarios/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dadosCadastro)
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setMensagem(resultado.error || "Erro ao cadastrar empresa.");
        return;
      }

      setMensagem("Empresa cadastrada com sucesso!");

      // Limpa os campos após o cadastro
      setNomeEmpresa("");
      setNomeResponsavel("");
      setCargo("");
      setEmailCorporativo("");
      setSenha("");

      console.log(resultado);
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setMensagem("Erro ao conectar com o servidor.");
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

          <p>
            Rápido e fácil! Sua empresa pronta em minutos.
          </p>
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

          <p className="subtitle">
            É rápido e fácil
          </p>

          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div>
              <label>Nome da empresa</label>
              <input
                type="text"
                placeholder="Ex: Tech Solutions Ltda."
                value={nomeEmpresa}
                onChange={(event) =>
                  setNomeEmpresa(event.target.value)
                }
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
                  onChange={(event) =>
                    setNomeResponsavel(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label>Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: CEO, Gerente..."
                  value={cargo}
                  onChange={(event) =>
                    setCargo(event.target.value)
                  }
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
                onChange={(event) =>
                  setEmailCorporativo(event.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Senha</label>
              <input
                type="password"
                placeholder="Mín. 8 caracteres"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                minLength={8}
                required
              />
            </div>

            <button type="submit">
              Cadastrar
            </button>
          </form>

          {mensagem && (
            <p className="mensagem-cadastro">
              {mensagem}
            </p>
          )}

          <p className="login-text">
            Já tem uma conta? <a href="#">Entrar</a>
          </p>
        </section>
      </section>
    </main>
  );
}

export default Cadastro;