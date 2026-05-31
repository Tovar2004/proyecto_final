// src/pages/Login.jsx
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
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

  if (rol === 'admin') return <Navigate to="/admin" />;
  if (rol === 'cliente') return <Navigate to="/galeria" />;

  return (
    <div className="glass-page">
      <div className="glass-blob glass-blob-1" />
      <div className="glass-blob glass-blob-2" />
      <div className="glass-blob glass-blob-3" />

      <div className="glass-card">
        <div className="glass-logo">🚨</div>
        <h2 className="glass-title">Iniciar Sesión</h2>
        <p className="glass-subtitle">Universidad de la Amazonia</p>

        {error && <div className="glass-error">⚠️ {error}</div>}

        <form onSubmit={handleLogin} className="glass-form">
          <div className="glass-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="glass-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="glass-recuperar">
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </div>
          <button type="submit" className="glass-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="glass-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>       
      </div>
    </div>
  );
}

export default Login;
