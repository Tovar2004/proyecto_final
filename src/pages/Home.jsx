// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import IncidenciaCard from "../components/IncidenciaCard";
import "./Home.css";

function Home() {
  const { usuario, rol } = useAuth();
  const [incidencias, setIncidencias] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [soloMias, setSoloMias] = useState(false);
  const [loading, setLoading] = useState(true);
  const ordenPrioridad = { alta: 1, media: 2, baja: 3, "sin asignar": 4 };
  const ordenEstado = { pendiente: 1, "en proceso": 2, resuelto: 3 };

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const q = query(
          collection(db, "incidencias"),
          orderBy("fecha", "desc"),
        );
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const ordenada = lista.sort((a, b) => {
          const pA = ordenPrioridad[a.prioridad] ?? 4;
          const pB = ordenPrioridad[b.prioridad] ?? 4;
          if (pA !== pB) return pA - pB;

          const eA = ordenEstado[a.estado] ?? 4;
          const eB = ordenEstado[b.estado] ?? 4;
          return eA - eB;
        });
        setIncidencias(ordenada);
        setFiltradas(ordenada);
      } catch (error) {
        console.error("Error al cargar incidencias:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidencias();
  }, []);

  const handleMisReportes = () => {
    if (soloMias) {
      setFiltradas(incidencias);
      setSoloMias(false);
    } else {
      setFiltradas(incidencias.filter((i) => i.clienteId === usuario?.uid));
      setSoloMias(true);
    }
  };

  return (
    <div className="page-container">
      <div className="galeria-header">
        <h1 className="page-title">Galería de Incidencias</h1>
        {rol === "cliente" && (
          <button
            className={`btn-mis-reportes ${soloMias ? "activo" : ""}`}
            onClick={handleMisReportes}
          >
            {soloMias ? "🌐 Ver todas" : "👤 Mis reportes"}
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading-text">Cargando incidencias...</p>
      ) : filtradas.length === 0 ? (
        <p className="empty-text">
          {soloMias
            ? "No has reportado incidencias aún."
            : "No hay incidencias reportadas aún."}
        </p>
      ) : (
        <div className="galeria-grid">
          {filtradas.map((item) => (
            <IncidenciaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
