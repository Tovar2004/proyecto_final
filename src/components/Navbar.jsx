// src/component/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { cerrarSesion } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const { usuario, rol } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const cerrar = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  const handleLogout = async () => {
    await cerrarSesion();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">    Reporte de Incidencias</div>

      <div className="navbar-links">
        {usuario && (
          <>
            <Link to="/galeria">Galería</Link>
            {rol === "cliente" && <Link to="/reportar">Reportar</Link>}
            {rol === "admin" && (
              <>
                <Link to="/admin">Incidencias</Link>
                <Link to="/clientes">Clientes</Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="navbar-perfil" ref={menuRef}>
        {usuario ? (
          <>
            <button
              className="perfil-btn"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <div className="perfil-avatar">
                {usuario.nombre?.charAt(0).toUpperCase()}
              </div>
              <span className="perfil-nombre">{usuario.nombre}</span>
              <span className="perfil-chevron">{menuAbierto ? "▲" : "▼"}</span>
            </button>

            {menuAbierto && (
              <div className="perfil-dropdown">
                <div className="perfil-info">
                  <strong>
                    {usuario.nombre} {usuario.apellido}
                  </strong>
                  <span>{usuario.correo}</span>
                  {usuario.telefono && <span>📞 {usuario.telefono}</span>}
                  <span className="perfil-rol">
                    {rol === "admin" ? "👑 Administrador" : "👤 Cliente"}
                  </span>
                </div>
                <hr />
                <button className="perfil-logout" onClick={handleLogout}>
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="navbar-login-btn">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
