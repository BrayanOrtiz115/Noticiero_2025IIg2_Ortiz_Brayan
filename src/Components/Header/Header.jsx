import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/ConfigFirebase';
import './Header.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const categorias = [
    { nombre: 'Tecnología', ruta: '/tecnologia', icono: '🚀', color: '#00f5ff' },
    { nombre: 'Deportes', ruta: '/deportes', icono: '⚡', color: '#ff0080' },
    { nombre: 'Política', ruta: '/politica', icono: '🏛️', color: '#00ff88' },
    { nombre: 'Cultura', ruta: '/cultura', icono: '🎭', color: '#ffaa00' },
    { nombre: 'Economía', ruta: '/economia', icono: '📊', color: '#8844ff' },
    { nombre: 'Salud', ruta: '/salud', icono: '⚕️', color: '#00ffcc' },
    { nombre: 'Educación', ruta: '/educacion', icono: '🎓', color: '#ff4444' }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 🔹 Cerrar sesión antes de ir al login
  const handlePanelClick = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth); // Cierra sesión en Firebase
      navigate('/login');  // Luego redirige al login
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <header className={`header-futurista ${isScrolled ? 'scrolled' : ''}`}>
      {/* Barra superior con información en tiempo real */}
      <div className="header-top-bar">
        <div className="news-ticker">
          <div className="ticker-label">📡 EN VIVO:</div>
          <div className="ticker-content">
            <span>ÚLTIMA HORA • NOTICIERO DIGITAL • INFORMACIÓN EN TIEMPO REAL • </span>
            <span>ÚLTIMA HORA • NOTICIERO DIGITAL • INFORMACIÓN EN TIEMPO REAL • </span>
          </div>
        </div>
        
        <div className="time-display">
          <div className="digital-clock">{formatTime(currentTime)}</div>
          <div className="digital-date">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="header-main">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <div className="brand-glow"></div>
            <div className="brand-icon">🌐</div>
            <div className="brand-text">
              <h1 className="brand-name">NEXUS NEWS</h1>
              <div className="brand-tagline">DIGITAL NETWORK</div>
            </div>
          </Link>
        </div>

        {/* Navegación central */}
        <nav className="header-nav">
          <div className="nav-container">
            {categorias.map((categoria, index) => (
              <Link
                key={categoria.ruta}
                to={categoria.ruta}
                className={`nav-item ${location.pathname.startsWith(categoria.ruta) ? 'active' : ''}`}
                style={{ '--neon-color': categoria.color, '--delay': index * 0.1 + 's' }}
              >
                <span className="nav-glow"></span>
                <span className="nav-icon">{categoria.icono}</span>
                <span className="nav-text">{categoria.nombre}</span>
                <span className="nav-pulse"></span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Acciones del usuario */}
        <div className="header-actions">
          {/* Botón de Registro */}
          <Link to="/register" className="register-portal">
            <span className="portal-icon">🌟</span>
            <span className="portal-text">REGISTRO</span>
            <div className="portal-glow"></div>
          </Link>
          
          {/* Botón de Panel Control */}
          <Link to="/login" onClick={handlePanelClick} className="admin-portal">
            <span className="portal-icon">🔮</span>
            <span className="portal-text">PANEL CONTROL</span>
            <div className="portal-glow"></div>
          </Link>
        </div>
      </div>

      {/* Efecto visual */}
      <div className="scan-line"></div>
    </header>
  );
};

export default Header;