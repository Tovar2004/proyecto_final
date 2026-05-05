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
    console.log('Correo enviado a:', correo);
    setEnviado(true);
  } catch (err) {
    console.error('Error completo:', err.code, err.message);
    setError('No encontramos una cuenta con ese correo.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <div className="recuperar-logo">🔑</div>
        <h2>Recuperar Contraseña</h2>
        <p>Te enviaremos un enlace para restablecer tu contraseña</p>

        {enviado ? (
          <div className="recuperar-exito">
            ✅ Correo enviado. Revisa tu bandeja de entrada.
            <br /><br />
            <Link to="/login" className="recuperar-link">← Volver al login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="recuperar-error">⚠️ {error}</div>}
            <div className="recuperar-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>
            <button type="submit" className="recuperar-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <p className="recuperar-volver">
              <Link to="/login">← Volver al login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Recuperar;