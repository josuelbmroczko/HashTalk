import { useEffect, useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import MenuLateral from "../../componentes/menuLateral";
import { API_URL } from "../../config/api";
import "./Perfil.css";

function Perfil() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUserInfo(data.usuario);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuario:", error);
      }
    };

    const carregarPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/posts/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Erro ao buscar meus posts:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
    carregarPosts();
  }, []);

  const nomePerfil =
    userInfo?.nomeEmpresa ||
    userInfo?.nomeFuncionario ||
    userInfo?.nomecompleto ||
    "Usuario";

  const cargoPerfil =
    userInfo?.cargoFuncionario ||
    userInfo?.cargo_responsavel ||
    "Cargo";

  const usuarioPerfil = nomePerfil.toLowerCase().replace(/\s/g, "");
  const iniciais = nomePerfil
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="principal perfil-page">
          <section className="perfil-hero">
            <div className="perfil-capa" />

            <div className="perfil-info">
              <div className="avatar">{iniciais || "HT"}</div>
              <button type="button" className="editar-perfil">Editar perfil</button>

              <div className="perfil-identidade">
                <h1>{nomePerfil}</h1>
                <p className="user">@{usuarioPerfil} · {cargoPerfil}</p>
                <p className="bio">Perfil corporativo para conexoes, tendencias e oportunidades B2B.</p>
                <div className="perfil-badges">
                  <span>Empresa verificada</span>
                  <span>Rede B2B</span>
                  <span>Ativo</span>
                </div>
              </div>
            </div>

            <div className="perfil-numeros">
              <div>
                <strong>{posts.length}</strong>
                <span>Posts</span>
              </div>
              <div>
                <strong>842</strong>
                <span>Seguidores</span>
              </div>
              <div>
                <strong>356</strong>
                <span>Seguindo</span>
              </div>
            </div>
          </section>

          <div className="perfil-tabs">
            <button type="button" className="tab-ativa">Posts</button>
            <button type="button">Respostas</button>
            <button type="button">Curtidas</button>
          </div>

          <section className="feed perfil-feed">
            {loading ? (
              <div className="loading-state">Carregando posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-card-header">
                    <div className="avatar post-mini-avatar">{iniciais || "HT"}</div>
                    <div>
                      <strong>{nomePerfil}</strong>
                      <span>@{usuarioPerfil}</span>
                    </div>
                  </div>

                  <p>{post.content}</p>

                  <div className="post-acoes">
                    <span><FaRegHeart /> 0</span>
                    <span><FaRegComment /> 0</span>
                    <small>
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("pt-BR")
                        : ""}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">Nenhum post encontrado.</div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Perfil;
