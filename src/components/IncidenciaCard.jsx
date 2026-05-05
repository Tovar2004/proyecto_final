// src/components/IncidenciaCard.jsx
import "./IncidenciaCard.css";

const estadoColor = {
  pendiente: "#f39c12",
  "en proceso": "#3498db",
  resuelto: "#2ecc71",
};

function IncidenciaCard({ item }) {
  const { categoria, descripcion, direccion, estado, fecha, imagenUrl } = item;

  const fechaFormateada = fecha?.toDate
    ? fecha.toDate().toLocaleString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sin fecha";

  return (
    <div className="card">
      {imagenUrl ? (
        <img src={imagenUrl} alt="incidencia" className="card-img" />
      ) : (
        <div className="card-img-placeholder">Sin imagen</div>
      )}
      <div className="card-body">
        <span
          className="card-estado"
          style={{ backgroundColor: estadoColor[estado] || "#999" }}
        >
          {estado}
        </span>
        <h3 className="card-categoria">{categoria}</h3>
        <p className="card-descripcion">{descripcion}</p>
        <p className="card-direccion">📍 {direccion}</p>
        <p className="card-fecha">📅 {fechaFormateada}</p>
      </div>
    </div>
  );
}

export default IncidenciaCard;
