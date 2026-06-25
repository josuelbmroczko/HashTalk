import MenuLateral from '../../componentes/menuLateral';

// Home.jsx - LIMPO e integrado
export default function Home() {
    return (
        <main className="principal">
            {/* Cabeçalho superior */}
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
                    <p>Acabamos de lançar nossa plataforma de integração em nuvem! Redução de 40% no tempo de onboarding.</p>
                </div>

                <div className="post">
                    <strong>Inova Ltda</strong>
                    <p>Acabamos de lançar nossa plataforma...</p>
                </div>
            </section>
        </main>
    );
}