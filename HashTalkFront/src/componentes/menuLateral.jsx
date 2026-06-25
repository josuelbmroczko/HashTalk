import { useState } from 'react';
import { FaHome, FaBell, FaEnvelope, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { IoIosBusiness } from 'react-icons/io';
import { MdExplore } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import './menuLateral.css';

export default function MenuLateral() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);

    const fecharMenu = () => setMenuAberto(false);

    const handleLogout = async (event) => {
        event.preventDefault();
        fecharMenu();

        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Erro no logout', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            navigate('/login');
        }
    };

    return (
        <>
            <button
                type="button"
                className="hamburger-btn"
                onClick={() => setMenuAberto(true)}
                aria-label="Abrir menu"
                aria-expanded={menuAberto}
                aria-controls="menu-lateral"
            >
                <FaBars />
            </button>

            <div
                className={`menu-overlay ${menuAberto ? 'active' : ''}`}
                onClick={fecharMenu}
                aria-hidden="true"
            />

            <aside id="menu-lateral" className={`lateralMenu ${menuAberto ? 'menu-open' : ''}`}>
                <button
                    type="button"
                    className="close-menu-btn"
                    onClick={fecharMenu}
                    aria-label="Fechar menu"
                >
                    <FaTimes />
                </button>

                <div className="img-logo">
                    <img src={logo} alt="Logo" />
                </div>

                <nav>
                    <ul>
                        <li>
                            <a href="/home" onClick={fecharMenu}>
                                <FaHome className="icone" />
                                <span>Página Inicial</span>
                            </a>
                        </li>
                        <li>
                            <a href="/explorar" onClick={fecharMenu}>
                                <MdExplore className="icone" />
                                <span>Explorar</span>
                            </a>
                        </li>
                        <li>
                            <a href="/notificacoes" onClick={fecharMenu}>
                                <FaBell className="icone" />
                                <span>Notificações</span>
                            </a>
                        </li>
                        <li>
                            <a href="/minhaempresa" onClick={fecharMenu}>
                                <IoIosBusiness className="icone" />
                                <span>Minha Empresa</span>
                            </a>
                        </li>
                        <li>
                            <a href="/mensagens" onClick={fecharMenu}>
                                <FaEnvelope className="icone" />
                                <span>Mensagens</span>
                            </a>
                        </li>
                        <li>
                            <a href="/perfil" onClick={fecharMenu}>
                                <FaUser className="icone" />
                                <span>Perfil</span>
                            </a>
                        </li>
                        <li>
                            <a href="/configuracoes" onClick={fecharMenu}>
                                <FaCog className="icone" />
                                <span>Configurações</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={handleLogout}>
                                <FaSignOutAlt className="icone" />
                                <span>Sair</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <button className="btn-post">
                    <a href="/postagem" onClick={fecharMenu}>
                        <span>+ Novo Post</span>
                    </a>
                </button>
            </aside>
        </>
    );
}
