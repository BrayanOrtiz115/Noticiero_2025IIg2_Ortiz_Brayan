import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// ✅ Imágenes desde src/img
import techImg from "../../img/cultura.png";
import sportsImg from "../../img/deportes.png";
import cultureImg from "../../img/economia.png";
import economyImg from "../../img/tecnologia.png";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const isScrolling = useRef(false);

  const sections = [
    {
      title: "TECNOLOGÍA FUTURISTA",
      subtitle: "La innovación nunca duerme",
      media: techImg,
      color: "#00f5ff",
      text: `El avance tecnológico redefine cada aspecto de nuestra vida diaria. 
      Desde la inteligencia artificial que escribe y crea por nosotros, hasta los sistemas automatizados 
      que toman decisiones en milisegundos, la revolución digital marca un punto de no retorno. 
      Las grandes corporaciones invierten miles de millones en desarrollar interfaces más humanas, 
      mientras el futuro de la conectividad global se acerca a pasos agigantados.

      Expertos predicen que en menos de una década los dispositivos inteligentes 
      podrán anticiparse a nuestras necesidades incluso antes de que las expresemos. 
      Bienvenido a una era donde la ciencia ficción se convierte en realidad.`,
      link: "/tecnologia",
    },
    {
      title: "DEPORTES EN VIVO",
      subtitle: "La pasión se siente en cada gol",
      media: sportsImg,
      color: "#ff0080",
      text: `El mundo del deporte atraviesa su transformación más emocionante. 
      Con cámaras 8K, estadísticas en tiempo real y transmisiones inmersivas, 
      los fanáticos ya no solo miran: ahora viven el juego como si estuvieran en el estadio. 
      La tecnología de sensores biométricos está cambiando la manera en que se entrena, se compite y se gana.

      Desde el fútbol europeo hasta las ligas latinoamericanas, el espectáculo se reinventa 
      con inteligencia artificial que analiza tácticas en segundos. 
      El deporte moderno ya no solo depende del talento: ahora la ciencia también juega.`,
      link: "/deportes",
    },
    {
      title: "CULTURA GLOBAL",
      subtitle: "Arte, música y revolución digital",
      media: cultureImg,
      color: "#ffaa00",
      text: `La cultura global vive una nueva edad de oro. 
      Artistas de todo el mundo fusionan tradición y tecnología para crear obras que trascienden fronteras. 
      Plataformas de streaming, NFT musicales y museos virtuales están reescribiendo las reglas del arte contemporáneo.

      El público ya no es solo espectador: se convierte en parte de la obra. 
      Conciertos holográficos, exposiciones inmersivas y experiencias de realidad aumentada 
      nos demuestran que la creatividad humana sigue siendo infinita, incluso en el universo digital.`,
      link: "/cultura",
    },
    {
      title: "ECONOMÍA MUNDIAL",
      subtitle: "La revolución financiera digital",
      media: economyImg,
      color: "#00ff99",
      text: `El mercado global entra en una nueva era dominada por la inteligencia artificial y el blockchain. 
      Las monedas digitales y los contratos inteligentes están rompiendo las barreras tradicionales de la banca. 
      Cada transacción se vuelve más segura, rápida y descentralizada.

      Expertos aseguran que el futuro económico será impulsado por datos, no por billetes. 
      Las empresas que no se adapten al ritmo tecnológico corren el riesgo de desaparecer, 
      mientras los nuevos gigantes digitales emergen con una sola misión: reinventar el dinero.`,
      link: "/economia",
    },
  ];

  // 🔁 Scroll con fade
  useEffect(() => {
    const handleScroll = (e) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      setFading(true);
      setTimeout(() => {
        if (e.deltaY > 0) {
          setActiveIndex((prev) => (prev + 1) % sections.length);
        } else {
          setActiveIndex((prev) =>
            prev === 0 ? sections.length - 1 : prev - 1
          );
        }
        setTimeout(() => setFading(false), 400);
      }, 300);

      setTimeout(() => (isScrolling.current = false), 1000);
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [sections.length]);

  const active = sections[activeIndex];

  return (
    <div className={`home-fade-container ${fading ? "fade-transition" : ""}`}>
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

      {/* === Indicadores === */}
      <div className="nav-indicator">
        {sections.map((_, i) => (
          <span key={i} className={i === activeIndex ? "dot active" : "dot"}></span>
        ))}
      </div>
    </div>
  );
};

export default Home;
