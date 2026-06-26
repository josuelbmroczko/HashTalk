import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuLateral from "../../componentes/menuLateral";
import { API_URL } from "../../config/api";
import "./Home.css";

const getAuthorName = (post) =>
  post.usuario?.nome_empresa ||
  post.usuario?.nomeEmpresa ||
  post.usuario?.nomecompleto ||
  "Usuário";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("recentes");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = abaAtiva === "colegas" ? `${API_URL}/api/posts/colegas` : `${API_URL}/api/posts`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setPosts(Array.isArray(data.posts) ? data.posts : []);
        } else {
          console.error("Erro ao buscar posts:", data.error);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    const intervalo = setInterval(fetchPosts, 5000);

    return () => clearInterval(intervalo);
  }, [abaAtiva]);

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="principal">
          <header className="main-header">
            <div className="page-title-group">
              <h1>Feed</h1>
              <p className="page-subtitle">
                Acompanhe atualizações e conversas da sua rede B2B.
              </p>
            </div>

            <div className="tabs" aria-label="Filtro do feed">
              <span className={`tab ${abaAtiva === "recentes" ? "active" : ""}`} onClick={() => setAbaAtiva("recentes")}>Recentes</span>
              <span className={`tab ${abaAtiva === "colegas" ? "active" : ""}`} onClick={() => setAbaAtiva("colegas")}>Colegas</span>
            </div>
          </header>

          <section className="feed">
            {loading ? (
              <div className="loading-state">Carregando publicações...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                const authorName = getAuthorName(post);

                return (
                  <article className="post" key={post.id}>
                    <div className="post-author">
                      <Link to={`/perfil/${post.usuario?.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", gap: "12px", alignItems: "center" }}>
                        <div className="post-avatar">
                          {post.usuario?.avatarUrl ? (
                            <img src={post.usuario.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            getInitials(authorName) || "HT"
                          )}
                        </div>
                        <div>
                          <strong>{authorName}</strong>
                          <p className="post-meta">Publicado por {post.usuario?.role === 'EMPRESA' ? 'Empresa' : 'Funcionário'}</p>
                        </div>
                      </Link>
                    </div>

                    <p className="post-content">{post.content}</p>

                    {post.image_url && (
                      <div className="post-image-container">
                        <img src={post.image_url} alt="Imagem do post" className="post-image" />
                      </div>
                    )}

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="post-tags" aria-label="Hashtags">
                        {post.hashtags.map((tag, idx) => (
                          <Link
                            className="post-tag"
                            to={`/hashtag/${tag.replace("#", "")}`}
                            key={`${tag}-${idx}`}
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="empty-state">
                Nenhuma publicação encontrada por enquanto.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
