import React, { useState } from 'react';
import { LogIn, User, Lock, Home } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/ConfigFirebase';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      let userData;

      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        userData = {
          nombre: user.email.split('@')[0],
          rol: user.email.includes('editor') ? 'Editor' : 'Reportero'
        };
      }

      onLogin({
        uid: user.uid,
        email: user.email,
        ...userData
      });
    } catch (err) {
      console.error('Error de login:', err);
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-futurista-container">
      <div className="bg-circles"></div>

      <div className="login-futurista-card">
        <div className="login-futurista-header">
          <div className="logo-glow">
            <LogIn size={48} />
          </div>
          <h1 className="titulo-login">Login</h1>
          <p className="subtitulo-login">Acceso al sistema de gestión</p>
        </div>

        {error && <div className="error-login">{error}</div>}

        <form onSubmit={handleSubmit} className="form-futurista">
          <div className="input-group">
            <div className="input-icon"><User size={18} /></div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon"><Lock size={18} /></div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>

          <button type="submit" className="btn-futurista" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
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

          <div className="login-links">
            <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
          </div>

          <div className="demo-info">
            <p>Usuarios de prueba:</p>
            <p><strong>Editor:</strong> editor@noticiero.com / editor123</p>
            <p><strong>Reportero:</strong> reportero@noticiero.com / reportero123</p>
          </div>
        </form>
      </div>
    </div>
  );
}