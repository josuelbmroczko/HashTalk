import MenuLateral from '../componentes/menuLateral';
import { useState } from 'react';

// URL base do backend
const API_URL = 'http://localhost:3000';

export default function Configuracoes() {
  // Por enquanto usamos ID fixo 1 para teste
  // Quando o grupo implementar login, trocar pelo ID do usuário logado
  const USUARIO_ID = 1;

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSalvar = async () => {
    setSalvando(true);
    setMensagem('');
    setErro('');

    // Monta apenas os campos que foram preenchidos
    const dadosAtualizar = {};
    if (nomeUsuario.trim()) dadosAtualizar.username = nomeUsuario.trim();
    if (email.trim()) dadosAtualizar.email = email.trim();
    if (novaSenha.trim()) dadosAtualizar.senha = novaSenha.trim();

    if (Object.keys(dadosAtualizar).length === 0) {
      setErro('Preencha ao menos um campo para salvar.');
      setSalvando(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${USUARIO_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizar),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Erro ao salvar configurações.');
      } else {
        setMensagem('Configurações salvas com sucesso!');
        setNomeUsuario('');
        setEmail('');
        setSenhaAtual('');
        setNovaSenha('');
      }
    } catch (err) {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="content-wrapper">
        <main className="principal">

          <header className="main-header">
            <h2>Configurações</h2>
          </header>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Mensagem de sucesso */}
            {mensagem && (
              <div style={{
                background: '#e0f7fa', border: '1px solid #00a8b5',
                borderRadius: '8px', padding: '12px 16px',
                color: '#00a8b5', fontWeight: 600, fontSize: '14px'
              }}>
                ✓ {mensagem}
              </div>
            )}

            {/* Mensagem de erro */}
            {erro && (
              <div style={{
                background: '#fff1f2', border: '1px solid #fca5a5',
                borderRadius: '8px', padding: '12px 16px',
                color: '#dc2626', fontWeight: 600, fontSize: '14px'
              }}>
                ✕ {erro}
              </div>
            )}

            {/* Informações da Conta */}
            <section style={estiloSecao}>
              <h3 style={estiloTituloSecao}>Informações da Conta</h3>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>Nome de usuário</label>
                <input
                  type="text"
                  placeholder="Novo nome de usuário"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  style={estiloInput}
                />
              </div>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>E-mail</label>
                <input
                  type="email"
                  placeholder="Novo e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={estiloInput}
                />
              </div>
            </section>

            {/* Segurança */}
            <section style={estiloSecao}>
              <h3 style={estiloTituloSecao}>Segurança</h3>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>Senha atual</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  style={estiloInput}
                />
              </div>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>Nova senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={estiloInput}
                />
              </div>
            </section>

            {/* Notificações */}
            <section style={estiloSecao}>
              <h3 style={estiloTituloSecao}>Notificações</h3>
              <div style={estiloLinha}>
                <div>
                  <p style={estiloLabel}>Notificações por e-mail</p>
                  <p style={estiloDescricao}>Receba atualizações e novidades por e-mail</p>
                </div>
                <button onClick={() => setNotifEmail(!notifEmail)} style={estiloToggle(notifEmail)}>
                  {notifEmail ? 'Ativado' : 'Desativado'}
                </button>
              </div>
              <div style={estiloLinha}>
                <div>
                  <p style={estiloLabel}>Notificações push</p>
                  <p style={estiloDescricao}>Receba alertas em tempo real no navegador</p>
                </div>
                <button onClick={() => setNotifPush(!notifPush)} style={estiloToggle(notifPush)}>
                  {notifPush ? 'Ativado' : 'Desativado'}
                </button>
              </div>
            </section>

            {/* Privacidade */}
            <section style={estiloSecao}>
              <h3 style={estiloTituloSecao}>Privacidade</h3>
              <div style={estiloLinha}>
                <div>
                  <p style={estiloLabel}>Perfil público</p>
                  <p style={estiloDescricao}>Qualquer pessoa pode visualizar seu perfil</p>
                </div>
                <button onClick={() => setPerfilPublico(!perfilPublico)} style={estiloToggle(perfilPublico)}>
                  {perfilPublico ? 'Público' : 'Privado'}
                </button>
              </div>
            </section>

            {/* Botão Salvar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-publicar"
                onClick={handleSalvar}
                disabled={salvando}
                style={{ opacity: salvando ? 0.6 : 1 }}
              >
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

const estiloSecao = {
  border: '1px solid #e2e8f0', borderRadius: '12px',
  padding: '20px', display: 'flex', flexDirection: 'column',
  gap: '16px', backgroundColor: '#ffffff',
};
const estiloTituloSecao = {
  fontSize: '15px', fontWeight: '700', color: '#1E293B',
  borderBottom: '1px solid #e2e8f0', paddingBottom: '12px',
};
const estiloGrupo = { display: 'flex', flexDirection: 'column', gap: '6px' };
const estiloLabel = { fontSize: '13px', fontWeight: '600', color: '#1E293B' };
const estiloDescricao = { fontSize: '12px', color: '#64748b', marginTop: '2px' };
const estiloInput = {
  padding: '10px 14px', border: '1px solid #e2e8f0',
  borderRadius: '8px', fontSize: '14px', color: '#1E293B',
  outline: 'none', width: '100%', maxWidth: '420px',
};
const estiloLinha = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const estiloToggle = (ativo) => ({
  padding: '6px 16px', borderRadius: '9999px', border: '1.5px solid',
  borderColor: ativo ? '#00a8b5' : '#e2e8f0',
  backgroundColor: ativo ? '#00a8b5' : 'transparent',
  color: ativo ? '#ffffff' : '#64748b',
  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
});