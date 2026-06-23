//icones para o menu lateral
import { FaHome, FaBell, FaEnvelope, FaUser, FaCog } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';
import logo from '../imagens/logo.jpeg'

export default function MenuLateral() {
    return (
        //redirecionando o menu lateral
        <aside className='lateralMenu'>
            <div className="img-logo">
                <img src={logo} alt="Logo" />
            </div>

            <navbar className="">
                <ul>
                    <li>
                        <a href='/'>
                            <FaHome className="icone"/>
                            <span>Página Inicial</span>
                        </a>
                    </li>
                    <li>
                        <a href='/explorar'>
                            < MdExplore className="icone"/>
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
                </ul>

            </navbar>

            <button className="btn-post">
                <a href='/postagem'> 
                {/* chamada da pagina de postagem */}
                    <span>+ Novo Post</span>
                </a>
                
            </button>
        </aside>


    );
}