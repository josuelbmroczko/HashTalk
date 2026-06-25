import { useState } from "react";
import MenuLateral from "../../componentes/menuLateral";
import "./minhaEmpresa.css";

function MinhaEmpresa() {
  const [usuario] = useState(() => {
    const dados = localStorage.getItem("usuario");
    return dados ? JSON.parse(dados) : null;
  });

  const nomeEmpresa = usuario?.nomeEmpresa || "Minha empresa";
  const responsavel = usuario?.nomeFuncionario || usuario?.nomecompleto || "Responsavel";
  const cargo = usuario?.cargoFuncionario || "Cargo";

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="principal">
          <header className="main-header">
            <div className="page-title-group">
              <h1>Minha empresa</h1>
              <p className="page-subtitle">Dados principais do perfil corporativo.</p>
            </div>
          </header>

          <section className="page-section empresa-page">
            <article className="empresa-panel">
              <div className="empresa-panel-header">
                <div className="empresa-avatar">{nomeEmpresa.substring(0, 2).toUpperCase()}</div>
                <div>
                  <h2>{nomeEmpresa}</h2>
                  <p>@{nomeEmpresa.toLowerCase().replace(/\s/g, "")}</p>
                </div>
              </div>

              <div className="empresa-grid">
                <div>
                  <span>Responsavel</span>
                  <strong>{responsavel}</strong>
                </div>
                <div>
                  <span>Cargo</span>
                  <strong>{cargo}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>Ativa</strong>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MinhaEmpresa;
