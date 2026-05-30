// src/component/IncidenciaCard.jsx
import { useRef, useCallback } from "react";
import "./IncidenciaCard.css";

const estadoColor = {
  pendiente:    "#f39c12",
  "en proceso": "#3498db",
  resuelto:     "#2ecc71",
};

const prioridadConfig = {
  alta:          { color: "#e74c3c", bg: "#fdecea", emoji: "🔴" },
  media:         { color: "#f39c12", bg: "#fef9e7", emoji: "🟡" },
  baja:          { color: "#2ecc71", bg: "#eafaf1", emoji: "🟢" },
  "sin asignar": { color: "#aaa",    bg: "#f5f5f5", emoji: "⚪" },
};

function IncidenciaCard({ item }) {
  const cardRef  = useRef(null);
  const glareRef = useRef(null);
  const rafRef   = useRef(null);
  const timerRef = useRef(null);

  const { categoria, descripcion, direccion, estado, fecha, imagenUrl, prioridad } = item;

  const fechaFormateada = fecha?.toDate
    ? fecha.toDate().toLocaleString("es-CO", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "Sin fecha";

  const pConfig = prioridadConfig[prioridad] || prioridadConfig["sin asignar"];

  const handleMouseMove = useCallback((e) => {
    // Cancelar el timer de "returning" si el mouse vuelve
    if (timerRef.current) clearTimeout(timerRef.current);
    const card = cardRef.current;
    if (card) card.classList.remove("returning");

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const card  = cardRef.current;
      const glare = glareRef.current;
      if (!card || !glare) return;

      const rect = card.getBoundingClientRect();
      const x  = e.clientX - rect.left;
      const y  = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;

      // Movimiento físico + tilt 3D
      const moveX = ((x - cx) / cx) * 16;
      const moveY = ((y - cy) / cy) * 16;
      const rotX  = ((y - cy) / cy) * -14;
      const rotY  = ((x - cx) / cx) *  14;

      card.style.transform = `translateX(${moveX}px) translateY(${moveY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;

      // Glare sigue el cursor
      const pctX = (x / rect.width)  * 100;
      const pctY = (y / rect.height) * 100;
      glare.style.opacity    = "1";
      glare.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 50%, transparent 70%)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const card  = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    // Clase "returning" activa el spring de vuelta
    card.classList.add("returning");
    card.style.transform = "translateX(0px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)";
    glare.style.opacity  = "0";

    timerRef.current = setTimeout(() => {
      if (cardRef.current) cardRef.current.classList.remove("returning");
    }, 650);
  }, []);

  return (
    <div className="card-perspective">
      <div
        className="card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-glare" ref={glareRef} />

        <div className="card-inner" style={{ borderTop: `4px solid ${pConfig.color}` }}>
          <div className="card-img-wrapper">
            {imagenUrl ? (
              <img src={imagenUrl} alt="incidencia" className="card-img" />
            ) : (
              <div className="card-img-placeholder">Sin imagen</div>
            )}
          </div>

          <div className="card-body">
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
      </div>
    </div>
  );
}

export default IncidenciaCard;
