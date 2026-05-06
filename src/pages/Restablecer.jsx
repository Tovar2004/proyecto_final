// src/pages/Restablecer.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarCodigo, confirmarNuevaPassword } from '../services/authService';
import './Restablecer.css';

function Restablecer() {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [correo, setCorreo] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [enlaceInvalido, setEnlaceInvalido] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;

    const verificar = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('oobCode');

      if (!code) {
        if (activo) {
          setEnlaceInvalido(true);
          setVerificando(false);
        }
        return;
      }

      try {
        const email = await verificarCodigo(code);
        if (activo) {
          setCorreo(email);
          setOobCode(code);
        }
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

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

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
    <div className="restablecer-container">
      <div className="restablecer-card">
        <div className="restablecer-logo">🔐</div>
        <h2>Nueva Contraseña</h2>

        {verificando ? (
          <p className="restablecer-verificando">Verificando enlace...</p>
        ) : exito ? (
          <div className="restablecer-exito">
            ✅ ¡Contraseña actualizada exitosamente!
            <br /><br />
            <small>Redirigiendo al login en 3 segundos...</small>
          </div>
        ) : enlaceInvalido ? (
          <div className="restablecer-error">
            ⚠️ El enlace ha expirado o ya fue usado.
            <br /><br />
            <button className="restablecer-btn" onClick={() => navigate('/recuperar')}>
              Solicitar nuevo enlace
            </button>
          </div>
        ) : (
          <>
            {correo && (
              <p className="restablecer-correo">
                Cambiando contraseña para: <strong>{correo}</strong>
              </p>
            )}
            {error && <div className="restablecer-error-inline">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="restablecer-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="restablecer-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="restablecer-btn" disabled={loading}>
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Restablecer;