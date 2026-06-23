import "./Perfil.css";

function Perfil() {
  return (
    <main className="perfil-page">
      <section className="perfil-card">
        <aside className="perfil-sidebar">
          <div className="perfil-logo">HashTalk</div>

          <nav>
            <a>Página inicial</a>
            <a>Explorar</a>
            <a>Notificações</a>
            <a>Mensagens</a>
            <a>Minha empresa</a>
            <a className="ativo">Perfil</a>
            <a>Configurações</a>
          </nav>

          <button className="novo-post">+ Novo post</button>
        </aside>

        <section className="perfil-conteudo">
          <div className="perfil-capa"></div>

          <div className="perfil-info">
            <div className="avatar">AM</div>

            <button className="editar-perfil">Editar perfil</button>

            <h1>Ana Martins</h1>
            <p className="user">@anamartins · CEO na Tech Solutions</p>

            <div className="local">
              Brasil · hashtalk.app/anamartins
            </div>

            <p className="bio">
              Apaixonada por tecnologia, design e inovação. Liderando a Tech Solutions rumo ao futuro.
            </p>
          </div>

          <div className="perfil-numeros">
            <div>
              <strong>128</strong>
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

          <div className="perfil-tabs">
            <button className="tab-ativa">Posts</button>
            <button>Respostas</button>
            <button>Curtidas</button>
          </div>

          <article className="post-card">
            <p>Trabalhando em algo novo. Em breve, compartilho mais!</p>

            <div className="hashtags">
              <span>#Inovação</span>
              <span>#B2B</span>
            </div>

            <div className="post-acoes">
              <span>♡ 23</span>
              <span>💬 7</span>
              <span>↗ 15</span>
              <small>2h atrás</small>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default Perfil;