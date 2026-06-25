import MenuLateral from "../../componentes/menuLateral";
import BarraPesquisa from "../../componentsPaginaBuscar/BarraPesquisa";
import hashtags from "../../data/hashtags.json";
import "./Explorar.css";

function Pesquisa() {
  const destaques = hashtags
    .filter((tag) => tag.posts)
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 6);

  return (
    <div className="app-container">
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
          </section>
        </main>
      </div>
    </div>
  );
}

export default Pesquisa;
