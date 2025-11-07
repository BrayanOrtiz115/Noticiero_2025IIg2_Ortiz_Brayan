import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './News.css'
import { collection, getDocs, query, where } from "firebase/firestore";
import db from '../../Firebase/ConfigFirebase';

const News = () => {
  const [noticias, setNoticias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        console.log('📥 Cargando noticias públicas desde Firebase...')
        
        // CONSULTA TEMPORAL SIN ORDERBY - eliminar después de crear el índice
        const q = query(
          collection(db, "noticias"), 
          where("estado", "==", "Publicado")
          // Quitamos orderBy temporalmente para evitar el error
          // orderBy("fecha_creacion", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const noticiasData = [];
        querySnapshot.forEach((doc) => {
          noticiasData.push({ id: doc.id, ...doc.data() });
        });
        
        // Ordenar manualmente por fecha en el cliente
        noticiasData.sort((a, b) => 
          new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        
        console.log('✅ Noticias públicas cargadas:', noticiasData.length)
        setNoticias(noticiasData);
      } catch (error) {
        console.error("❌ Error cargando noticias:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarNoticias();
  }, []);

  if (cargando) {
    return (
      <div className="news-loading">
        <div className="spinner"></div>
        <p>Cargando noticias...</p>
      </div>
    );
  }

  return (
    <section className="news-section">
      <h2 className="section-title">Últimas Noticias</h2>
      
      {noticias.length === 0 ? (
        <div className="no-news">
          <p>No hay noticias publicadas aún</p>
          <p>💡 <strong>Consejo:</strong> Inicia sesión como editor y publica algunas noticias</p>
        </div>
      ) : (
        <div className="news-grid">
          {noticias.map(noticia => (
            <article key={noticia.id} className="news-article">
              {noticia.imagen && (
                <div className="news-image-container">
                  <img src={noticia.imagen} alt={noticia.titulo} className="news-image" />
                </div>
              )}
              
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-category">{noticia.categoria || 'General'}</span>
                  <span className="news-date">
                    {noticia.fecha_creacion ? 
                      new Date(noticia.fecha_creacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      'Fecha no disponible'
                    }
                  </span>
                </div>
                
                <h3 className="news-title">
                  <Link to={`/noticia/${noticia.id}`}>{noticia.titulo}</Link>
                </h3>
                
                {noticia.subtitulo && (
                  <p className="news-subtitle">{noticia.subtitulo}</p>
                )}
                
                <p className="news-text">
                  {noticia.contenido.substring(0, 150)}...
                </p>
                
                <div className="news-footer">
                  <span className="news-author">Por {noticia.autor}</span>
                  <Link to={`/noticia/${noticia.id}`} className="news-read-more">
                    Leer más →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default News;