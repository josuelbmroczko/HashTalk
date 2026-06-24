import MenuLateral from '../componentes/menuLateral';
import { useState } from 'react';
import logo from '../assets/logo.jpeg'

/*
(lado esquerdo)
logo em cima -> Novo post Postar (link string)
nome da empresa
area de texto para ser escrito
numero de caracteres maximo*
botão de gerar hashtag para ler o texto lido
botão de publicar post

na outra part da pagina (lado direito)

*/

export default function Postagem() {
    const [texto, setTexto] = useState('');
    const [visibilidade, setVisibilidade] = useState('parceiros');

    return (
        <div className="app-container">
            <MenuLateral />

            <div className="content-wrapper">
                <main className="principal">

                    {/* Cabeçalho: Logo + Novo post / Postar */}
                    <div className="post-header">
                        <div className="post-header-logo">
                            <img src={logo} alt="Logo HashTalk" />
                            <span className="logo-nome">HashTalk</span>
                        </div>
                        <div className="post-header-actions">
                            <span>Novo post</span>
                            <a href="/postar" className="link-postar">Postar</a>
                        </div>
                    </div>

                    {/* Feed / Formulário de postagem */}
                    <section className="feed">

                        {/* Avatar + Info da empresa */}
                        <div className="empresa-info">
                            <div className="empresa-avatar">TS</div>
                            <div>
                                <strong>Tech Solutions</strong>
                                <p className="empresa-handle">@techsolutions · CEO</p>
                            </div>
                        </div>

                        {/* Área de texto */}
                        <div className="area-postagem">
                            <textarea
                                value={texto}
                                onChange={(e) => setTexto(e.target.value)}
                                placeholder="No que você está pensando?"
                                maxLength={280}
                            />
                        </div>


                        {/* Visibilidade */}
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

                        {/* Botões de ação */}
                        <div className="acoes-post">
                            <button type="button" className="btn-hashtag">
                                Gerar Hashtags
                            </button>
                            <button type="button" className="btn-publicar">
                                Publicar
                            </button>
                        </div>

                    </section>
                </main>
            </div>
        </div>
    );
}
