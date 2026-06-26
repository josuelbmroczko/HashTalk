import { useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../../componentes/menuLateral";
import { API_URL } from "../../config/api";
import "./parceiros.css";

const ABAS = ["Parceiros atuais", "Seguindo", "Seguidores"];
const AVATAR_COLORS = [
  ["#FEF3C7", "#92400E"],
  ["#EDE9FE", "#5B21B6"],
  ["#EAF3DE", "#3B6D11"],
  ["#FBEAF0", "#993556"],
  ["#E6F1FB", "#185FA5"],
  ["#E0F7FA", "#0DA8B5"],
];

const getDisplayName = (usuario) =>
  usuario?.nome_empresa || usuario?.nomecompleto || "Usuario";

const getSetor = (usuario) =>
  usuario?.cargo_responsavel || (usuario?.role === "EMPRESA" ? "Empresa" : "Profissional");

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "HT";

const withAvatarStyle = (usuario) => {
  const [bg, cor] = AVATAR_COLORS[usuario.id % AVATAR_COLORS.length];
  const nome = getDisplayName(usuario);
  return {
    ...usuario,
    nome,
    sigla: getInitials(nome),
    handle: `@${usuario.username}`,
    setor: getSetor(usuario),
    bg,
    cor,
  };
};

export default function Parceiros() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [counts, setCounts] = useState({ following: 0, followers: 0, suggestions: 0 });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [followLoading, setFollowLoading] = useState(null);

  const carregarParceiros = async () => {
    if (!token) return;

    try {
      setErro("");
      const usuariosRes = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!usuariosRes.ok) {
        throw new Error("Nao foi possivel carregar parceiros.");
      }

      const usuariosData = await usuariosRes.json();
      const followingFromUsers = usuariosData.filter((usuario) => usuario.isFollowing);
      const followersList = [];
      const suggestionsList = usuariosData.filter((usuario) => !usuario.isFollowing);
      const followingIds = new Set(followingFromUsers.map((usuario) => usuario.id));

      setUsuarios(usuariosData.map((usuario) => withAvatarStyle({
        ...usuario,
        isFollowing: usuario.isFollowing || followingIds.has(usuario.id),
      })));
      setSeguindo(followingFromUsers.map(withAvatarStyle));
      setSeguidores(followersList.map(withAvatarStyle));
      setSugestoes(suggestionsList.map(withAvatarStyle));
      setCounts({
        following: followingFromUsers.length,
        followers: followersList.length,
        suggestions: suggestionsList.length,
      });
    } catch (error) {
      console.error("Erro ao carregar parceiros:", error);
      setErro(error.message || "Erro ao carregar parceiros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarParceiros();
  }, [token]);

  const listaAtiva = useMemo(() => {
    if (abaAtiva === 1) return seguindo;
    if (abaAtiva === 2) return seguidores;
    return usuarios;
  }, [abaAtiva, seguidores, seguindo, usuarios]);

  const parceirosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return listaAtiva;

    return listaAtiva.filter((p) =>
      [p.nome, p.handle, p.setor, p.email]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(termo))
    );
  }, [busca, listaAtiva]);

  const toggleFollow = async (usuarioId) => {
    if (followLoading === usuarioId) return;

    setFollowLoading(usuarioId);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${usuarioId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nao foi possivel atualizar o parceiro.");
      }

      const data = await res.json();
      const isFollowing = Boolean(data.following);
      const parceiroAtual =
        usuarios.find((usuario) => usuario.id === usuarioId) ||
        sugestoes.find((usuario) => usuario.id === usuarioId) ||
        seguindo.find((usuario) => usuario.id === usuarioId) ||
        seguidores.find((usuario) => usuario.id === usuarioId);

      const parceiroAtualizado = parceiroAtual
        ? withAvatarStyle({
            ...parceiroAtual,
            isFollowing,
            totalSeguidores: data.totalSeguidores ?? parceiroAtual.totalSeguidores,
          })
        : null;

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioId
            ? withAvatarStyle({
                ...usuario,
                isFollowing,
                totalSeguidores: data.totalSeguidores ?? usuario.totalSeguidores,
              })
            : usuario
        )
      );

      setSugestoes((prev) => {
        const semParceiro = prev.filter((usuario) => usuario.id !== usuarioId);
        return isFollowing || !parceiroAtualizado ? semParceiro : [parceiroAtualizado, ...semParceiro];
      });

      setSeguindo((prev) => {
        const semParceiro = prev.filter((usuario) => usuario.id !== usuarioId);
        return isFollowing && parceiroAtualizado ? [parceiroAtualizado, ...semParceiro] : semParceiro;
      });

      setSeguidores((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioId ? { ...usuario, isFollowing } : usuario
        )
      );

      setCounts((prev) => ({
        ...prev,
        following: Math.max(0, (prev.following || 0) + (isFollowing ? 1 : -1)),
        suggestions: Math.max(0, (prev.suggestions || 0) + (isFollowing ? -1 : 1)),
      }));
    } catch (error) {
      console.error("Erro ao seguir parceiro:", error);
      setErro(error.message || "Erro ao seguir parceiro.");
    } finally {
      setFollowLoading(null);
    }
  };

  const abrirMensagem = (usuarioId) => {
    navigate(`/mensagens?userId=${usuarioId}`);
  };

  const abrirPerfil = (usuarioId) => {
    navigate(`/perfil/${usuarioId}`);
  };

  const destaque = sugestoes[0] || seguidores[0] || seguindo[0] || usuarios[0];
  const countAtivo = abaAtiva === 1 ? counts.following : abaAtiva === 2 ? counts.followers : usuarios.length;

  return (
    <div className="parceiros-page">
      <MenuLateral />

      <div className="parceiros-container">
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
                  type="button"
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
              <span>{ABAS[abaAtiva]}</span>
              <span className="parceiros-count-badge">
                {countAtivo || 0} {countAtivo === 1 ? "contato" : "contatos"}
              </span>
            </div>

            {erro && <div className="parceiros-feedback">{erro}</div>}

            <ul className="parceiros-list" role="list">
              {loading && (
                <li className="parceiros-empty">Carregando parceiros...</li>
              )}

              {!loading && parceirosFiltrados.map((p) => (
                <li key={p.id} className="parceiro-item" onClick={() => abrirPerfil(p.id)}>
                  {p.avatar_url ? (
                    <img className="parceiro-avatar" src={p.avatar_url} alt={p.nome} />
                  ) : (
                    <div
                      className="parceiro-avatar"
                      style={{ background: p.bg, color: p.cor }}
                      aria-hidden="true"
                    >
                      {p.sigla}
                    </div>
                  )}

                  <div className="parceiro-info">
                    <p className="parceiro-nome">{p.nome}</p>
                    <p className="parceiro-handle">{p.handle}</p>
                    <span className="parceiro-setor">{p.setor}</span>
                  </div>

                  <div className="parceiro-acoes" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-mensagem"
                      onClick={() => abrirMensagem(p.id)}
                      aria-label={`Enviar mensagem para ${p.nome}`}
                    >
                      <FaEnvelope className="icone" aria-hidden="true" />
                      Mensagem
                    </button>

                    <button
                      type="button"
                      className={`btn-seguindo${p.isFollowing ? "" : " seguir"}`}
                      onClick={() => toggleFollow(p.id)}
                      disabled={followLoading === p.id}
                      aria-label={p.isFollowing ? `Deixar de seguir ${p.nome}` : `Seguir ${p.nome}`}
                    >
                      {followLoading === p.id ? "..." : p.isFollowing ? "Seguindo" : "Seguir"}
                    </button>
                  </div>
                </li>
              ))}

              {!loading && parceirosFiltrados.length === 0 && (
                <li className="parceiros-empty">
                  Nenhum parceiro encontrado{busca ? ` para "${busca}"` : ""}.
                </li>
              )}
            </ul>
          </div>
        </main>

        <aside className="parceiros-sidebar" aria-label="Sugestoes de parceiros">
          <p className="sidebar-section-title">Sugestoes para voce</p>

          <div className="sugestoes-grid">
            {sugestoes.slice(0, 4).map((s) => (
              <div key={s.id} className="sugestao-card" onClick={() => abrirPerfil(s.id)}>
                {s.avatar_url ? (
                  <img className="sugestao-avatar" src={s.avatar_url} alt={s.nome} />
                ) : (
                  <div
                    className="sugestao-avatar"
                    style={{ background: s.bg, color: s.cor }}
                    aria-hidden="true"
                  >
                    {s.sigla}
                  </div>
                )}
                <div>
                  <p className="sugestao-nome">{s.nome}</p>
                  <p className="sugestao-setor">{s.setor}</p>
                </div>
                <button
                  type="button"
                  className="btn-seguir"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(s.id);
                  }}
                  disabled={followLoading === s.id}
                  aria-label={`Seguir ${s.nome}`}
                >
                  {followLoading === s.id ? "..." : "+ Seguir"}
                </button>
              </div>
            ))}

            {!loading && sugestoes.length === 0 && (
              <div className="parceiros-empty compact">Sem novas sugestoes.</div>
            )}
          </div>

          {destaque && (
            <>
              <p className="sidebar-section-title" style={{ marginTop: "4px" }}>
                Perfil em destaque
              </p>

              <div className="perfil-destaque" onClick={() => abrirPerfil(destaque.id)}>
                <div className="perfil-destaque-cover" />

                <div className="perfil-destaque-body">
                  <div className="perfil-destaque-avatar-wrap">
                    {destaque.avatar_url ? (
                      <img className="perfil-destaque-avatar" src={destaque.avatar_url} alt={destaque.nome} />
                    ) : (
                      <div
                        className="perfil-destaque-avatar"
                        style={{ background: destaque.bg, color: destaque.cor }}
                        aria-hidden="true"
                      >
                        {destaque.sigla}
                      </div>
                    )}
                  </div>

                  <p className="perfil-destaque-nome">{destaque.nome}</p>
                  <p className="perfil-destaque-handle">{destaque.handle}</p>
                  <span className="perfil-destaque-setor">{destaque.setor}</span>
                  <p className="perfil-destaque-bio">
                    Perfil corporativo para conexoes, tendencias e oportunidades B2B.
                  </p>

                  <div className="perfil-destaque-stats">
                    <div className="perfil-stat">
                      <p className="perfil-stat-numero">{destaque.totalPosts || 0}</p>
                      <p className="perfil-stat-label">Posts</p>
                    </div>
                    <div className="perfil-stat">
                      <p className="perfil-stat-numero">{destaque.totalSeguidores || 0}</p>
                      <p className="perfil-stat-label">Seguidores</p>
                    </div>
                    <div className="perfil-stat">
                      <p className="perfil-stat-numero">{destaque.totalSeguindo || 0}</p>
                      <p className="perfil-stat-label">Seguindo</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-seguir-destaque"
                    onClick={(e) => {
                      e.stopPropagation();
                      destaque.isFollowing ? abrirMensagem(destaque.id) : toggleFollow(destaque.id);
                    }}
                    disabled={followLoading === destaque.id}
                  >
                    {destaque.isFollowing ? "Enviar mensagem" : "+ Seguir empresa"}
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
