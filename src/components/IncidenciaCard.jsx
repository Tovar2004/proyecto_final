// src/component/IncidenciaCard.jsx
import "./IncidenciaCard.css";

const estadoColor = {
  pendiente: "#f39c12",
  "en proceso": "#3498db",
  resuelto: "#2ecc71",
};

const prioridadConfig = {
  alta: { color: "#e74c3c", bg: "#fdecea", emoji: "🔴" },
  media: { color: "#f39c12", bg: "#fef9e7", emoji: "🟡" },
  baja: { color: "#2ecc71", bg: "#eafaf1", emoji: "🟢" },
  "sin asignar": { color: "#aaa", bg: "#f5f5f5", emoji: "⚪" },
};

function IncidenciaCard({ item }) {
  const {
    categoria,
    descripcion,
    direccion,
    estado,
    fecha,
    imagenUrl,
    prioridad,
  } = item;

  const fechaFormateada = fecha?.toDate
    ? fecha.toDate().toLocaleString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sin fecha";

  const pConfig = prioridadConfig[prioridad] || prioridadConfig["sin asignar"];

  return (
    <div className="card" style={{ borderTop: `4px solid ${pConfig.color}` }}>
      {imagenUrl ? (
        <img src={imagenUrl} alt="incidencia" className="card-img" />
      ) : (
        <div className="card-img-placeholder">Sin imagen</div>
      )}

      <div className="card-body">
        {/* FILA: estado + prioridad */}
        <div className="card-badges">
          <span
            className="card-estado"
            style={{ backgroundColor: estadoColor[estado] || "#999" }}
          >
            {estado}
          </span>
          {item.anonima && <span className="card-anonimo">👤 Anónimo</span>}
          {prioridad && prioridad !== "sin asignar" && (
            <span
              className="card-prioridad"
              style={{
                backgroundColor: pConfig.bg,
                color: pConfig.color,
                border: `1px solid ${pConfig.color}`,
              }}
            >
              {pConfig.emoji} {prioridad}
            </span>
          )}
        </div>

        <h3 className="card-categoria">{categoria}</h3>
        <p className="card-descripcion">{descripcion}</p>
        <p className="card-direccion">📍 {direccion}</p>
        <p className="card-fecha">📅 {fechaFormateada}</p>
      </div>
    </div>
  );
}

export default IncidenciaCard;
