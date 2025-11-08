import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-brand">
            <Newspaper className="footer-logo" />
            <h3>NEXUS NEWS</h3>
          </div>
          <p className="footer-description">
            Tu fuente confiable de información veraz y oportuna. 
            Comprometidos con el periodismo de calidad y la transparencia informativa.
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <Mail size={16} />
              <span>noticierosancocho@noticiero.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+57 320 404 8966</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Florencia Caquetá, Colombia</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Secciones</h4>
          <Link to="/noticias">Todas las Noticias</Link>
          <Link to="/politica">Política</Link>
          <Link to="/deportes">Deportes</Link>
          <Link to="/tecnologia">Tecnología</Link>
          <Link to="/cultura">Cultura</Link>
          <Link to="/economia">Economía</Link>
        </div>

        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <Link to="/">Inicio</Link>
          <Link to="/noticias">Últimas Noticias</Link>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/admin">Panel Administrativo</Link>
          <a href="#mision-vision">Misión y Visión</a>
        </div>

        <div className="footer-section">
          <h4>Datos Curiosos</h4>
          <div className="fun-facts">
            <div className="fun-fact">
              <strong>📅 Fundado:</strong> 2010
            </div>
            <div className="fun-fact">
              <strong>📊 Noticias/día:</strong> 50+
            </div>
            <div className="fun-fact">
              <strong>🌎 Cobertura:</strong> Nacional
            </div>
            <div className="fun-fact">
              <strong>🏆 Premios:</strong> 15+
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 Noticiero Digital. Todos los derechos reservados.</p>
          <p>Desarrollado con Amor usando React & Firebase</p>
        </div>
      </div>
    </footer>
  );
}