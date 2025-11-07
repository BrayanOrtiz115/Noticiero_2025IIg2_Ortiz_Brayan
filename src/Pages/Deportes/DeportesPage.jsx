import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import '../../Components/../Pages/Shared/CategoriaPage.css';

const DeportesPage = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        console.log('📥 Cargando noticias de deportes...');
        
        const q = query(
          collection(db, 'noticias'),
          where('categoria', '==', 'Deportes'),
          where('estado', '==', 'Publicada')
        );
        
        const querySnapshot = await getDocs(q);
        const noticiasData = [];
        querySnapshot.forEach((doc) => {
          noticiasData.push({ id: doc.id, ...doc.data() });
        });
        
        noticiasData.sort((a, b) => 
          new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        
        console.log('✅ Noticias de deportes cargadas:', noticiasData.length);
        setNoticias(noticiasData);
      } catch (error) {
        console.error('❌ Error cargando noticias de deportes:', error);
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
        <p>Cargando noticias de deportes...</p>
      </div>
    );
  }

  return (
    <div className="categoria-page">
      <div className="categoria-header">
        <div className="categoria-hero deportes-hero">
          <div className="categoria-info">
            <div className="categoria-icon">⚽</div>
            <div>
              <h1>Deportes</h1>
              <p>Deportes nacionales e internacionales</p>
            </div>
          </div>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar en deportes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="categoria-content">
        <div className="noticias-stats">
          <span>{noticiasFiltradas.length} noticias encontradas</span>
          {busqueda && <span> para "{busqueda}"</span>}
        </div>

        {noticiasFiltradas.length === 0 ? (
          <div className="no-noticias">
            <div className="no-noticias-icon">⚽</div>
            <h3>No hay noticias de deportes</h3>
            <p>
              {busqueda 
                ? 'No se encontraron noticias que coincidan con tu búsqueda.'
                : 'No hay noticias de deportes publicadas aún.'
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
                    <div className="noticia-categoria">Deportes</div>
                  </div>
                )}
                
                <div className="noticia-content">
                  <div className="noticia-meta">
                    <span className="noticia-fecha">
                      {new Date(noticia.fecha_creacion).toLocaleDateString('es-ES')}
                    </span>
                    <span className="noticia-autor">Por {noticia.autor}</span>
                  </div>
                  
                  <h3 className="noticia-titulo">
                    <Link to={`/deportes/${noticia.id}`}>{noticia.titulo}</Link>
                  </h3>
                  
                  {noticia.subtitulo && (
                    <p className="noticia-subtitulo">{noticia.subtitulo}</p>
                  )}
                  
                  <p className="noticia-resumen">
                    {noticia.contenido.substring(0, 150)}...
                  </p>
                  
                  <Link to={`/deportes/${noticia.id}`} className="leer-mas">
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

export default DeportesPage;