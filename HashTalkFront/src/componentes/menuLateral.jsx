import { FaHome, FaBell, FaEnvelope, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosBusiness } from 'react-icons/io';
import { MdExplore } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg'
import './App.css';

export default function MenuLateral() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch('http://localhost:3000/api/auth/logout', {
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
        <aside className='lateralMenu'>
            <div className="img-logo">
                <img src={logo} alt="Logo" />
            </div>

            <nav>
                <ul>
                    <li>
                        <a href='/home'>
                            <FaHome className="icone"/>
                            <span>Página Inicial</span>
                        </a>
                    </li>
                    <li>
                        <a href='/explorar'>
                            <MdExplore className="icone"/>
                            <MdExplore className="icone"/>
                            <span>Explorar</span>
                        </a>
                    </li>
                    <li>
                        <a href='/notificacoes'>
                            <FaBell className="icone"/>
                            <span>Notificações</span>
                        </a>
                    </li>
                    <li>
                        <a href='/minhaempresa'>
                            <IoIosBusiness className="icone"/>
                            <span>Minha Empresa</span>
                        </a>
                    </li>
                    <li>
                        <a href='/mensagens'>
                            <FaEnvelope className="icone"/>
                            <span>Mensagens</span>
                        </a>
                    </li>
                    <li>
                        <a href='/perfil'>
                            <FaUser className="icone"/>
                            <span>Perfil</span>
                        </a>
                    </li>
                    <li>
                        <a href='/configuracoes'>
                            <FaCog className="icone"/>
                            <span>Configurações</span>
                        </a>
                    </li>
                    <li>
                        <a href='#' onClick={handleLogout}>
                            <FaSignOutAlt className="icone"/>
                            <span>Sair</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <button className="btn-post">
                <a href='/postagem'> 
                    <span>+ Novo Post</span>
                </a>
            </button>
        </aside>
    );
}