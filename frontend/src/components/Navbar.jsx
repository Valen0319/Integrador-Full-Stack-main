// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../utils/auth";

/*
  Barra de navegación moderna y responsiva:
  - Diseño elegante con tema dorado, blanco y azul suave
  - Animaciones suaves y efectos hover
  - Navegación responsiva con menú hamburguesa
  - Indicador de página activa
  - Efecto de scroll con transparencia
*/
export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Efecto de scroll para cambiar la apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo y título */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="brand-text">TaskFlow</span>
          </Link>
        </div>

        {/* Menú de navegación para desktop */}
        <div className="navbar-menu desktop-menu">
          {!user ? (
            <div className="navbar-actions">
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className={`nav-link nav-link-primary ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="navbar-actions">
              <div className="user-info">
                <div className="user-avatar">
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <span className="user-name">Hola, {user?.name || "Usuario"}</span>
              </div>
              
              {user.role === "admin" && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15L8 11H16L12 15Z" fill="currentColor"/>
                    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Panel Admin
                </Link>
              )}
              
              <button 
                className="btn-logout" 
                onClick={logout}
                title="Cerrar sesión"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Salir
              </button>
            </div>
          )}
        </div>

        {/* Botón de menú móvil */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Menú móvil */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {!user ? (
            <div className="mobile-nav-actions">
              <Link 
                to="/login" 
                className={`mobile-nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className={`mobile-nav-link mobile-nav-link-primary ${location.pathname === '/register' ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="mobile-nav-actions">
              <div className="mobile-user-info">
                <div className="user-avatar">
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.name || "Usuario"}</span>
                  <span className="user-role">{user?.role || "Usuario"}</span>
                </div>
              </div>
              
              {user.role === "admin" && (
                <Link 
                  to="/admin" 
                  className={`mobile-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15L8 11H16L12 15Z" fill="currentColor"/>
                    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Panel Admin
                </Link>
              )}
              
              <button 
                className="mobile-btn-logout" 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
