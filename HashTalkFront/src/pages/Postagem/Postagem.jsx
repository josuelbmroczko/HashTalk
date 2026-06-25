import { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHashtag, FaPaperPlane } from 'react-icons/fa6';
import MenuLateral from '../../componentes/menuLateral';
import logo from '../../assets/logo.jpeg';
import { API_URL } from '../../config/api';
import './Postagem.css';

export default function Postagem() {
  const [texto, setTexto] = useState('');
  const [visibilidade, setVisibilidade] = useState('parceiros');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [userInfo] = useState(() => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  });
  const navigate = useNavigate();

  const nomeEmpresa = userInfo?.nomeEmpresa || userInfo?.nomeFuncionario || 'Empresa';
  const cargo = userInfo?.cargoFuncionario || userInfo?.cargo_responsavel || 'Cargo';
  const contador = texto.length;
  const initials = useMemo(
    () =>
      nomeEmpresa
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => item[0])
        .join('')
        .toUpperCase(),
    [nomeEmpresa],
  );

  const fetchPosts = async ({ silent = false } = {}) => {
    if (!silent) setLoadingPosts(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setPosts(data.posts || []);
      else console.error('Erro ao buscar posts:', data.error);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePublicar = async () => {
    if (!texto.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: texto }),
      });

      if (response.ok) {
        setTexto('');
        await fetchPosts({ silent: true });
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao publicar');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarHashtags = async () => {
    if (!texto.trim()) {
      alert('Digite algum texto primeiro para gerar hashtags.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/hashtags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hashtags && data.hashtags.length > 0) setTexto(`${texto.trim()}\n\n${data.hashtags.join(' ')}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao gerar hashtags');
      }
    } catch (error) {
      console.error('Erro ao gerar hashtags:', error);
      alert('Erro ao conectar com o servidor para gerar hashtags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const intervalo = setInterval(() => fetchPosts({ silent: true }), 5000);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="principal composer-page">
          <header className="main-header">
            <div className="page-title-group">
              <h1>Novo post</h1>
              <p className="page-subtitle">Compartilhe uma atualizacao objetiva com sua rede.</p>
            </div>

            <div className="post-header">
              <div className="post-header-logo">
                <img src={logo} alt="Logo HashTalk" />
                <span className="logo-nome">HashTalk</span>
              </div>
              <div className="post-header-actions">
                <span>Novo post</span>
                <a href="/postagem" className="link-postar">Postar</a>
              </div>
            </div>
          </header>

          <section className="feed composer-layout">
            <article className="composer-card">
              <div className="empresa-info">
                <div className="empresa-avatar">{initials || 'HT'}</div>
                <div>
                  <strong>{nomeEmpresa}</strong>
                  <p className="empresa-handle">@{nomeEmpresa.toLowerCase().replace(/\s/g, '')} · {cargo}</p>
                </div>
              </div>

              <label className="composer-field" htmlFor="post-content">
                <span>Conteudo</span>
                <textarea
                  id="post-content"
                  value={texto}
                  onChange={(event) => setTexto(event.target.value)}
                  placeholder="No que sua empresa esta pensando?"
                  maxLength={280}
                />
              </label>

              <div className="composer-toolbar">
                <div className="secao-visibilidade">
                  <p className="secao-label">Visibilidade</p>
                  <div className="visibilidade-opcoes">
                    <button
                      type="button"
                      className={`btn-visibilidade ${visibilidade === 'parceiros' ? 'ativo' : ''}`}
                      onClick={() => setVisibilidade('parceiros')}
                    >
                      Parceiros B2B
                    </button>
                    <button
                      type="button"
                      className={`btn-visibilidade ${visibilidade === 'publico' ? 'ativo' : ''}`}
                      onClick={() => setVisibilidade('publico')}
                    >
                      Publico
                    </button>
                  </div>
                </div>

                <span className={contador > 250 ? 'contador limite' : 'contador'}>{contador}/280</span>
              </div>

              <div className="acoes-post">
                <button type="button" className="btn-hashtag" onClick={handleGerarHashtags} disabled={loading}>
                  <FaHashtag />
                  {loading ? 'Gerando...' : 'Gerar hashtags'}
                </button>
                <button type="button" className="btn-publicar" onClick={handlePublicar} disabled={loading || !texto.trim()}>
                  <FaPaperPlane />
                  {loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </article>

            <aside className="composer-side">
              <article className="composer-panel">
                <span className="panel-label">Preview</span>
                <div className="preview-post">
                  <div className="empresa-info">
                    <div className="empresa-avatar">{initials || 'HT'}</div>
                    <div>
                      <strong>{nomeEmpresa}</strong>
                      <p className="empresa-handle">@{nomeEmpresa.toLowerCase().replace(/\s/g, '')}</p>
                    </div>
                  </div>
                  <p>{texto.trim() || 'Seu post vai aparecer aqui conforme voce escreve.'}</p>
                </div>
              </article>

              <article className="composer-panel">
                <span className="panel-label">Checklist</span>
                <ul className="composer-checklist">
                  <li>Mensagem clara e objetiva</li>
                  <li>Contexto util para parceiros</li>
                  <li>Hashtags relevantes para alcance</li>
                </ul>
              </article>
            </aside>
          </section>

          <section className="feed feed-posts">
            <h2>Posts recentes</h2>

            {loadingPosts ? (
              <p>Carregando posts...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <article className="post" key={post.id}>
                  <strong>{post.usuario?.nome_empresa || post.usuario?.nomecompleto || 'Usuario'}</strong>
                  <p>{post.content}</p>

                  {post.hashtags && post.hashtags.length > 0 && (
                    <p className="post-hashtags">
                      {post.hashtags.map((tag, idx) => (
                        <Link to={`/hashtag/${tag.replace('#', '')}`} key={idx}>
                          {tag}
                        </Link>
                      ))}
                    </p>
                  )}
                </article>
              ))
            ) : (
              <p>Nenhum post encontrado.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
