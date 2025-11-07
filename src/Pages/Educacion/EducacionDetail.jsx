import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import '../../Components/../Pages/Shared/CategoriaDetail.css';

const EducacionDetail = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        console.log('📥 Cargando noticia individual de educación:', id);
        const docRef = doc(db, 'noticias', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const noticiaData = { id: docSnap.id, ...docSnap.data() };
          console.log('✅ Noticia de educación cargada:', noticiaData.titulo);
          
          // Verificar que la noticia sea de la categoría correcta
          if (noticiaData.categoria !== 'Educación') {
            console.log('❌ Noticia no pertenece a educación');
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
        <p>Cargando noticia de educación...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="categoria-detail-not-found">
        <h2>📚 Noticia no encontrada</h2>
        <p>La noticia que buscas no existe o no es de educación.</p>
        <Link to="/educacion" className="btn-volver">
          ← Volver a Educación
        </Link>
      </div>
    );
  }

  if (noticia.estado !== 'Publicada') {
    return (
      <div className="categoria-detail-not-published">
        <h2>🔒 Noticia no disponible</h2>
        <p>Esta noticia no está publicada actualmente.</p>
        <Link to="/educacion" className="btn-volver">
          ← Volver a Educación
        </Link>
      </div>
    );
  }

  return (
    <article className="categoria-detail">
      <header className="categoria-detail-header educacion-detail-header">
        <Link to="/educacion" className="btn-volver">
          ← Volver a Educación
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
        <Link to="/educacion" className="btn-volver">
          ← Volver a Educación
        </Link>
      </footer>
    </article>
  );
};

export default EducacionDetail;