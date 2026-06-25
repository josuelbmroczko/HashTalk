import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuLateral from '../../componentes/menuLateral';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodosPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setPosts(Array.isArray(data.posts) ? data.posts : []);
                } else {
                    console.error("Erro ao buscar posts:", data.error);
                }
            } catch (error) {
                console.error("Erro na requisicao:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodosPosts();
        const intervalo = setInterval(fetchTodosPosts, 5000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="app-container">
            <MenuLateral />

            <div className="content-wrapper">
                <main className="principal">
                    <header className="main-header">
                        <h2>Todos os posts</h2>
                        <div className="tabs">
                            <span className="tab active">Recentes</span>
                            <span className="tab">Todas as contas</span>
                        </div>
                    </header>

                    <section className="feed">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <article className="post" key={post.id}>
                                    <strong>{post.usuario?.nome_empresa || post.usuario?.nomecompleto || "Usuario"}</strong>

                                    {post.usuario?.username && (
                                        <span className="post-autor">@{post.usuario.username}</span>
                                    )}

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
