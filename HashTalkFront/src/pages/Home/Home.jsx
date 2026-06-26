import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment, FaRegComment, FaPaperPlane } from "react-icons/fa";
import MenuLateral from "../../componentes/menuLateral";
import { API_URL } from "../../config/api";
import "./Home.css";

const getAuthorName = (post) =>
  post.usuario?.nome_empresa ||
  post.usuario?.nomeEmpresa ||
  post.usuario?.nomecompleto ||
  "Usuário";

const getInitials = (name) => {
  if (!name) return "HT";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("recentes");
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  const [loggedUser] = useState(() => {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
  });

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

  useEffect(() => {
    fetchPosts();
    // Auto-refresh posts every 8 seconds
    const intervalo = setInterval(fetchPosts, 8000);
    return () => clearInterval(intervalo);
  }, [abaAtiva]);

  const handleLike = async (postId) => {
    if (!loggedUser) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              const alreadyLiked = p.likes?.some((l) => l.usuario_id === loggedUser.id);
              const updatedLikes = alreadyLiked
                ? p.likes.filter((l) => l.usuario_id !== loggedUser.id)
                : [...(p.likes || []), { usuario_id: loggedUser.id }];
              return { ...p, likes: updatedLikes };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error("Erro ao curtir post:", err);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const text = newCommentText[postId];
    if (!text || !text.trim() || !loggedUser) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text.trim() }),
      });

      if (res.ok) {
        const comment = await res.json();
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              return { ...p, comments: [...(p.comments || []), comment] };
            }
            return p;
          })
        );
        setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    }
  };

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
                const isLikedByMe = post.likes?.some((l) => l.usuario_id === loggedUser?.id);
                const isCommentsExpanded = !!expandedComments[post.id];

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

                    {/* Likes and Comments Actions */}
                    <div className="post-actions" style={{ display: "flex", gap: "24px", marginTop: "15px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                      <button 
                        onClick={() => handleLike(post.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: isLikedByMe ? "#ef4444" : "#64748b",
                          fontSize: "0.95rem",
                          transition: "color 0.2s"
                        }}
                      >
                        {isLikedByMe ? <FaHeart /> : <FaRegHeart />}
                        <span>{post.likes?.length || 0}</span>
                      </button>

                      <button 
                        onClick={() => toggleComments(post.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: isCommentsExpanded ? "#3b82f6" : "#64748b",
                          fontSize: "0.95rem",
                          transition: "color 0.2s"
                        }}
                      >
                        {isCommentsExpanded ? <FaComment /> : <FaRegComment />}
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {isCommentsExpanded && (
                      <div className="comments-section" style={{ marginTop: "15px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                        {/* List of comments */}
                        {post.comments && post.comments.length > 0 ? (
                          <div className="comments-list" style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "15px" }}>
                            {post.comments.map((comment) => {
                              const commentAuthor = comment.usuario?.nomecompleto || "Usuário";
                              return (
                                <div key={comment.id} className="comment-item" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                  <div 
                                    className="comment-avatar" 
                                    style={{ 
                                      width: "32px", 
                                      height: "32px", 
                                      borderRadius: "50%", 
                                      backgroundColor: "#e2e8f0", 
                                      display: "flex", 
                                      alignItems: "center", 
                                      justify: "center",
                                      fontWeight: "600",
                                      fontSize: "0.8rem",
                                      color: "#475569",
                                      flexShrink: 0
                                    }}
                                  >
                                    {comment.usuario?.avatar_url ? (
                                      <img src={comment.usuario.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                      getInitials(commentAuthor)
                                    )}
                                  </div>
                                  <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                      <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>{commentAuthor}</strong>
                                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155", lineLine: "1.4" }}>{comment.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ margin: "0 0 15px 0", fontSize: "0.85rem", color: "#64748b", textAlign: "center" }}>Sem respostas ainda. Seja o primeiro a comentar!</p>
                        )}

                        {/* Comment form input */}
                        <form 
                          onSubmit={(e) => handleCommentSubmit(e, post.id)} 
                          style={{ display: "flex", gap: "10px", alignItems: "center" }}
                        >
                          <input 
                            type="text" 
                            placeholder="Escreva sua resposta..."
                            value={newCommentText[post.id] || ""}
                            onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.85rem",
                              outline: "none"
                            }}
                            required
                          />
                          <button 
                            type="submit" 
                            style={{
                              backgroundColor: "#3b82f6",
                              color: "#ffffff",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaPaperPlane size={12} />
                          </button>
                        </form>
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
