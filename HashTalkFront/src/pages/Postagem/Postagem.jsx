import MenuLateral from '../../componentes/menuLateral';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg'
import './Postagem.css';

export default function Postagem() {
    const [texto, setTexto] = useState('');
    const [visibilidade, setVisibilidade] = useState('parceiros');
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    const fetchPosts = async ({ silent = false } = {}) => {
        if (!silent) {
            setLoadingPosts(true);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setPosts(data.posts || []);
            } else {
                console.error("Erro ao buscar posts:", data.error);
            }
        } catch (error) {
            console.error("Erro ao carregar posts:", error);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('usuario');
        if (user) {
            setUserInfo(JSON.parse(user));
        }

        fetchPosts();
        const intervalo = setInterval(() => fetchPosts({ silent: true }), 5000);

        return () => clearInterval(intervalo);
    }, []);

    const handlePublicar = async () => {
        if (!texto.trim()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: texto })
            });

            if (response.ok) {
                setTexto('');
                alert("Post publicado com sucesso!");
                await fetchPosts({ silent: true });
            } else {
                const data = await response.json();
                alert(data.error || "Erro ao publicar");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleGerarHashtags = async () => {
        if (!texto.trim()) {
            alert("Digite algum texto primeiro para gerar as hashtags!");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hashtags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ texto })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.hashtags && data.hashtags.length > 0) {
                    setTexto(texto + "\n\n" + data.hashtags.join(' '));
                }
            } else {
                const data = await response.json();
                alert(data.error || "Erro ao gerar hashtags");
            }
        } catch (error) {
            console.error("Erro ao gerar hashtags:", error);
            alert("Erro ao conectar com o servidor para gerar hashtags");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <MenuLateral />

            <div className="content-wrapper">
                <main className="principal">

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

                    <section className="feed">

                        <div className="empresa-info">
                            <div className="empresa-avatar">{userInfo?.nomeEmpresa?.substring(0, 2) || 'TS'}</div>
                            <div>
                                <strong>{userInfo?.nomeEmpresa || 'Empresa'}</strong>
                                <p className="empresa-handle">@{userInfo?.nomeEmpresa?.toLowerCase().replace(/\s/g, '') || 'usuario'} · {userInfo?.cargoFuncionario || 'Cargo'}</p>
                            </div>
                        </div>

                        <div className="area-postagem">
                            <textarea
                                value={texto}
                                onChange={(e) => setTexto(e.target.value)}
                                placeholder="No que você está pensando?"
                                maxLength={280}
                            />
                        </div>


                        <div className="secao-visibilidade">
                            <p className="secao-label">Quem pode ver esse post?</p>
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
                                    Público
                                </button>
                            </div>
                        </div>

                        <div className="acoes-post">
                            <button type="button" className="btn-hashtag" onClick={handleGerarHashtags} disabled={loading}>
                                {loading ? 'Gerando...' : 'Gerar Hashtags'}
                            </button>
                            <button type="button" className="btn-publicar" onClick={handlePublicar} disabled={loading}>
                                {loading ? 'Publicando...' : 'Publicar'}
                            </button>
                        </div>

                    </section>

                    <section className="feed feed-posts">
                        <h2>Posts recentes</h2>

                        {loadingPosts ? (
                            <p>Carregando posts...</p>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <article className="post" key={post.id}>
                                    <strong>{post.usuario?.nome_empresa || post.usuario?.nomecompleto || "Usuario"}</strong>
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
