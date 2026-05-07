// src/pages/Clientes.jsx
import { useEffect, useState } from 'react';
import { obtenerClientes, eliminarCliente } from '../services/clientesService';
import './Clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmEliminar, setConfirmEliminar] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const data = await obtenerClientes();
        if (activo) setClientes(data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargar();
    return () => { activo = false; };
  }, []);

  const handleEliminar = async (uid) => {
    try {
      await eliminarCliente(uid);
      setClientes(prev => prev.filter(c => c.id !== uid));
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    } finally {
      setConfirmEliminar(null);
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Clientes Registrados</h1>
        <span className="clientes-total">
          {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <p className="clientes-loading">Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p className="clientes-loading">No hay clientes registrados.</p>
      ) : (
        <div className="clientes-tabla-wrapper">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>
                    <div className="cliente-avatar">
                      {cliente.nombre?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    {confirmEliminar === cliente.id ? (
                      <div className="confirm-eliminar">
                        <p>¿Eliminar cliente?</p>
                        <button className="btn-confirmar" onClick={() => handleEliminar(cliente.id)}>Sí</button>
                        <button className="btn-cancelar" onClick={() => setConfirmEliminar(null)}>No</button>
                      </div>
                    ) : (
                      <button
                        className="btn-eliminar-cliente"
                        onClick={() => setConfirmEliminar(cliente.id)}
                      >
                        Eliminar
                      </button>
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

export default Clientes;