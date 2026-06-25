import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuLateral from '../../componentes/menuLateral';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setPosts(data.posts || []);
                } else {
                    console.error("Erro ao buscar posts:", data.error);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();//chamando a função na primeira vez

        const intervalo = setInterval(fetchPosts, 5000);//chama a cada 5 segundos

        return () => clearInterval(intervalo)//evita o memory leak para quando o usuário sair da pagina
    }, []);

    return (
        <div className="app-container">
            <MenuLateral />

            <div className="content-wrapper">
                <main className="principal">

                    <header className="main-header">
                        <h2>Para você</h2>
                        <div className="tabs">
                            <span className="tab active">Recentes</span>
                            <span className="tab">Seguindo</span>
                        </div>
                    </header>

                    <section className="feed">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : posts.length > 0 ? (
                            posts.map(post => (
                                <div className="post" key={post.id}>
                                    <strong>{post.usuario?.nome_empresa || post.usuario?.nomecompleto || "Usuário"}</strong>
                                    <p>{post.content}</p>
                                    {post.hashtags && post.hashtags.length > 0 && (
                                        <p style={{ color: '#007bff' }}>
                                            {post.hashtags.map((tag, idx) => (
                                                <Link to={`/hashtag/${tag.replace('#', '')}`} key={idx} style={{ marginRight: '5px', color: '#007bff', textDecoration: 'none' }}>
                                                    {tag}
                                                </Link>
                                            ))}
                                        </p>
                                    )}
                                </div>
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