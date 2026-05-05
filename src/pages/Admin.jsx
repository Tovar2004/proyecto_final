import { useEffect, useState } from 'react';
import { obtenerIncidencias, actualizarEstado, eliminarIncidencia } from '../services/incidenciasService';
import { enviarCorreoCambioEstado } from '../services/emailService';
import './Admin.css';

const ESTADOS = ['pendiente', 'en proceso', 'resuelto'];

const estadoColor = {
  pendiente: '#f39c12',
  'en proceso': '#3498db',
  resuelto: '#2ecc71',
};

function Admin() {
  const [incidencias, setIncidencias] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteFiltro, setClienteFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [confirmEliminar, setConfirmEliminar] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const data = await obtenerIncidencias();
        if (!activo) return;
        setIncidencias(data);
        setFiltradas(data);
        const mapa = {};
        data.forEach(i => {
          if (i.clienteId && !mapa[i.clienteId]) {
            mapa[i.clienteId] = `${i.nombre} ${i.apellido}`;
          }
        });
        setClientes(Object.entries(mapa).map(([id, nombre]) => ({ id, nombre })));
      } catch (err) {
        console.error('Error al cargar:', err);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargar();
    return () => { activo = false; };
  }, []);

  const handleFiltroCliente = (clienteId) => {
    setClienteFiltro(clienteId);
    if (clienteId === 'todos') {
      setFiltradas(incidencias);
    } else {
      setFiltradas(incidencias.filter(i => i.clienteId === clienteId));
    }
  };

  const handleEstado = async (incidencia, nuevoEstado) => {
    if (incidencia.estado === nuevoEstado) return;
    setActualizando(incidencia.id);
    try {
      await actualizarEstado(incidencia.id, nuevoEstado);
      await enviarCorreoCambioEstado(incidencia, nuevoEstado);
      const actualizadas = incidencias.map(i =>
        i.id === incidencia.id ? { ...i, estado: nuevoEstado } : i
      );
      setIncidencias(actualizadas);
      setFiltradas(
        clienteFiltro === 'todos'
          ? actualizadas
          : actualizadas.filter(i => i.clienteId === clienteFiltro)
      );
    } catch (err) {
      console.error('Error al actualizar:', err);
    } finally {
      setActualizando(null);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarIncidencia(id);
      const actualizadas = incidencias.filter(i => i.id !== id);
      setIncidencias(actualizadas);
      setFiltradas(
        clienteFiltro === 'todos'
          ? actualizadas
          : actualizadas.filter(i => i.clienteId === clienteFiltro)
      );
      const mapa = {};
      actualizadas.forEach(i => {
        if (i.clienteId && !mapa[i.clienteId]) {
          mapa[i.clienteId] = `${i.nombre} ${i.apellido}`;
        }
      });
      setClientes(Object.entries(mapa).map(([id, nombre]) => ({ id, nombre })));
    } catch (err) {
      console.error('Error al eliminar:', err);
    } finally {
      setConfirmEliminar(null);
    }
  };

  const fechaFormateada = (fecha) =>
    fecha?.toDate
      ? fecha.toDate().toLocaleString('es-CO', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      : 'Sin fecha';

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-header-right">
          <select
            className="select-cliente-filtro"
            value={clienteFiltro}
            onChange={e => handleFiltroCliente(e.target.value)}
          >
            <option value="todos">👥 Todos los clientes</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <span className="admin-total">
            {filtradas.length} incidencia{filtradas.length !== 1 ? 's' : ''}
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.imagenUrl
                      ? <img src={item.imagenUrl} alt="incidencia" className="admin-img" />
                      : <span className="sin-img">Sin imagen</span>
                    }
                  </td>
                  <td>{item.nombre} {item.apellido}<br /><small>{item.telefono}</small></td>
                  <td>{item.correo}</td>
                  <td>{item.categoria}</td>
                  <td className="admin-descripcion">{item.descripcion}</td>
                  <td>{item.direccion}</td>
                  <td>{fechaFormateada(item.fecha)}</td>
                  <td>
                    <select
                      value={item.estado}
                      onChange={e => handleEstado(item, e.target.value)}
                      disabled={actualizando === item.id}
                      className="select-estado"
                      style={{ borderColor: estadoColor[item.estado] }}
                    >
                      {ESTADOS.map(est => (
                        <option key={est} value={est}>{est}</option>
                      ))}
                    </select>
                    {actualizando === item.id && <span className="actualizando">Guardando...</span>}
                  </td>
                  <td>
                    {item.estado === 'resuelto' ? (
                      confirmEliminar === item.id ? (
                        <div className="confirm-eliminar">
                          <p>¿Eliminar?</p>
                          <button className="btn-confirmar" onClick={() => handleEliminar(item.id)}>Sí</button>
                          <button className="btn-cancelar" onClick={() => setConfirmEliminar(null)}>No</button>
                        </div>
                      ) : (
                        <button className="btn-eliminar" onClick={() => setConfirmEliminar(item.id)}>
                          🗑️ Eliminar
                        </button>
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
    </div>
  );
}

export default Admin;