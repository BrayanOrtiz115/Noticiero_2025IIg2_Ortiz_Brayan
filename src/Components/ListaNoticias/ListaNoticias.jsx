import React, { useState } from 'react';
import { Edit2, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import './ListaNoticias.css';

export default function ListaNoticias({ noticias, usuario, onEditar, onActualizar }) {
  const [filtroEstado, setFiltroEstado] = useState('Todas');

  const noticiasFiltradas = filtroEstado === 'Todas' 
    ? noticias 
    : noticias.filter(n => n.estado === filtroEstado);

  const handleEliminar = async (id, titulo) => {
    console.log('🗑️ Intentando eliminar noticia:', id, titulo);
    if (!confirm(`¿Estás seguro de eliminar la noticia: "${titulo}"?`)) {
      console.log('❌ Eliminación cancelada por el usuario');
      return;
    }

    try {
      console.log('🔥 Eliminando de Firestore...');
      await deleteDoc(doc(db, 'noticias', id));
      console.log('✅ Noticia eliminada exitosamente');
      onActualizar();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado, titulo) => {
    console.log('🔄 Cambiando estado:', { id, nuevoEstado, titulo });
    try {
      const updateData = { 
        estado: nuevoEstado,
        fecha_actualizacion: new Date().toISOString()
      };
      
      if (nuevoEstado === 'Publicada') {
        updateData.fecha_publicacion = new Date().toISOString();
      }

      await updateDoc(doc(db, 'noticias', id), updateData);
      console.log('✅ Estado actualizado exitosamente');
      onActualizar();
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err);
      alert('Error al cambiar estado: ' + err.message);
    }
  };

  const getEstadoBadge = (estado) => {
    const config = {
      'Borrador': { bg: '#f1f5f9', color: '#64748b', icon: <Edit2 size={14} /> },
      'En revisión': { bg: '#fef3c7', color: '#d97706', icon: <Eye size={14} /> },
      'Publicada': { bg: '#d1fae5', color: '#059669', icon: <CheckCircle size={14} /> },
      'Rechazada': { bg: '#fee2e2', color: '#dc2626', icon: <XCircle size={14} /> },
      'Publicado': { bg: '#d1fae5', color: '#059669', icon: <CheckCircle size={14} /> },
      'Terminado': { bg: '#fef3c7', color: '#d97706', icon: <Eye size={14} /> },
      'Edición': { bg: '#f1f5f9', color: '#64748b', icon: <Edit2 size={14} /> }
    };
    return config[estado] || config['Borrador'];
  };

  return (
    <div className="lista-noticias">
      <div className="lista-header">
        <h3 className="lista-title">Gestión de Noticias</h3>
        <div className="filtros">
          {['Todas', 'Borrador', 'En revisión', 'Publicada', 'Rechazada'].map(estado => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`filtro-btn ${filtroEstado === estado ? 'active' : ''}`}
            >
              {estado}
            </button>
          ))}
        </div>
      </div>

      {noticiasFiltradas.length === 0 ? (
        <div className="lista-vacia">
          <p>No hay noticias para mostrar</p>
          <p>💡 <strong>Sugerencia:</strong> Crea una nueva noticia o cambia el filtro</p>
        </div>
      ) : (
        <div className="noticias-grid">
          {noticiasFiltradas.map(noticia => {
            const badge = getEstadoBadge(noticia.estado);
            
            return (
              <div key={noticia.id} className="noticia-card">
                {noticia.imagen && (
                  <div className="noticia-imagen">
                    <img src={noticia.imagen} alt={noticia.titulo} />
                    <div className="noticia-overlay">
                      <Eye size={20} />
                      <span>{noticia.vistas || 0} vistas</span>
                    </div>
                  </div>
                )}

                <div className="noticia-contenido">
                  <div className="noticia-meta">
                    <span className="categoria-badge">
                      {noticia.categoria || 'General'}
                    </span>
                    <span 
                      className="estado-badge"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.icon}
                      {noticia.estado}
                    </span>
                  </div>

                  <h4 className="noticia-titulo">{noticia.titulo}</h4>
                  <p className="noticia-texto">
                    {(noticia.contenido || 'Sin contenido disponible').substring(0, 120)}...
                  </p>

                  <div className="noticia-footer">
                    <span className="noticia-autor">
                      Por {noticia.autor || 'Anónimo'}
                    </span>
                    <div className="noticia-acciones">
                      {/* BOTÓN EDITAR */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('✏️ Editando noticia:', noticia.id, noticia.titulo);
                          onEditar(noticia);
                        }}
                        className="btn-accion editar"
                        title={`Editar: ${noticia.titulo}`}
                      >
                        <Edit2 size={18} />
                      </button>

                      {/* BOTONES DE EDITOR */}
                      {usuario.rol === 'Editor' && (noticia.estado === 'En revisión' || noticia.estado === 'Terminado') && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCambiarEstado(noticia.id, 'Publicada', noticia.titulo);
                            }}
                            className="btn-accion publicar"
                            title="Publicar noticia"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCambiarEstado(noticia.id, 'Rechazada', noticia.titulo);
                            }}
                            className="btn-accion rechazar"
                            title="Rechazar noticia"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}

                      {/* BOTÓN ELIMINAR */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminar(noticia.id, noticia.titulo);
                        }}
                        className="btn-accion eliminar"
                        title={`Eliminar: ${noticia.titulo}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}