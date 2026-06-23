import { useState, useEffect } from 'react';
import MenuLateral from "../../componentes/menuLateral";
import "./Perfil.css";

function Perfil() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/api/auth/me", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUserInfo(data.usuario);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    
    fetchUserData();

    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/api/posts/me", {
          headers: { 'Authorization': `Bearer ${token}` }
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

    fetchMyPosts();
  }, []);

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
                  {userInfo?.nomeEmpresa?.substring(0, 2) || userInfo?.nomeFuncionario?.substring(0, 2) || 'US'}
                </div>

                <button className="editar-perfil">Editar perfil</button>

                <h1>{userInfo?.nomeEmpresa || userInfo?.nomeFuncionario || "Usuário"}</h1>
                <p className="user">
                  @{userInfo?.nomeEmpresa?.toLowerCase().replace(/\s/g, '') || userInfo?.nomeFuncionario?.toLowerCase().replace(/\s/g, '') || 'usuario'} 
                  · {userInfo?.cargoFuncionario || 'Cargo'}
                </p>

                <p className="bio">Apaixonada por tecnologia, design e inovação.</p>
              </div>

              <div className="perfil-numeros">
                <div><strong>{posts.length}</strong> <span>Posts</span></div>
                <div><strong>842</strong> <span>Seguidores</span></div>
                <div><strong>356</strong> <span>Seguindo</span></div>
              </div>

              <div className="perfil-tabs">
                <button className="tab-ativa">Posts</button>
                <button>Respostas</button>
                <button>Curtidas</button>
              </div>

              {loading ? (
                <p style={{ padding: '20px' }}>Carregando posts...</p>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <article className="post-card" key={post.id}>
                    <p>{post.content}</p>
                    <div className="post-acoes">
                      <span>♡ 0</span> <span>💬 0</span>
                      <small>{new Date(post.created_at).toLocaleDateString()}</small>
                    </div>
                  </article>
                ))
              ) : (
                <p style={{ padding: '20px' }}>Nenhum post encontrado.</p>
              )}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Perfil;