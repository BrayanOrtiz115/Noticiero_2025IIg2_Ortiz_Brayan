import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, Image as ImageIcon } from 'lucide-react';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import db from '../../Firebase/ConfigFirebase';
import './FormularioNoticia.css';

export default function FormularioNoticia({ usuario, noticia, onCerrar }) {
  const [titulo, setTitulo] = useState(noticia?.titulo || '');
  const [subtitulo, setSubtitulo] = useState(noticia?.subtitulo || '');
  const [contenido, setContenido] = useState(noticia?.contenido || '');
  const [imagen, setImagen] = useState(noticia?.imagen || '');
  const [categoria, setCategoria] = useState(noticia?.categoria || '');
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async (estado) => {
    if (!titulo || !contenido) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setGuardando(true);
    console.log('💾 Guardando noticia en Firebase...', { titulo, estado });

    try {
      const noticiaData = {
        titulo,
        subtitulo,
        contenido,
        imagen,
        categoria: categoria || 'General',
        autor: usuario.nombre || usuario.email,
        autor_id: usuario.uid,
        estado,
        fecha_actualizacion: new Date().toISOString()
      };

      if (noticia?.id) {
        // Actualizar noticia existente
        console.log('🔄 Actualizando noticia existente:', noticia.id);
        await setDoc(doc(db, 'noticias', noticia.id), noticiaData, { merge: true });
        console.log('✅ Noticia actualizada:', noticia.id);
      } else {
        // Crear nueva noticia
        noticiaData.fecha_creacion = new Date().toISOString();
        console.log('🆕 Creando nueva noticia...');
        const docRef = await addDoc(collection(db, 'noticias'), noticiaData);
        console.log('✅ Nueva noticia creada:', docRef.id);
      }

      onCerrar();
    } catch (err) {
      console.error('❌ Error al guardar:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="formulario-noticia">
      <div className="formulario-header">
        <button onClick={onCerrar} className="btn-volver">
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>
        <h2 className="formulario-title">
          {noticia ? 'Editar Noticia' : 'Nueva Noticia'}
        </h2>
      </div>

      <div className="formulario-container">
        <div className="form-group">
          <label className="form-label">Título de la Noticia *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="form-input"
            placeholder="Escribe un título llamativo..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Subtítulo o Bajante</label>
          <input
            type="text"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className="form-input"
            placeholder="Escribe un subtítulo descriptivo..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="form-select"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Deportes">Deportes</option>
              <option value="Política">Política</option>
              <option value="Cultura">Cultura</option>
              <option value="Economía">Economía</option>
              <option value="Salud">Salud</option>
              <option value="Educación">Educación</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={18} />
              URL de la Imagen
            </label>
            <input
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>

        {imagen && (
          <div className="imagen-preview">
            <img src={imagen} alt="Preview" />
            <p className="imagen-url">Vista previa: {imagen}</p>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Contenido de la Noticia *</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="form-textarea"
            placeholder="Escribe el contenido completo de la noticia..."
            rows="12"
            required
          />
        </div>

        <div className="formulario-acciones">
          <button
            onClick={() => handleGuardar('Borrador')}
            disabled={guardando}
            className="btn-secundario"
          >
            <Save size={20} />
            {guardando ? 'Guardando...' : 'Guardar Borrador'}
          </button>

          <button
            onClick={() => handleGuardar(usuario.rol === 'Editor' ? 'Publicada' : 'En revisión')}
            disabled={guardando}
            className="btn-primario"
          >
            <Send size={20} />
            {guardando ? 'Guardando...' : (usuario.rol === 'Editor' ? 'Publicar' : 'Enviar a Revisión')}
          </button>
        </div>

        <div className="formulario-info">
          <p><strong>Info:</strong> Los campos con * son obligatorios</p>
          <p><strong>Estado actual:</strong> {noticia?.estado || 'Nueva'}</p>
        </div>
      </div>
    </div>
  );
}