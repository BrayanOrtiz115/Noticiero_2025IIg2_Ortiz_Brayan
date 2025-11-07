import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import './NewsDetail.css';

export default function NewsDetail() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        console.log('📥 Cargando noticia individual:', id)
        const docRef = doc(db, 'noticias', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const noticiaData = { id: docSnap.id, ...docSnap.data() };
          console.log('✅ Noticia cargada:', noticiaData.titulo)
          setNoticia(noticiaData);
        } else {
          console.log('❌ Noticia no encontrada')
          setNoticia(null);
        }
      } catch (error) {
        console.error('❌ Error cargando noticia:', error);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarNoticia();
    }
  }, [id]);

  const compartirNoticia = () => {
    if (navigator.share) {
      navigator.share({
        title: noticia.titulo,
        text: noticia.subtitulo || noticia.contenido.substring(0, 100),
        url: window.location.href,
      })
      .catch(error => console.log('Error al compartir', error));
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Enlace copiado al portapapeles'))
        .catch(err => console.error('Error al copiar enlace', err));
    }
  };

  if (cargando) {
    return (
      <div className="news-detail-loading">
        <div className="spinner"></div>
        <p>Cargando noticia...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="news-detail-not-found">
        <h2>📰 Noticia no encontrada</h2>
        <p>La noticia que buscas no existe o ha sido eliminada.</p>
        <Link to="/" className="btn-volver">
          <ArrowLeft size={20} />
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (noticia.estado !== 'Publicada') {
    return (
      <div className="news-detail-not-published">
        <h2>🔒 Noticia no disponible</h2>
        <p>Esta noticia no está publicada actualmente.</p>
        <Link to="/" className="btn-volver">
          <ArrowLeft size={20} />
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <article className="news-detail">
      <header className="news-detail-header">
        <Link to="/" className="btn-volver">
          <ArrowLeft size={20} />
          Volver a noticias
        </Link>
        
        <div className="news-detail-meta">
          <span className="news-detail-category">{noticia.categoria || 'General'}</span>
          <span className="news-detail-date">
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

        <h1 className="news-detail-title">{noticia.titulo}</h1>
        
        {noticia.subtitulo && (
          <p className="news-detail-subtitle">{noticia.subtitulo}</p>
        )}

        <div className="news-detail-author">
          Por <strong>{noticia.autor}</strong>
        </div>
      </header>

      {noticia.imagen && (
        <div className="news-detail-image">
          <img src={noticia.imagen} alt={noticia.titulo} />
        </div>
      )}

      <div className="news-detail-content">
        {noticia.contenido.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="news-detail-footer">
        <Link to="/" className="btn-volver">
          <ArrowLeft size={20} />
          Volver a noticias
        </Link>
        
        <div className="news-detail-actions">
          <button onClick={compartirNoticia} className="btn-compartir">
            <Share2 size={20} />
            Compartir noticia
          </button>
        </div>
      </footer>
    </article>
  );
}