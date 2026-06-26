import { useState } from "react";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import MenuLateral from "../../componentes/menuLateral";
import "./parceiros.css";

/*dados ficticios para representação*/
const PARCEIROS = [
  { id: 1, sigla: "IN", nome: "Inova Ltda.",      handle: "@inovaltda",      setor: "Produto",      bg: "#FEF3C7", cor: "#92400E" },
  { id: 2, sigla: "GR", nome: "Grupo Resolve",    handle: "@gruporesolve",   setor: "Logística",    bg: "#EDE9FE", cor: "#5B21B6" },
  { id: 3, sigla: "BF", nome: "BizFlow",          handle: "@bizflow",        setor: "Financeiro",   bg: "#EAF3DE", cor: "#3B6D11" },
  { id: 4, sigla: "AC", nome: "Allume Corp",      handle: "@allumecorp",     setor: "Tecnologia",   bg: "#FBEAF0", cor: "#993556" },
  { id: 5, sigla: "DC", nome: "Dev Comunidade",   handle: "@devcomunidade",  setor: "Educação",     bg: "#E6F1FB", cor: "#185FA5" },
  { id: 6, sigla: "NX", nome: "Nexora Solutions", handle: "@nexorasol",      setor: "Consultoria",  bg: "#E0F7FA", cor: "#0DA8B5" },
];

const SUGESTOES = [
  { id: 1, sigla: "MT", nome: "Maximus Tech",      setor: "Tecnologia",  bg: "#FEF3C7", cor: "#92400E" },
  { id: 2, sigla: "VP", nome: "Veritas Partners",  setor: "Finanças",    bg: "#EDE9FE", cor: "#5B21B6" },
  { id: 3, sigla: "OG", nome: "Omega Global",      setor: "Logística",   bg: "#EAF3DE", cor: "#3B6D11" },
  { id: 4, sigla: "CR", nome: "Cora Retail",       setor: "Varejo B2B",  bg: "#FBEAF0", cor: "#993556" },
];

const ABAS = ["Parceiros atuais", "Seguindo", "Seguidores"];

/*componente principal*/
export default function Parceiros() {
  const [abaAtiva, setAbaAtiva]     = useState(0);
  const [busca, setBusca]           = useState("");
  const [seguindo, setSeguindo]     = useState(new Set(PARCEIROS.map((p) => p.id)));
  const [sugeridos, setSugeridos]   = useState(new Set());

  const parceirosFiltrados = PARCEIROS.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.setor.toLowerCase().includes(busca.toLowerCase())
  );

  const handleUnfollow = (id) => {
    setSeguindo((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleFollow = (id) => {
    setSugeridos((prev) => new Set(prev).add(id));
  };

  return (
    <div className="parceiros-page">
    {/* //reinderizando o menu lateral */}
    <MenuLateral/>

      <div className="parceiros-container">
        {/*area principal*/}
        <main className="parceiros-main">
          <div className="parceiros-header">
            <div className="parceiros-header-top">
              <h1 className="parceiros-title">Parceiros</h1>

              <div className="parceiros-search">
                <FaSearch className="icone" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar parceiros..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  aria-label="Buscar parceiros"
                />
              </div>
            </div>

            <div className="parceiros-tabs" role="tablist">
              {ABAS.map((aba, i) => (
                <button
                  key={aba}
                  role="tab"
                  aria-selected={abaAtiva === i}
                  className={`parceiros-tab${abaAtiva === i ? " active" : ""}`}
                  onClick={() => setAbaAtiva(i)}
                >
                  {aba}
                </button>
              ))}
            </div>
          </div>

          <div className="parceiros-body">
            <div className="parceiros-section-label">
              <span>Parceiros atuais</span>
              <span className="parceiros-count-badge">
                {parceirosFiltrados.length} empresas
              </span>
            </div>

            <ul className="parceiros-list" role="list">
              {parceirosFiltrados.map((p) => (
                <li key={p.id} className="parceiro-item">
                  <div
                    className="parceiro-avatar"
                    style={{ background: p.bg, color: p.cor }}
                    aria-hidden="true"
                  >
                    {p.sigla}
                  </div>

                  <div className="parceiro-info">
                    <p className="parceiro-nome">{p.nome}</p>
                    <p className="parceiro-handle">{p.handle}</p>
                    <span className="parceiro-setor">{p.setor}</span>
                  </div>

                  <div className="parceiro-acoes">
                    <button
                      className="btn-mensagem"
                      aria-label={`Enviar mensagem para ${p.nome}`}
                    >
                      <FaEnvelope className="icone" aria-hidden="true" />
                      Mensagem
                    </button>

                    <button
                      className="btn-seguindo"
                      onClick={() => handleUnfollow(p.id)}
                      aria-label={`Deixar de seguir ${p.nome}`}
                    >
                      {seguindo.has(p.id) ? "Seguindo" : "Seguir"}
                    </button>
                  </div>
                </li>
              ))}

              {parceirosFiltrados.length === 0 && (
                <li style={{ padding: "24px", textAlign: "center", color: "var(--color-muted)", fontSize: "0.88rem" }}>
                  Nenhum parceiro encontrado para "{busca}".
                </li>
              )}
            </ul>
          </div>
        </main>

        {/*coluna lateral*/}
        <aside className="parceiros-sidebar" aria-label="Sugestões de parceiros">
          <p className="sidebar-section-title">Sugestões para você</p>

          <div className="sugestoes-grid">
            {SUGESTOES.map((s) => (
              <div key={s.id} className="sugestao-card">
                <div
                  className="sugestao-avatar"
                  style={{ background: s.bg, color: s.cor }}
                  aria-hidden="true"
                >
                  {s.sigla}
                </div>
                <div>
                  <p className="sugestao-nome">{s.nome}</p>
                  <p className="sugestao-setor">{s.setor}</p>
                </div>
                <button
                  className="btn-seguir"
                  onClick={() => handleFollow(s.id)}
                  aria-label={`Seguir ${s.nome}`}
                >
                  {sugeridos.has(s.id) ? "Seguindo ✓" : "+ Seguir"}
                </button>
              </div>
            ))}
          </div>

          {/*perfil em destaque*/}
          <p className="sidebar-section-title" style={{ marginTop: "4px" }}>
            Perfil em destaque
          </p>

          <div className="perfil-destaque">
            <div className="perfil-destaque-cover" />

            <div className="perfil-destaque-body">
              <div className="perfil-destaque-avatar-wrap">
                <div
                  className="perfil-destaque-avatar"
                  style={{ background: "#E0F7FA", color: "#0DA8B5" }}
                  aria-hidden="true"
                >
                  AL
                </div>
              </div>

              <p className="perfil-destaque-nome">Allume Tech</p>
              <p className="perfil-destaque-handle">@allumetech</p>
              <span className="perfil-destaque-setor">Tecnologia · SaaS</span>
              <p className="perfil-destaque-bio">
                Soluções inteligentes para o mercado B2B. Mais de 500 clientes ativos.
              </p>

              <div className="perfil-destaque-stats">
                <div className="perfil-stat">
                  <p className="perfil-stat-numero">214</p>
                  <p className="perfil-stat-label">Posts</p>
                </div>
                <div className="perfil-stat">
                  <p className="perfil-stat-numero">1.2k</p>
                  <p className="perfil-stat-label">Seguidores</p>
                </div>
                <div className="perfil-stat">
                  <p className="perfil-stat-numero">430</p>
                  <p className="perfil-stat-label">Seguindo</p>
                </div>
              </div>

              <button className="btn-seguir-destaque">+ Seguir empresa</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
