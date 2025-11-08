import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle, Clock, Ban } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import ListaNoticias from '../ListaNoticias/ListaNoticias';
import FormularioNoticia from '../FormularioNoticia/FormularioNoticia';
import './Dashboard.css';

export default function Dashboard({ usuario }) {
  const [noticias, setNoticias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [noticiaEditar, setNoticiaEditar] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    publicadas: 0,
    revision: 0,
    borradores: 0,
    rechazadas: 0
  });

  useEffect(() => {
    console.log('📊 Dashboard cargado para usuario:', usuario);
    cargarNoticias();
  }, [usuario]);

  const cargarNoticias = async () => {
    try {
      console.log('📥 Cargando noticias de Firebase...');
      let q;
      
      if (usuario.rol === 'Editor') {
        q = query(collection(db, 'noticias'));
        console.log('👑 Cargando TODAS las noticias (Editor)');
      } else {
        q = query(collection(db, 'noticias'), where('autor_id', '==', usuario.uid));
        console.log('📝 Cargando noticias del reportero:', usuario.uid);
      }

      const querySnapshot = await getDocs(q);
      const noticiasData = [];
      querySnapshot.forEach((doc) => {
        noticiasData.push({ id: doc.id, ...doc.data() });
      });
      
      console.log('✅ Noticias cargadas:', noticiasData.length);
      console.log('📋 Estados encontrados:', noticiasData.map(n => n.estado));
      setNoticias(noticiasData);
      calcularEstadisticas(noticiasData);
    } catch (err) {
      console.error('❌ Error al cargar noticias:', err);
      alert('Error al cargar noticias: ' + err.message);
    }
  };

  const calcularEstadisticas = (data) => {
    const stats = {
      total: data.length,
      publicadas: data.filter(n => n.estado === 'Publicada' || n.estado === 'Publicado').length,
      revision: data.filter(n => n.estado === 'En revisión' || n.estado === 'Terminado').length,
      borradores: data.filter(n => n.estado === 'Borrador' || n.estado === 'Edición').length,
      rechazadas: data.filter(n => n.estado === 'Rechazada').length
    };
    
    console.log('📈 Estadísticas calculadas:', stats);
    setEstadisticas(stats);
  };

  const handleNuevaNoticia = () => {
    console.log('🆕 Iniciando nueva noticia');
    setNoticiaEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditarNoticia = (noticia) => {
    console.log('✏️ Editando noticia:', noticia.id);
    setNoticiaEditar(noticia);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    console.log('🚪 Cerrando formulario, recargando noticias...');
    setMostrarFormulario(false);
    setNoticiaEditar(null);
    cargarNoticias(); // Recargar noticias después de guardar
  };

  return (
    <div className="dashboard">
      {!mostrarFormulario ? (
        <>
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-title">
                {usuario.rol === 'Editor' ? '👑 Panel del Editor' : '📝 Panel del Reportero'}
              </h2>
              <p className="dashboard-subtitle">
                {usuario.rol === 'Editor' 
                  ? 'Gestiona y publica todas las noticias' 
                  : 'Crea y envía tus reportajes para revisión'}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Usuario: {usuario.nombre} ({usuario.email})
              </p>
            </div>
            <button onClick={handleNuevaNoticia} className="btn-nueva">
              <Plus size={20} />
              Nueva Noticia
            </button>
          </div>

          {/* 📊 ESTADÍSTICAS */}
          <div className="estadisticas-grid">
            <div className="estadistica-card total">
              <FileText className="estadistica-icon" />
              <div>
                <p className="estadistica-valor">{estadisticas.total}</p>
                <p className="estadistica-label">Total de Noticias</p>
              </div>
            </div>

            <div className="estadistica-card publicadas">
              <CheckCircle className="estadistica-icon" />
              <div>
                <p className="estadistica-valor">{estadisticas.publicadas}</p>
                <p className="estadistica-label">Publicadas</p>
              </div>
            </div>

            <div className="estadistica-card revision">
              <Clock className="estadistica-icon" />
              <div>
                <p className="estadistica-valor">{estadisticas.revision}</p>
                <p className="estadistica-label">En Revisión</p>
              </div>
            </div>

            <div className="estadistica-card borradores">
              <FileText className="estadistica-icon" />
              <div>
                <p className="estadistica-valor">{estadisticas.borradores}</p>
                <p className="estadistica-label">Borradores</p>
              </div>
            </div>

            <div className="estadistica-card rechazadas">
              <Ban className="estadistica-icon" />
              <div>
                <p className="estadistica-valor">{estadisticas.rechazadas}</p>
                <p className="estadistica-label">Rechazadas</p>
              </div>
            </div>
          </div>

          {/* 📰 LISTA DE NOTICIAS */}
          <ListaNoticias 
            noticias={noticias}
            usuario={usuario}
            onEditar={handleEditarNoticia}
            onActualizar={cargarNoticias}
          />

        </>
      ) : (
        <FormularioNoticia
          usuario={usuario}
          noticia={noticiaEditar}
          onCerrar={handleCerrarFormulario}
        />
      )}
    </div>
  );
}