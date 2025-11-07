import React, { useState } from 'react';
import { UserPlus, User, Lock, Mail, Shield, Eye, EyeOff, Home } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/ConfigFirebase';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'Reportero'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        fecha_creacion: new Date().toISOString()
      };

      await setDoc(doc(db, 'usuarios', user.uid), userData);

      // Ejecutar callback de registro exitoso
      if (onRegister) {
        onRegister({
          uid: user.uid,
          ...userData
        });
      }

      // Redirigir al admin
      navigate('/admin');

    } catch (err) {
      console.error('Error de registro:', err);
      
      let errorMessage = 'Error al crear la cuenta. Intenta nuevamente.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-futurista-container">
      <div className="bg-circles"></div>

      <div className="register-futurista-card">
        <div className="register-futurista-header">
          <div className="logo-glow">
            <UserPlus size={48} />
          </div>
          <h1 className="titulo-register">Crear Cuenta</h1>
          <p className="subtitulo-register">Únete a nuestro sistema de noticias</p>
        </div>

        {error && <div className="error-register">{error}</div>}

        <form onSubmit={handleSubmit} className="form-futurista">
          <div className="input-group">
            <div className="input-icon"><User size={18} /></div>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon"><Mail size={18} /></div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon"><Lock size={18} /></div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={18} color="#cbd5e1" /> : <Eye size={18} color="#cbd5e1" />}
            </button>
          </div>

          <div className="input-group">
            <div className="input-icon"><Lock size={18} /></div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <EyeOff size={18} color="#cbd5e1" /> : <Eye size={18} color="#cbd5e1" />}
            </button>
          </div>

          <div className="input-group">
            <div className="input-icon"><Shield size={18} /></div>
            <select 
              name="rol" 
              value={formData.rol} 
              onChange={handleChange}
              className="role-select"
            >
              <option value="Reportero">Reportero</option>
              <option value="Editor">Editor</option>
            </select>
          </div>

          <button type="submit" className="btn-futurista" disabled={loading}>
            {loading ? 'Creando Cuenta...' : 'Registrarse'}
          </button>

          {/* Botón Volver */}
          <button 
            type="button" 
            className="btn-volver"
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            Volver al Inicio
          </button>

          <div className="login-link">
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
          </div>

          <div className="demo-info">
            <p><strong>Nota:</strong> Los editores pueden crear, editar y publicar noticias. 
            Los reporteros solo pueden crear borradores.</p>
          </div>
        </form>
      </div>
    </div>
  );
}