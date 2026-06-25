import { useEffect, useState } from "react";
import MenuLateral from "../../componentes/MenuLateral";
import "./Perfil.css";

function Perfil() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUserInfo(data.usuario);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    const carregarPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    "Usuário";

  const cargoPerfil =
    userInfo?.cargoFuncionario ||
    userInfo?.cargo_responsavel ||
    "Cargo";

  const usuarioPerfil = nomePerfil
    .toLowerCase()
    .replace(/\s/g, "");

  const iniciais = nomePerfil.substring(0, 2).toUpperCase();

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="perfil-page">
          <section className="perfil-card">
            <section className="perfil-conteudo">
              <div className="perfil-capa"></div>

              <div className="perfil-info">
                <div className="avatar">
                  {iniciais}
                </div>

                <button className="editar-perfil">
                  Editar perfil
                </button>

                <h1>{nomePerfil}</h1>

                <p className="user">
                  @{usuarioPerfil} · {cargoPerfil}
                </p>

                <p className="bio">
                  Apaixonada por tecnologia, design e inovação.
                </p>
              </div>

              <div className="perfil-numeros">
                <div>
                  <strong>{posts.length}</strong> <span>Posts</span>
                </div>

                <div>
                  <strong>842</strong> <span>Seguidores</span>
                </div>

                <div>
                  <strong>356</strong> <span>Seguindo</span>
                </div>
              </div>

              <div className="perfil-tabs">
                <button className="tab-ativa">Posts</button>
                <button>Respostas</button>
                <button>Curtidas</button>
              </div>

              {loading ? (
                <p style={{ padding: "20px" }}>Carregando posts...</p>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <article className="post-card" key={post.id}>
                    <p>{post.content}</p>

                    <div className="post-acoes">
                      <span>♡ 0</span>
                      <span>💬 0</span>
                      <small>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString()
                          : ""}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <p style={{ padding: "20px" }}>
                  Nenhum post encontrado.
                </p>
              )}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Perfil;