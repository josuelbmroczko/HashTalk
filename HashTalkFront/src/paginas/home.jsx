import MenuLateral from '../componentes/menuLateral';

export default function Home() {
    return (
        // 1. Mudado de <> para a div container (ativa o lado a lado)
        <div className="app-container">
            
            <MenuLateral />
            
            {/* 2. Adicionado a classe content-wrapper nesta div (coluna da direita) */}
            <div className="content-wrapper">
                <main className="principal">
                    
                    {/* Cabeçalho superior com a linha de baixo */}
                    <header className="main-header">
                        <h2>Para você</h2>
                        <div className="tabs">
                            <span className="tab active">Recentes</span>
                            <span className="tab">Seguindo</span>
                        </div>
                    </header>

                    {/* Feed / Postagens */}
                    <section className="feed">
                        <div className="post">
                            <strong>Tech Solutions</strong>
                            <p>Acabamos de lançar nossa plataforma de integração em nuvem! Redução de 40% no tempo de onboarding. </p>
                        </div>

                        <div className="post">
                            <strong>Inova Ltda</strong>
                            <p>Acabamos de lançar nossa plataforma...</p>
                        </div>
                    </section>
                    
                </main>
            </div>

        </div>
    );
}