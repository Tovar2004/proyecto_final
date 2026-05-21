// src/pages/Estadisticas.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './Estadisticas.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Estadisticas() {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, 'incidencias'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (activo) setIncidencias(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, []);

  const total = incidencias.length;
  const pendientes = incidencias.filter(i => i.estado === 'pendiente').length;
  const enProceso = incidencias.filter(i => i.estado === 'en proceso').length;
  const resueltas = incidencias.filter(i => i.estado === 'resuelto').length;
  const anonimas = incidencias.filter(i => i.anonima).length;
  const alta = incidencias.filter(i => i.prioridad === 'alta').length;
  const media = incidencias.filter(i => i.prioridad === 'media').length;
  const baja = incidencias.filter(i => i.prioridad === 'baja').length;
  const pct = n => total > 0 ? Math.round((n / total) * 100) : 0;

  const catCount = {};
  incidencias.forEach(i => { catCount[i.categoria] = (catCount[i.categoria] || 0) + 1; });
  const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCat = topCats[0]?.[1] || 1;

  const recientes = [...incidencias]
    .filter(i => i.fecha)
    .sort((a, b) => b.fecha?.toDate() - a.fecha?.toDate())
    .slice(0, 5);

  const donutData = {
    labels: ['Pendiente', 'En proceso', 'Resuelto'],
    datasets: [{
      data: [pendientes, enProceso, resueltas],
      backgroundColor: ['#BA7517', '#378ADD', '#639922'],
      borderWidth: 0,
      hoverOffset: 4,
    }]
  };

  const barPrioridadData = {
    labels: ['Alta', 'Media', 'Baja'],
    datasets: [{
      data: [alta, media, baja],
      backgroundColor: ['#D85A30', '#EF9F27', '#639922'],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const fechaFormateada = (fecha) => fecha?.toDate
    ? fecha.toDate().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  if (loading) return (
    <div className="stats-loading">
      <div className="stats-spinner"></div>
      Cargando estadísticas...
    </div>
  );

  return (
    <div className="stats-container">
      <div className="stats-hero">
        <h1>Panel de Estadísticas</h1>
        <p>Resumen general de incidencias reportadas</p>
      </div>

      {/* KPI CARDS */}
      <div className="stats-kpi">
        <div className="kpi-card total">
          <div className="kpi-icon">📋</div>
          <div className="kpi-num">{total}</div>
          <div className="kpi-label">Total reportadas</div>
        </div>
        <div className="kpi-card pendiente">
          <div className="kpi-icon">⏳</div>
          <div className="kpi-num">{pendientes}</div>
          <div className="kpi-label">Pendientes ({pct(pendientes)}%)</div>
        </div>
        <div className="kpi-card proceso">
          <div className="kpi-icon">🔄</div>
          <div className="kpi-num">{enProceso}</div>
          <div className="kpi-label">En proceso ({pct(enProceso)}%)</div>
        </div>
        <div className="kpi-card resuelto">
          <div className="kpi-icon">✅</div>
          <div className="kpi-num">{resueltas}</div>
          <div className="kpi-label">Resueltas ({pct(resueltas)}%)</div>
        </div>
        <div className="kpi-card anonima">
          <div className="kpi-icon">👤</div>
          <div className="kpi-num">{anonimas}</div>
          <div className="kpi-label">Anónimas ({pct(anonimas)}%)</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="stats-charts">

        {/* Dona de estados */}
        <div className="chart-card">
          <h3>Distribución por estado</h3>
          <div className="chart-legend">
            <span><span className="dot" style={{background:'#BA7517'}}></span>Pendiente {pendientes}</span>
            <span><span className="dot" style={{background:'#378ADD'}}></span>En proceso {enProceso}</span>
            <span><span className="dot" style={{background:'#639922'}}></span>Resuelto {resueltas}</span>
          </div>
          <div className="chart-wrap-sm">
            <Doughnut data={donutData} options={{
              cutout: '65%',
              plugins: { legend: { display: false } },
              maintainAspectRatio: false
            }} />
          </div>
        </div>

        {/* Prioridad */}
        <div className="chart-card">
          <h3>Prioridad de incidencias</h3>
          <div className="prioridad-grid">
            <div className="prio-card prio-alta">
              <div className="prio-num">{alta}</div>
              <div className="prio-label">Alta</div>
            </div>
            <div className="prio-card prio-media">
              <div className="prio-num">{media}</div>
              <div className="prio-label">Media</div>
            </div>
            <div className="prio-card prio-baja">
              <div className="prio-num">{baja}</div>
              <div className="prio-label">Baja</div>
            </div>
          </div>
          <div className="chart-wrap-xs">
            <Bar data={barPrioridadData} options={{
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { stepSize: 1 } }
              },
              maintainAspectRatio: false
            }} />
          </div>
        </div>

        {/* Categorías */}
        <div className="chart-card chart-full">
          <h3>Incidencias por categoría</h3>
          <div className="cat-bars">
            {topCats.map(([cat, count]) => (
              <div className="cat-row" key={cat}>
                <div className="cat-label" title={cat}>{cat}</div>
                <div className="cat-bar-wrap">
                  <div className="cat-bar" style={{ width: `${Math.round((count / maxCat) * 100)}%` }}>
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recientes */}
        {recientes.length > 0 && (
          <div className="chart-card chart-full">
            <h3>Últimas incidencias reportadas</h3>
            <div className="recientes">
              {recientes.map(item => (
                <div className="reciente-row" key={item.id}>
                  <span className={`estado-pill pill-${item.estado?.replace(' ', '-')}`}>
                    {item.estado}
                  </span>
                  <div className="reciente-info">
                    <div className="reciente-cat">{item.categoria}</div>
                    <div className="reciente-fecha">{fechaFormateada(item.fecha)}</div>
                  </div>
                  {item.anonima && <span className="reciente-anonimo">Anónimo</span>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Estadisticas;