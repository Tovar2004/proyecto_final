import { useEffect, useState } from "react";
import {
  obtenerIncidencias,
  actualizarEstado,
  eliminarIncidencia,
  actualizarPrioridad,
} from "../services/incidenciasService";
import { enviarCorreoCambioEstado } from "../services/emailService";
import "./Admin.css";

const ESTADOS = ["pendiente", "en proceso", "resuelto"];

const estadoColor = {
  pendiente: "#f39c12",
  "en proceso": "#3498db",
  resuelto: "#2ecc71",
};

const ordenPrioridad = { alta: 1, media: 2, baja: 3, "sin asignar": 4 };
const ordenEstado = { pendiente: 1, "en proceso": 2, resuelto: 3 };

const ordenarIncidencias = (lista) => {
  return [...lista].sort((a, b) => {
    const pA = ordenPrioridad[a.prioridad] ?? 4;
    const pB = ordenPrioridad[b.prioridad] ?? 4;
    if (pA !== pB) return pA - pB;
    const eA = ordenEstado[a.estado] ?? 3;
    const eB = ordenEstado[b.estado] ?? 3;
    return eA - eB;
  });
};

function Admin() {
  const [incidencias, setIncidencias] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteFiltro, setClienteFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [prioridadFiltro, setPrioridadFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [actualizandoPrioridad, setActualizandoPrioridad] = useState(null);
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [imagenModal, setImagenModal] = useState(null);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const data = await obtenerIncidencias();
        if (!activo) return;
        const ordenada = ordenarIncidencias(data);
        setIncidencias(ordenada);
        setFiltradas(ordenada);
        const mapa = {};
        ordenada.forEach((i) => {
          if (i.clienteId && !mapa[i.clienteId]) {
            mapa[i.clienteId] = `${i.nombre} ${i.apellido}`;
          }
        });
        setClientes(Object.entries(mapa).map(([id, nombre]) => ({ id, nombre })));
      } catch (err) {
        console.error("Error al cargar:", err);
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, []);

  const aplicarFiltros = (data, cliente, estado, prioridad) => {
    let resultado = data;
    if (cliente !== "todos") resultado = resultado.filter((i) => i.clienteId === cliente);
    if (estado !== "todos") resultado = resultado.filter((i) => i.estado === estado);
    if (prioridad !== "todos") resultado = resultado.filter((i) => (i.prioridad || "sin asignar") === prioridad);
    setFiltradas(resultado);
  };

  const handleFiltroCliente = (clienteId) => {
    setClienteFiltro(clienteId);
    aplicarFiltros(incidencias, clienteId, estadoFiltro, prioridadFiltro);
  };

  const handleFiltroEstado = (estado) => {
    setEstadoFiltro(estado);
    aplicarFiltros(incidencias, clienteFiltro, estado, prioridadFiltro);
  };

  const handleFiltroPrioridad = (prioridad) => {
    setPrioridadFiltro(prioridad);
    aplicarFiltros(incidencias, clienteFiltro, estadoFiltro, prioridad);
  };

  const handleEstado = async (incidencia, nuevoEstado) => {
    if (incidencia.estado === nuevoEstado) return;
    setActualizando(incidencia.id);
    try {
      await actualizarEstado(incidencia.id, nuevoEstado);
      if (!incidencia.anonima && incidencia.correo) {
        await enviarCorreoCambioEstado(incidencia, nuevoEstado);
      }
      const actualizadas = ordenarIncidencias(
        incidencias.map((i) => i.id === incidencia.id ? { ...i, estado: nuevoEstado } : i)
      );
      setIncidencias(actualizadas);
      aplicarFiltros(actualizadas, clienteFiltro, estadoFiltro, prioridadFiltro);
    } catch (err) {
      console.error("Error al actualizar:", err);
    } finally {
      setActualizando(null);
    }
  };

  const handlePrioridad = async (incidencia, nuevaPrioridad) => {
    if (incidencia.prioridad === nuevaPrioridad) return;
    setActualizandoPrioridad(incidencia.id);
    try {
      await actualizarPrioridad(incidencia.id, nuevaPrioridad);
      const actualizadas = ordenarIncidencias(
        incidencias.map((i) => i.id === incidencia.id ? { ...i, prioridad: nuevaPrioridad } : i)
      );
      setIncidencias(actualizadas);
      aplicarFiltros(actualizadas, clienteFiltro, estadoFiltro, prioridadFiltro);
    } catch (err) {
      console.error("Error al actualizar prioridad:", err);
    } finally {
      setActualizandoPrioridad(null);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarIncidencia(id);
      const actualizadas = ordenarIncidencias(incidencias.filter((i) => i.id !== id));
      setIncidencias(actualizadas);
      aplicarFiltros(actualizadas, clienteFiltro, estadoFiltro, prioridadFiltro);
      const mapa = {};
      actualizadas.forEach((i) => {
        if (i.clienteId && !mapa[i.clienteId]) {
          mapa[i.clienteId] = `${i.nombre} ${i.apellido}`;
        }
      });
      setClientes(Object.entries(mapa).map(([id, nombre]) => ({ id, nombre })));
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setConfirmEliminar(null);
    }
  };

  const fechaFormateada = (fecha) =>
    fecha?.toDate
      ? fecha.toDate().toLocaleString("es-CO", {
          year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "Sin fecha";

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Incidencias Registradas</h1>
        <div className="admin-header-right">
          <select className="select-cliente-filtro" value={clienteFiltro} onChange={(e) => handleFiltroCliente(e.target.value)}>
            <option value="todos">Todos los clientes</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <select className="select-cliente-filtro" value={estadoFiltro} onChange={(e) => handleFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="pendiente">🟡 Pendiente</option>
            <option value="en proceso">🔵 En proceso</option>
            <option value="resuelto">🟢 Resuelto</option>
          </select>
          <select className="select-cliente-filtro" value={prioridadFiltro} onChange={(e) => handleFiltroPrioridad(e.target.value)}>
            <option value="todos">Todas las prioridades</option>
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
            <option value="sin asignar">⚪ Sin asignar</option>
          </select>
          <span className="admin-total">
            {filtradas.length} incidencia{filtradas.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <p className="admin-loading">Cargando incidencias...</p>
      ) : filtradas.length === 0 ? (
        <p className="admin-loading">No hay incidencias para mostrar.</p>
      ) : (
        <div className="admin-tabla-wrapper">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Dirección</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.imagenUrl ? (
                      <img src={item.imagenUrl} alt="incidencia" className="admin-img" onClick={() => setImagenModal(item.imagenUrl)} />
                    ) : (
                      <span className="sin-img">Sin imagen</span>
                    )}
                  </td>
                  <td>
                    {item.anonima ? (
                      <span className="badge-anonimo">👤 Anónimo</span>
                    ) : (
                      <>{item.nombre} {item.apellido}<br /><small>{item.telefono}</small></>
                    )}
                  </td>
                  <td>{item.anonima ? '—' : item.correo}</td>
                  <td>{item.categoria}</td>
                  <td className="admin-descripcion">{item.descripcion}</td>
                  <td>{item.direccion}</td>
                  <td>{fechaFormateada(item.fecha)}</td>
                  <td>
                    <select
                      value={item.estado}
                      onChange={(e) => handleEstado(item, e.target.value)}
                      disabled={actualizando === item.id}
                      className="select-estado"
                      style={{ borderColor: estadoColor[item.estado] }}
                    >
                      {ESTADOS.map((est) => (
                        <option key={est} value={est}>{est}</option>
                      ))}
                    </select>
                    {actualizando === item.id && <span className="actualizando">Guardando...</span>}
                  </td>
                  <td>
                    <select
                      value={item.prioridad || "sin asignar"}
                      onChange={(e) => handlePrioridad(item, e.target.value)}
                      disabled={actualizandoPrioridad === item.id}
                      className="select-prioridad"
                      style={{
                        borderColor:
                          item.prioridad === "alta" ? "#e74c3c" :
                          item.prioridad === "media" ? "#f39c12" :
                          item.prioridad === "baja" ? "#2ecc71" : "#ccc",
                      }}
                    >
                      <option value="sin asignar">Sin asignar</option>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                    {actualizandoPrioridad === item.id && <span className="actualizando">Guardando...</span>}
                  </td>
                  <td>
                    {item.estado === "resuelto" ? (
                      confirmEliminar === item.id ? (
                        <div className="confirm-eliminar">
                          <p>¿Eliminar?</p>
                          <button className="btn-confirmar" onClick={() => handleEliminar(item.id)}>Sí</button>
                          <button className="btn-cancelar" onClick={() => setConfirmEliminar(null)}>No</button>
                        </div>
                      ) : (
                        <button className="btn-eliminar" onClick={() => setConfirmEliminar(item.id)}>Eliminar</button>
                      )
                    ) : (
                      <span className="no-eliminar" title="Solo se pueden eliminar incidencias resueltas">🔒</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {imagenModal && (
        <div className="modal-overlay" onClick={() => setImagenModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setImagenModal(null)}>×</button>
            <img src={imagenModal} alt="incidencia ampliada" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;