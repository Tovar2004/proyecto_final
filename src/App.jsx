// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import Navbar from './components/Navbar';
import RutaProtegida from './components/RutaProtegida';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Recuperar from './pages/Recuperar';
import Home from './pages/Home';
import ReportarIncidencia from './pages/ReportarIncidencia';
import Admin from './pages/Admin';

function RutaRaiz() {
  const { rol } = useAuth();
  if (rol === 'admin') return <Navigate to="/admin" />;
  if (rol === 'cliente') return <Navigate to="/galeria" />;
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<RutaRaiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/galeria" element={
            <RutaProtegida><Home /></RutaProtegida>
          } />
          <Route path="/reportar" element={
            <RutaProtegida rolRequerido="cliente"><ReportarIncidencia /></RutaProtegida>
          } />
          <Route path="/admin" element={
            <RutaProtegida rolRequerido="admin"><Admin /></RutaProtegida>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;