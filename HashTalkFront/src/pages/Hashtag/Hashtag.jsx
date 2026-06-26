import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MenuLateral from '../../componentes/menuLateral';
import { API_URL } from '../../config/api';
import './Hashtag.css';

export default function Hashtag() {
    const { hashtag } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/posts/hashtag/${hashtag}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setPosts(data.posts || []);
                } else {
                    console.error("Erro ao buscar posts da hashtag:", data.error);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [hashtag]);

    return (
        <div className="app-container">
            <MenuLateral />
            
            <div className="content-wrapper">
                <main className="principal">
                    
                    <header className="main-header">
                        <h2>Resultados para #{hashtag.replace('#', '')}</h2>
                    </header>

                    <section className="feed">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : posts.length > 0 ? (
                            posts.map(post => (
                                <div className="post" key={post.id}>
                                    <strong>{post.usuario?.nome_empresa || post.usuario?.nomecompleto || "Usuário"}</strong>
                                    <p>{post.content}</p>
                                    {post.image_url && (
                                        <div className="post-image-container">
                                            <img src={post.image_url} alt="Imagem do post" className="post-image" />
                                        </div>
                                    )}
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
                            <p>Nenhum post encontrado com essa hashtag.</p>
                        )}
                    </section>
                    
                </main>
            </div>
        </div>
    );
}
