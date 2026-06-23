import "./Cadastro.css";
import logoHashTalk from "../../assets/LogoHashTalk.jpeg";

function Cadastro() {
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

          <p className="subtitle">
            É rápido e fácil
          </p>

          <form className="cadastro-form">

            
            <div>
              <label>Nome da empresa</label>
              <input
                type="text"
                placeholder="Ex: Tech Solutions Ltda."
              />
            </div>

            <div className="form-row">
              <div>
                <label>Nome do responsável</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label>Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: CEO, Gerente..."
                />
              </div>
            </div>

           
            <div>
              <label>E-mail corporativo</label>
              <input
                type="email"
                placeholder="responsavel@empresa.com"
              />
            </div>

            
            <div>
              <label>Senha</label>
              <input
                type="password"
                placeholder="Mín. 8 caracteres"
              />
            </div>

            <button type="submit">
              Cadastrar
            </button>

          </form>

          <p className="login-text">
            Já tem uma conta? <a href="#">Entrar</a>
          </p>

        </section>
      </section>
    </main>
  );
}

export default Cadastro;