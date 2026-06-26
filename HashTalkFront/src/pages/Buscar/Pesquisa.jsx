import { useState, useEffect } from "react";
import MenuLateral from "../../componentes/menuLateral";
import BarraPesquisa from "../../componentsPaginaBuscar/BarraPesquisa";
import hashtags from "../../data/hashtags.json";
import { API_URL } from "../../config/api";
import "./Explorar.css";

function Pesquisa() {
  const [colegas, setColegas] = useState([]);

  useEffect(() => {
    const fetchColegas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setColegas(data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      }
    };
    fetchColegas();
  }, []);

  const destaques = hashtags
    .filter((tag) => tag.posts)
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 6);

  return (
    <div className="app-container explorar-shell">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="principal">
          <header className="main-header">
            <div className="page-title-group">
              <h1>Explorar</h1>
              <p className="page-subtitle">Encontre empresas, temas e conversas relevantes.</p>
            </div>
          </header>

          <section className="page-section explorar-page">
            <div className="explorar-card explorar-search-card">
              <div className="explorar-card-header">
                <span>Pesquisa inteligente</span>
                <strong>Busque por hashtags, mercados e oportunidades.</strong>
              </div>
              <BarraPesquisa />
            </div>

            <div className="explorar-grid">
              <article className="explorar-card explorar-feature">
                <span className="explorar-kicker">Em alta</span>
                <h2>{destaques[0]?.nome || "#tecnologia"}</h2>
                <p>
                  Tema com maior volume de conversas agora. Use para acompanhar
                  tendencias e encontrar empresas alinhadas ao seu mercado.
                </p>
              </article>

              <article className="explorar-card explorar-feature">
                <span className="explorar-kicker">Oportunidade</span>
                <h2>#parcerias</h2>
                <p>
                  Hashtags comerciais ajudam sua empresa a aparecer em buscas
                  de colaboracao, fornecedores e novos clientes.
                </p>
              </article>
            </div>

            <div className="explorar-grid" style={{ marginTop: '16px' }}>
              <section className="explorar-card">
                <div className="explorar-card-header">
                  <span>Assuntos populares</span>
                  <strong>Principais conversas B2B para explorar hoje.</strong>
                </div>

                <div className="trend-list">
                  {destaques.map((tag, index) => (
                    <a className="trend-item" href={`/hashtag/${tag.nome.replace("#", "")}`} key={tag.id}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{tag.nome}</strong>
                      <small>{tag.posts.toLocaleString("pt-BR")} posts</small>
                    </a>
                  ))}
                </div>
              </section>

              <section className="explorar-card">
                <div className="explorar-card-header">
                  <span>Sua Rede</span>
                  <strong>Comunidade (Todos os Usuários)</strong>
                </div>

                <div className="colegas-list" style={{ display: 'grid', gap: '10px' }}>
                  {colegas.length > 0 ? (
                    colegas.map((colega) => {
                      const iniciais = (colega.nomecompleto || "Usuário")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();

                      return (
                        <a 
                          className="trend-item colega-item" 
                          href={`/perfil/${colega.id}`} 
                          key={colega.id}
                          style={{ gridTemplateColumns: '42px 1fr' }}
                        >
                          <div 
                            className="avatar" 
                            style={{ 
                              width: '36px', 
                              height: '36px', 
                              fontSize: '14px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              borderRadius: '50%',
                              backgroundColor: '#0891B2',
                              color: '#ffffff',
                              fontWeight: '700',
                              border: 'none',
                              boxShadow: 'none',
                              margin: 0
                            }}
                          >
                            {colega.avatar_url || colega.avatarUrl ? (
                              <img 
                                src={colega.avatar_url || colega.avatarUrl} 
                                alt={colega.nomecompleto} 
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                              />
                            ) : (
                              iniciais || "HT"
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: '0.95rem' }}>{colega.nomecompleto}</strong>
                            <small style={{ color: 'var(--color-muted)', alignSelf: 'flex-start' }}>
                              {colega.cargo_responsavel || "Colaborador"}
                            </small>
                          </div>
                        </a>
                      );
                    })
                  ) : (
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '16px' }}>
                      Nenhum usuário encontrado.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Pesquisa;
