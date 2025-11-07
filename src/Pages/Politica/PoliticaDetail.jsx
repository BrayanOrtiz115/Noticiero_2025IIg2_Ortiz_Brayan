import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import '../../Components/../Pages/Shared/CategoriaDetail.css';

const PoliticaDetail = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        console.log('📥 Cargando noticia individual de política:', id);
        const docRef = doc(db, 'noticias', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const noticiaData = { id: docSnap.id, ...docSnap.data() };
          console.log('✅ Noticia de política cargada:', noticiaData.titulo);
          
          // Verificar que la noticia sea de la categoría correcta
          if (noticiaData.categoria !== 'Política') {
            console.log('❌ Noticia no pertenece a política');
            setNoticia(null);
          } else {
            setNoticia(noticiaData);
          }
        } else {
          console.log('❌ Noticia no encontrada');
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

  if (cargando) {
    return (
      <div className="categoria-detail-loading">
        <div className="spinner"></div>
        <p>Cargando noticia de política...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="categoria-detail-not-found">
        <h2>🏛️ Noticia no encontrada</h2>
        <p>La noticia que buscas no existe o no es de política.</p>
        <Link to="/politica" className="btn-volver">
          ← Volver a Política
        </Link>
      </div>
    );
  }

  if (noticia.estado !== 'Publicada') {
    return (
      <div className="categoria-detail-not-published">
        <h2>🔒 Noticia no disponible</h2>
        <p>Esta noticia no está publicada actualmente.</p>
        <Link to="/politica" className="btn-volver">
          ← Volver a Política
        </Link>
      </div>
    );
  }

  return (
    <article className="categoria-detail">
      <header className="categoria-detail-header politica-detail-header">
        <Link to="/politica" className="btn-volver">
          ← Volver a Política
        </Link>
        
        <div className="categoria-detail-meta">
          <span className="categoria-detail-categoria">{noticia.categoria}</span>
          <span className="categoria-detail-date">
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

        <h1 className="categoria-detail-title">{noticia.titulo}</h1>
        
        {noticia.subtitulo && (
          <p className="categoria-detail-subtitle">{noticia.subtitulo}</p>
        )}

        <div className="categoria-detail-author">
          Por <strong>{noticia.autor}</strong>
        </div>
      </header>

      {noticia.imagen && (
        <div className="categoria-detail-image">
          <img src={noticia.imagen} alt={noticia.titulo} />
        </div>
      )}

      <div className="categoria-detail-content">
        {noticia.contenido.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="categoria-detail-footer">
        <Link to="/politica" className="btn-volver">
          ← Volver a Política
        </Link>
      </footer>
    </article>
  );
};

export default PoliticaDetail;