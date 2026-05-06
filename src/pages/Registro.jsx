// src/pages/Registro.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarCliente } from '../services/authService';
import './Registro.css';

const initialForm = {
  nombre: '', apellido: '', telefono: '', correo: '', password: '', confirmar: ''
};

function Registro() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registrarCliente(form);
      navigate('/galeria');
    } catch {
      setError('Este correo ya está registrado o hubo un error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-logo">📝</div>
        <h2>Crear Cuenta</h2>
        <p>Regístrate para reportar incidencias</p>

        {error && <div className="registro-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="registro-grid">
            <div className="registro-group">
              <label>Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
            </div>
            <div className="registro-group">
              <label>Apellido</label>
              <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tu apellido" required />
            </div>
            <div className="registro-group">
              <label>Teléfono</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="3001234567" required />
            </div>
            <div className="registro-group">
              <label>Correo electrónico</label>
              <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="tu@correo.com" required />
            </div>
            <div className="registro-group">
              <label>Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            <div className="registro-group">
              <label>Confirmar contraseña</label>
              <input type="password" name="confirmar" value={form.confirmar} onChange={handleChange} placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" className="registro-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="registro-login">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;