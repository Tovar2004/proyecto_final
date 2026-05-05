// src/components/RutaProtegida.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaProtegida({ children, rolRequerido }) {
  const { usuario, rol } = useAuth();

  if (!usuario) return <Navigate to="/login" />;
  if (rolRequerido && rol !== rolRequerido) return <Navigate to="/" />;

  return children;
}

export default RutaProtegida;