import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBell, FaCog, FaEnvelope, FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaBars, FaPlus, FaXmark } from "react-icons/fa6";
import { IoIosBusiness } from "react-icons/io";
import { MdExplore } from "react-icons/md";
import logo from "../assets/logo.jpeg";
import { API_URL } from "../config/api";
import "./menuLateral.css";

const navItems = [
  { to: "/home", label: "Inicio", icon: FaHome },
  { to: "/explorar", label: "Explorar", icon: MdExplore },
  { to: "/notificacoes", label: "Notificacoes", icon: FaBell, disabled: true },
  { to: "/minhaempresa", label: "Minha empresa", icon: IoIosBusiness },
  { to: "/mensagens", label: "Mensagens", icon: FaEnvelope, disabled: true },
  { to: "/perfil", label: "Perfil", icon: FaUser },
  { to: "/configuracoes", label: "Configuracoes", icon: FaCog },
];

export default function MenuLateral() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => setMenuAberto(false);

  const handleLogout = async (event) => {
    event.preventDefault();
    fecharMenu();

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Erro no logout", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  };

  const handleDisabled = (event) => {
    event.preventDefault();
    fecharMenu();
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

      <div className={`menu-overlay ${menuAberto ? "active" : ""}`} onClick={fecharMenu} aria-hidden="true" />

      <aside id="menu-lateral" className={`lateralMenu ${menuAberto ? "menu-open" : ""}`}>
        <button type="button" className="close-menu-btn" onClick={fecharMenu} aria-label="Fechar menu">
          <FaXmark />
        </button>

        <div className="menu-brand">
          <img src={logo} alt="HashTalk" />
          <div>
            <strong>HashTalk</strong>
            <span>Rede B2B</span>
          </div>
        </div>

        <nav aria-label="Navegacao principal">
          <ul>
            {navItems.map(({ to, label, icon: Icon, disabled }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={disabled ? handleDisabled : fecharMenu}
                  className={({ isActive }) =>
                    `${isActive ? "active" : ""} ${disabled ? "disabled" : ""}`.trim()
                  }
                  aria-disabled={disabled ? "true" : undefined}
                >
                  <Icon className="icone" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-footer">
          <NavLink className="btn-post" to="/postagem" onClick={fecharMenu}>
            <FaPlus />
            <span>Novo post</span>
          </NavLink>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="icone" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

