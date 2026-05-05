// src/pages/Login.jsx
import { useState } from 'react';
import {Link, Navigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { rol } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await iniciarSesion(correo, password);
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  // Redirigir según rol después de login
  if (rol === 'admin') return <Navigate to="/admin" />;
  if (rol === 'cliente') return <Navigate to="/galeria" />;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🚨</div>
        <h2>Iniciar Sesión</h2>
        <p>Ingresa a tu cuenta para continuar</p>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="login-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="login-recuperar">
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-registro">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;