// src/pages/ReporteAnonimo.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearIncidencia } from '../services/incidenciasService';
import { subirImagen } from '../services/storageService';
import './ReporteAnonimo.css';

const CATEGORIAS = [
  'Daño en aulas o salones',
  'Daño en baños',
  'Daño en iluminación',
  'Daño en puertas o ventanas',
  'Daño en techos o paredes',
  'Daño en pisos o escaleras',
  'Daño en acueducto o tuberías',
  'Daño en alcantarillado',
  'Falla en energía eléctrica',
  'Falla en internet o red',
  'Falla en sistema de aire acondicionado',
  'Daño en equipos de cómputo',
  'Daño en video beam o televisores',
  'Daño en impresoras o fotocopiadoras',
  'Falla en sistema de sonido',
  'Robo o hurto',
  'Persona sospechosa',
  'Daño en cámaras de seguridad',
  'Daño en cerraduras o accesos',
  'Acumulación de basuras',
  'Plagas o animales',
  'Malos olores',
  'Daño en zonas verdes',
  'Acoso o intimidación',
  'Accidente dentro del campus',
  'Emergencia médica',
  'Otro',
];
const initialForm = {
  categoria: '',
  otraCategoria: '',
  descripcion: '',
  direccion: '',
};

function ReporteAnonimo() {
  const [form, setForm] = useState(initialForm);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagen(archivo);
      setPreview(URL.createObjectURL(archivo));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!imagen) {
      setError('Por favor selecciona una imagen.');
      return;
    }
    try {
      setLoading(true);
      const categoriaFinal = form.categoria === 'Otro' ? form.otraCategoria : form.categoria;
      const imagenUrl = await subirImagen(imagen);
      await crearIncidencia({
        clienteId: null,
        nombre: 'Anónimo',
        apellido: '',
        telefono: '',
        correo: '',
        anonima: true,
        categoria: categoriaFinal,
        descripcion: form.descripcion,
        direccion: form.direccion,
        imagenUrl,
      });
      setExito(true);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al enviar el reporte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (exito) {
    return (
      <div className="anonimo-container">
        <div className="anonimo-exito">
          <div className="anonimo-exito-icon">✅</div>
          <h2>¡Reporte enviado!</h2>
          <p>Tu incidencia ha sido registrada exitosamente de forma anónima.</p>
          <button className="anonimo-btn-login" onClick={() => navigate('/login')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anonimo-container">
      <div className="anonimo-header">
        <div className="anonimo-badge">👤 Reporte Anónimo</div>
        <h1>Reportar Incidencia</h1>
        <p>No necesitas una cuenta para reportar. Tu identidad no será registrada.</p>
      </div>

      {error && (
        <div className="anonimo-error">
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <form className="anonimo-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Datos de la Incidencia</legend>
          <div className="anonimo-grid">

            <div className="anonimo-group">
              <label>Categoría</label>
              <select name="categoria" value={form.categoria} onChange={handleChange} required>
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {form.categoria === 'Otro' && (
              <div className="anonimo-group">
                <label>Especifica la categoría</label>
                <input
                  type="text"
                  name="otraCategoria"
                  value={form.otraCategoria}
                  onChange={handleChange}
                  placeholder="Describe la categoría..."
                  required
                />
              </div>
            )}

            <div className="anonimo-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección del incidente"
                required
              />
            </div>

            <div className="anonimo-group">
              <label>Fecha del reporte</label>
              <input
                type="text"
                value={new Date().toLocaleString('es-CO', {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
                disabled
                className="input-fecha"
              />
            </div>

            <div className="anonimo-group full-width">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente el incidente..."
                rows={4}
                required
              />
            </div>

            <div className="anonimo-group full-width">
              <label>Imagen del incidente</label>
              <input type="file" accept="image/*" onChange={handleImagen} required />
              {preview && <img src={preview} alt="preview" className="anonimo-preview" />}
            </div>

          </div>
        </fieldset>

        <div className="anonimo-actions">
          <button type="button" className="anonimo-btn-volver" onClick={() => navigate('/login')}>
            ← Volver
          </button>
          <button type="submit" className="anonimo-btn-enviar" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReporteAnonimo;