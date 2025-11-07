import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import '../../Pages/Shared/CategoriaPage.css';

const TecnologiaPage = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        console.log('📥 Cargando noticias de tecnología...');
        
        const q = query(
          collection(db, 'noticias'),
          where('categoria', '==', 'Tecnología'),
          where('estado', '==', 'Publicada')
        );
        
        const querySnapshot = await getDocs(q);
        const noticiasData = [];
        querySnapshot.forEach((doc) => {
          noticiasData.push({ id: doc.id, ...doc.data() });
        });
        
        // Ordenar manualmente por fecha
        noticiasData.sort((a, b) => 
          new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        
        console.log('✅ Noticias de tecnología cargadas:', noticiasData.length);
        setNoticias(noticiasData);
      } catch (error) {
        console.error('❌ Error cargando noticias de tecnología:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarNoticias();
  }, []);

  const noticiasFiltradas = noticias.filter(noticia =>
    noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    noticia.contenido.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="categoria-loading">
        <div className="spinner"></div>
        <p>Cargando noticias de tecnología...</p>
      </div>
    );
  }

  return (
    <div className="categoria-page">
      {/* Header de la categoría */}
      <div className="categoria-header">
        <div className="categoria-hero tecnologia-hero">
          <div className="categoria-info">
            <div className="categoria-icon">💻</div>
            <div>
              <h1>Tecnología</h1>
              <p>Últimas noticias de innovación, gadgets y mundo digital</p>
            </div>
          </div>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar en tecnología..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="categoria-content">
        <div className="noticias-stats">
          <span>{noticiasFiltradas.length} noticias encontradas</span>
          {busqueda && <span> para "{busqueda}"</span>}
        </div>

        {noticiasFiltradas.length === 0 ? (
          <div className="no-noticias">
            <div className="no-noticias-icon">📱</div>
            <h3>No hay noticias de tecnología</h3>
            <p>
              {busqueda 
                ? 'No se encontraron noticias que coincidan con tu búsqueda.'
                : 'No hay noticias de tecnología publicadas aún.'
              }
            </p>
          </div>
        ) : (
          <div className="noticias-grid">
            {noticiasFiltradas.map(noticia => (
              <article key={noticia.id} className="noticia-card">
                {noticia.imagen && (
                  <div className="noticia-imagen">
                    <img src={noticia.imagen} alt={noticia.titulo} />
                    <div className="noticia-categoria">Tecnología</div>
                  </div>
                )}
                
                <div className="noticia-content">
                  <div className="noticia-meta">
                    <span className="noticia-fecha">
                      {new Date(noticia.fecha_creacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="noticia-autor">Por {noticia.autor}</span>
                  </div>
                  
                  <h3 className="noticia-titulo">
                    <Link to={`/tecnologia/${noticia.id}`}>{noticia.titulo}</Link>
                  </h3>
                  
                  {noticia.subtitulo && (
                    <p className="noticia-subtitulo">{noticia.subtitulo}</p>
                  )}
                  
                  <p className="noticia-resumen">
                    {noticia.contenido.substring(0, 150)}...
                  </p>
                  
                  <Link to={`/tecnologia/${noticia.id}`} className="leer-mas">
                    Leer más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TecnologiaPage;