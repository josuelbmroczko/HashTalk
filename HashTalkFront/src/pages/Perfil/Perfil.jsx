import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import MenuLateral from "../../componentes/menuLateral";
import { API_URL } from "../../config/api";
import "./Perfil.css";

function Perfil() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("posts");

  // Edit Profile States
  const [modalAberto, setModalAberto] = useState(false);
  const [editAvatar, setEditAvatar] = useState("");
  const [editCapa, setEditCapa] = useState("");
  const [editNome, setEditNome] = useState("");
  const [editCargo, setEditCargo] = useState("");
  const [editNomeEmpresa, setEditNomeEmpresa] = useState("");

  const abrirModal = () => {
    setEditAvatar(userInfo?.avatarUrl || "");
    setEditCapa(userInfo?.capaUrl || "");
    setEditNome(userInfo?.nomeFuncionario || userInfo?.nomecompleto || "");
    setEditCargo(userInfo?.cargoFuncionario || userInfo?.cargo_responsavel || "");
    setEditNomeEmpresa(userInfo?.nomeEmpresa || userInfo?.nome_empresa || "");
    setModalAberto(true);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCapaFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditCapa(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const salvarPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatarUrl: editAvatar,
          capaUrl: editCapa,
          nomecompleto: editNome,
          cargoFuncionario: editCargo,
          nomeEmpresa: editNomeEmpresa
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.usuario);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setModalAberto(false);
      } else {
        alert("Erro ao atualizar perfil");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor");
    }
  };

  const { id } = useParams();
  const loggedInUser = JSON.parse(localStorage.getItem("usuario"));
  const isOwnProfile = !id || parseInt(id) === loggedInUser?.id;

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = id ? `${API_URL}/api/usuarios/${id}` : `${API_URL}/api/auth/me`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUserInfo(data.usuario || data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuario:", error);
      }
    };

    const carregarPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = id ? `${API_URL}/api/posts/usuario/${id}` : `${API_URL}/api/posts/me`;
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setPosts(data.posts || []);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const carregarComentarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = id ? `${API_URL}/api/posts/usuario/${id}/comments` : `${API_URL}/api/posts/me/comments`;
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setComments(data.comments || []);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    };

    const carregarCurtidas = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = id ? `${API_URL}/api/posts/usuario/${id}/likes` : `${API_URL}/api/posts/me/likes`;
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setLikedPosts(data.posts || []);
      } catch (error) {
        console.error("Erro ao buscar curtidas:", error);
      }
    };

    carregarPerfil();
    carregarPosts();
    carregarComentarios();
    carregarCurtidas();
  }, [id]);

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
            <div 
              className="perfil-capa" 
              style={userInfo?.capaUrl ? { backgroundImage: `url(${userInfo.capaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            />

            <div className="perfil-info">
              <div className="avatar">
                {userInfo?.avatarUrl ? (
                  <img src={userInfo.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  iniciais || "HT"
                )}
              </div>
              {isOwnProfile && (
                <button type="button" className="editar-perfil" onClick={abrirModal}>Editar perfil</button>
              )}

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
            <button type="button" className={abaAtiva === "posts" ? "tab-ativa" : ""} onClick={() => setAbaAtiva("posts")}>Posts</button>
            <button type="button" className={abaAtiva === "respostas" ? "tab-ativa" : ""} onClick={() => setAbaAtiva("respostas")}>Respostas</button>
            <button type="button" className={abaAtiva === "curtidas" ? "tab-ativa" : ""} onClick={() => setAbaAtiva("curtidas")}>Curtidas</button>
          </div>

          <section className="feed perfil-feed">
            {loading ? (
              <div className="loading-state">Carregando...</div>
            ) : abaAtiva === "posts" ? (
              posts.length > 0 ? (
                posts.map((post) => (
                  <article className="post-card" key={post.id}>
                    <div className="post-card-header">
                      <div className="avatar post-mini-avatar">
                        {userInfo?.avatarUrl ? (
                          <img src={userInfo.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          iniciais || "HT"
                        )}
                      </div>
                      <div>
                        <strong>{nomePerfil}</strong>
                        <span>@{usuarioPerfil}</span>
                      </div>
                    </div>
                    <p>{post.content}</p>
                    {post.image_url && (
                      <div className="post-image-container">
                        <img src={post.image_url} alt="Imagem do post" className="post-image" />
                      </div>
                    )}
                    <div className="post-acoes">
                      <span><FaRegHeart /> {post.likes?.length || 0}</span>
                      <span><FaRegComment /> {post.comments?.length || 0}</span>
                      <small>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString("pt-BR") : ""}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">Nenhum post encontrado.</div>
              )
            ) : abaAtiva === "respostas" ? (
              comments.length > 0 ? (
                comments.map((comment) => (
                  <article className="post-card" key={comment.id}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                      Em resposta ao post de <Link to={`/perfil/${comment.post?.usuario?.id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>{comment.post?.usuario?.nome_empresa || comment.post?.usuario?.nomecompleto || 'Usuário'}</Link>
                    </div>
                    <div style={{ backgroundColor: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem', color: '#475569', borderLeft: '3px solid #cbd5e1' }}>
                      {comment.post?.content?.substring(0, 120)}{comment.post?.content?.length > 120 ? '...' : ''}
                    </div>
                    <div className="post-card-header">
                      <div className="avatar post-mini-avatar">
                        {userInfo?.avatarUrl ? (
                          <img src={userInfo.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          iniciais || "HT"
                        )}
                      </div>
                      <div>
                        <strong>{nomePerfil}</strong>
                        <span>@{usuarioPerfil}</span>
                      </div>
                    </div>
                    <p>{comment.content}</p>
                    <div className="post-acoes">
                      <small>
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString("pt-BR") : ""}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">Nenhuma resposta encontrada.</div>
              )
            ) : (
              likedPosts.length > 0 ? (
                likedPosts.map((post) => {
                  const postAuthor = post.usuario?.nome_empresa || post.usuario?.nomecompleto || 'Usuário';
                  return (
                    <article className="post-card" key={post.id}>
                      <div className="post-card-header">
                        <Link to={`/perfil/${post.usuario?.id}`} style={{ display: 'flex', gap: '12px', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                          <div className="avatar post-mini-avatar">
                            {post.usuario?.avatar_url ? (
                              <img src={post.usuario.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              postAuthor.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'HT'
                            )}
                          </div>
                          <div>
                            <strong>{postAuthor}</strong>
                            <span>@{post.usuario?.username}</span>
                          </div>
                        </Link>
                      </div>
                      <p>{post.content}</p>
                      {post.image_url && (
                        <div className="post-image-container">
                          <img src={post.image_url} alt="Imagem do post" className="post-image" />
                        </div>
                      )}
                      <div className="post-acoes">
                        <span style={{ color: '#ef4444' }}><FaRegHeart /> {post.likes?.length || 0}</span>
                        <span><FaRegComment /> {post.comments?.length || 0}</span>
                        <small>
                          {post.created_at ? new Date(post.created_at).toLocaleDateString("pt-BR") : ""}
                        </small>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="empty-state">Nenhuma curtida encontrada.</div>
              )
            )}
          </section>
        </main>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button type="button" className="modal-close" onClick={() => setModalAberto(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome Completo / Representante</label>
                <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input type="text" value={editNomeEmpresa} onChange={(e) => setEditNomeEmpresa(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Cargo / Responsabilidade</label>
                <input type="text" value={editCargo} onChange={(e) => setEditCargo(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Foto de Perfil (Avatar)</label>
                <input type="text" placeholder="URL da foto..." value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} />
                <div style={{ marginTop: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleAvatarFile} />
                </div>
              </div>
              <div className="form-group">
                <label>Imagem de Capa</label>
                <input type="text" placeholder="URL da capa..." value={editCapa} onChange={(e) => setEditCapa(e.target.value)} />
                <div style={{ marginTop: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleCapaFile} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button type="button" className="btn-salvar" onClick={salvarPerfil}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
