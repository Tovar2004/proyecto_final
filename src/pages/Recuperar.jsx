// src/pages/Recuperar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recuperarPassword } from '../services/authService';
import './Recuperar.css';

function Recuperar() {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await recuperarPassword(correo);
      setEnviado(true);
    } catch {
      setError('No encontramos una cuenta con ese correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-page">
      <div className="glass-blob glass-blob-1" />
      <div className="glass-blob glass-blob-2" />
      <div className="glass-blob glass-blob-3" />

      <div className="glass-card">
        <div className="glass-logo">🔑</div>
        <h2 className="glass-title">Recuperar Contraseña</h2>
        <p className="glass-subtitle">Te enviaremos un enlace a tu correo</p>

        {enviado ? (
          <div className="glass-success">
            ✅ Correo enviado. Revisa tu bandeja de entrada.
            <br /><br />
            <Link to="/login">← Volver al login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-form">
            {error && <div className="glass-error">⚠️ {error}</div>}
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
            <button type="submit" className="glass-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <p className="glass-footer">
              <Link to="/login">← Volver al login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Recuperar;
