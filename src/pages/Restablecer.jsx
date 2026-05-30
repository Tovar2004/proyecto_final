// src/pages/Restablecer.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarCodigo, confirmarNuevaPassword } from '../services/authService';
import './Restablecer.css';

function Restablecer() {
  const [password, setPassword]       = useState('');
  const [confirmar, setConfirmar]     = useState('');
  const [correo, setCorreo]           = useState('');
  const [oobCode, setOobCode]         = useState('');
  const [error, setError]             = useState('');
  const [exito, setExito]             = useState(false);
  const [loading, setLoading]         = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [enlaceInvalido, setEnlaceInvalido] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;
    const verificar = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('oobCode');
      if (!code) { if (activo) { setEnlaceInvalido(true); setVerificando(false); } return; }
      try {
        const email = await verificarCodigo(code);
        if (activo) { setCorreo(email); setOobCode(code); }
      } catch {
        if (activo) setEnlaceInvalido(true);
      } finally {
        if (activo) setVerificando(false);
      }
    };
    verificar();
    return () => { activo = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmar) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6)   { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    try {
      await confirmarNuevaPassword(oobCode, password);
      setExito(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setError('Ocurrió un error. Solicita un nuevo enlace.');
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
        <div className="glass-logo">🔐</div>
        <h2 className="glass-title">Nueva Contraseña</h2>
        <p className="glass-subtitle">Universidad de la Amazonia</p>

        {verificando ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Verificando enlace...</p>
        ) : exito ? (
          <div className="glass-success">
            ✅ ¡Contraseña actualizada exitosamente!
            <br /><br />
            <small style={{ opacity: 0.7 }}>Redirigiendo al login en 3 segundos...</small>
          </div>
        ) : enlaceInvalido ? (
          <div className="glass-error" style={{ flexDirection: 'column', gap: '14px' }}>
            <span>⚠️ El enlace ha expirado o ya fue usado.</span>
            <button className="glass-btn" style={{ marginTop: '8px' }} onClick={() => navigate('/recuperar')}>
              Solicitar nuevo enlace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-form">
            {correo && (
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: '-8px' }}>
                Para: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{correo}</strong>
              </p>
            )}
            {error && <div className="glass-error">⚠️ {error}</div>}
            <div className="glass-group">
              <label>Nueva contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="glass-group">
              <label>Confirmar contraseña</label>
              <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="glass-btn" disabled={loading}>
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Restablecer;
