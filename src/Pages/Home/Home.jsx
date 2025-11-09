import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Footer from "../../Components/Footer/Footer";

// ✅ Imágenes desde src/img
import techImg from "../../img/cultura.png";
import sportsImg from "../../img/deportes.png";
import cultureImg from "../../img/economia.png";
import economyImg from "../../img/tecnologia.png";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sections = [
    {
      title: "TECNOLOGÍA",
      subtitle: "La innovación nunca duerme",
      media: techImg,
      color: "#00f5ff",
      text: `El avance tecnológico redefine cada aspecto de nuestra vida diaria. 
      Desde la inteligencia artificial que escribe y crea por nosotros, hasta los sistemas automatizados 
      que toman decisiones en milisegundos, la revolución digital marca un punto de no retorno.`,
      link: "/tecnologia",
    },
    {
      title: "DEPORTES",
      subtitle: "La pasión se siente en cada gol",
      media: sportsImg,
      color: "#ff0080",
      text: `El mundo del deporte atraviesa su transformación más emocionante. 
      Con cámaras 8K, estadísticas en tiempo real y transmisiones inmersivas, 
      los fanáticos ya no solo miran: ahora viven el juego como si estuvieran en el estadio.`,
      link: "/deportes",
    },
    {
      title: "CULTURA",
      subtitle: "Arte, música y revolución digital",
      media: cultureImg,
      color: "#ffaa00",
      text: `La cultura global vive una nueva edad de oro. Artistas de todo el mundo fusionan tradición y tecnología para crear obras que trascienden fronteras.`,
      link: "/cultura",
    },
    {
      title: "ECONOMÍA",
      subtitle: "La revolución financiera digital",
      media: economyImg,
      color: "#00ff99",
      text: `El mercado global entra en una nueva era dominada por la inteligencia artificial y el blockchain. 
      Las monedas digitales y los contratos inteligentes están rompiendo las barreras tradicionales.`,
      link: "/economia",
    },
  ];

  const nextSection = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % sections.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSection = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + sections.length) % sections.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSection();
      if (e.key === 'ArrowRight') nextSection();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

  const active = sections[activeIndex];

  return (
    <>
      <div className="home-container">
        {/* === Fondo === */}
        {sections.map((sec, i) => (
          <img
            key={i}
            className={`bg-media ${i === activeIndex ? "active" : ""}`}
            src={sec.media}
            alt={sec.title}
          />
        ))}

        <div className="overlay-dark"></div>

        {/* === Flechas de navegación === */}
        <button className="nav-arrow left-arrow" onClick={prevSection}>
          ‹
        </button>
        
        <button className="nav-arrow right-arrow" onClick={nextSection}>
          ›
        </button>

        {/* === Indicadores de sección === */}
        <div className="section-indicators">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              style={{ 
                backgroundColor: index === activeIndex ? active.color : "rgba(255,255,255,0.3)" 
              }}
            ></div>
          ))}
        </div>

        {/* === Contenido: imagen + texto === */}
        <div className="news-content">
          <div className="news-image">
            <img src={active.media} alt={active.title} />
          </div>
          <div className="news-text">
            <h1 style={{ "--accent": active.color }}>{active.title}</h1>
            <p className="subtitle">{active.subtitle}</p>
            {active.text.split("\n").map((paragraph, idx) => (
              <p className="desc" key={idx}>
                {paragraph.trim()}
              </p>
            ))}
            <Link
              to={active.link}
              className="btn-explore"
              style={{ "--accent": active.color }}
            >
              LEER MÁS
            </Link>
          </div>
        </div>
      </div>
      
      {/* ✅ Footer */}
      <Footer />
    </>
  );
};

export default Home;