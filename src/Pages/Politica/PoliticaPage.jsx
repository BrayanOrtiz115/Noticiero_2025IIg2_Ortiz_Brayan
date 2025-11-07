import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import '../../Components/../Pages/Shared/CategoriaPage.css';

const PoliticaPage = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const q = query(
          collection(db, 'noticias'),
          where('categoria', '==', 'Política'),
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
        
        setNoticias(noticiasData);
      } catch (error) {
        console.error('Error cargando noticias de política:', error);
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
        <p>Cargando noticias de política...</p>
      </div>
    );
  }

  return (
    <div className="categoria-page">
      <div className="categoria-header">
        <div className="categoria-hero politica-hero">
          <div className="categoria-info">
            <div className="categoria-icon">🏛️</div>
            <div>
              <h1>Política</h1>
              <p>Noticias políticas y gobierno</p>
            </div>
          </div>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar en política..."
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
            <div className="no-noticias-icon">🏛️</div>
            <h3>No hay noticias de política</h3>
            <p>
              {busqueda 
                ? 'No se encontraron noticias que coincidan con tu búsqueda.'
                : 'No hay noticias de política publicadas aún.'
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
                    <div className="noticia-categoria">Política</div>
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
                    <Link to={`/politica/${noticia.id}`}>{noticia.titulo}</Link>
                  </h3>
                  
                  {noticia.subtitulo && (
                    <p className="noticia-subtitulo">{noticia.subtitulo}</p>
                  )}
                  
                  <p className="noticia-resumen">
                    {noticia.contenido.substring(0, 150)}...
                  </p>
                  
                  <Link to={`/politica/${noticia.id}`} className="leer-mas">
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

export default PoliticaPage;