// src/pages/ReportarIncidencia.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { crearIncidencia } from "../services/incidenciasService";
import { subirImagen } from "../services/storageService";
import { enviarCorreoReporte } from "../services/emailService";
import "./ReportarIncidencia.css";
import { useNavigate } from "react-router-dom";

const CATEGORIAS = [
  "Daño en aulas o salones",
  "Daño en baños",
  "Daño en iluminación",
  "Daño en puertas o ventanas",
  "Daño en techos o paredes",
  "Daño en pisos o escaleras",
  "Daño en acueducto o tuberías",
  "Daño en alcantarillado",
  "Falla en energía eléctrica",
  "Falla en internet o red",
  "Falla en sistema de aire acondicionado",
  "Daño en equipos de cómputo",
  "Daño en video beam o televisores",
  "Daño en impresoras o fotocopiadoras",
  "Falla en sistema de sonido",
  "Robo o hurto",
  "Persona sospechosa",
  "Daño en cámaras de seguridad",
  "Daño en cerraduras o accesos",
  "Acumulación de basuras",
  "Plagas o animales",
  "Malos olores",
  "Daño en zonas verdes",
  "Acoso o intimidación",
  "Accidente dentro del campus",
  "Emergencia médica",
  "Otro",
];

const initialForm = {
  categoria: "",
  otraCategoria: "",
  descripcion: "",
  direccion: "",
};

function ReportarIncidencia() {
  const { usuario } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagen(archivo);
      setPreview(URL.createObjectURL(archivo));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!imagen) {
      setError("Por favor selecciona una imagen.");
      return;
    }
    try {
      setLoading(true);
      const categoriaFinal =
        form.categoria === "Otro" ? form.otraCategoria : form.categoria;
      const imagenUrl = await subirImagen(imagen);

      await crearIncidencia({
        clienteId: usuario.uid,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        correo: usuario.correo,
        categoria: categoriaFinal,
        descripcion: form.descripcion,
        direccion: form.direccion,
        imagenUrl,
      });

      await enviarCorreoReporte({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        categoria: categoriaFinal,
        descripcion: form.descripcion,
        direccion: form.direccion,
      });

      setExito(true);
      setForm(initialForm);
      setImagen(null);
      setPreview(null);
      setTimeout(() => {
        navigate("/galeria");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar el reporte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Reportar Incidencia</h1>

      {/* INFO DEL CLIENTE LOGUEADO */}
      <div className="cliente-info">
        <div className="cliente-avatar">
          {usuario?.nombre?.charAt(0).toUpperCase()}
        </div>
        <div>
          <strong>
            {usuario?.nombre} {usuario?.apellido}
          </strong>
          <span>{usuario?.correo}</span>
          {usuario?.telefono && <span>📞 {usuario?.telefono}</span>}
        </div>
      </div>

      {exito && (
        <div className="alerta-exito">
          ✅ ¡Reporte enviado exitosamente!
          <button onClick={() => setExito(false)}>×</button>
        </div>
      )}

      {error && (
        <div className="alerta-error">
          ⚠️ {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <form className="form-reporte" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Datos de la Incidencia</legend>
          <div className="form-grid">
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {form.categoria === "Otro" && (
              <div className="form-group">
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

            <div className="form-group">
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

            <div className="form-group">
              <label>Fecha del reporte</label>
              <input
                type="text"
                value={new Date().toLocaleString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                disabled
                className="input-fecha"
              />
            </div>

            <div className="form-group full-width">
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

            <div className="form-group full-width">
              <label>Imagen del incidente</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagen}
                required
              />
              {preview && (
                <img src={preview} alt="preview" className="img-preview" />
              )}
            </div>
          </div>
        </fieldset>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Reporte"}
        </button>
      </form>
    </div>
  );
}

export default ReportarIncidencia;
