// src/pages/Estadisticas.jsx
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './Estadisticas.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

/* ── Hook: contador animado ── */
function useCounter(target, active, duration = 1100) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active || target === 0) { setValue(target); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, duration]);

  return value;
}

/* ── Componente KPI con contador ── */
function KpiCard({ className, icon, num, label, active, delay = 0 }) {
  const count = useCounter(num, active, 1100 + delay);
  return (
    <div className={`kpi-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-num">{count}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

function Estadisticas() {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [listo, setListo]             = useState(false); // dispara animaciones

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

  // Pequeño delay para que las animaciones de entrada terminen
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setListo(true), 200);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const total     = incidencias.length;
  const pendientes = incidencias.filter(i => i.estado === 'pendiente').length;
  const enProceso  = incidencias.filter(i => i.estado === 'en proceso').length;
  const resueltas  = incidencias.filter(i => i.estado === 'resuelto').length;
  const anonimas   = incidencias.filter(i => i.anonima).length;
  const alta  = incidencias.filter(i => i.prioridad === 'alta').length;
  const media = incidencias.filter(i => i.prioridad === 'media').length;
  const baja  = incidencias.filter(i => i.prioridad === 'baja').length;
  const pct = n => total > 0 ? Math.round((n / total) * 100) : 0;

  const catCount = {};
  incidencias.forEach(i => { catCount[i.categoria] = (catCount[i.categoria] || 0) + 1; });
  const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCat  = topCats[0]?.[1] || 1;

  const recientes = [...incidencias]
    .filter(i => i.fecha)
    .sort((a, b) => b.fecha?.toDate() - a.fecha?.toDate())
    .slice(0, 5);

  const donutData = {
    labels: ['Pendiente', 'En proceso', 'Resuelto'],
    datasets: [{
      data: [pendientes, enProceso, resueltas],
      backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e'],
      borderWidth: 0,
      hoverOffset: 6,
    }]
  };

  const barPrioridadData = {
    labels: ['Alta', 'Media', 'Baja'],
    datasets: [{
      data: [alta, media, baja],
      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
      borderRadius: 8,
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

      {/* KPI CARDS con contador */}
      <div className="stats-kpi">
        <KpiCard className="total"    icon="📋" num={total}     label="Total reportadas"           active={listo} delay={0}   />
        <KpiCard className="pendiente" icon="⏳" num={pendientes} label={`Pendientes (${pct(pendientes)}%)`} active={listo} delay={80}  />
        <KpiCard className="proceso"  icon="🔄" num={enProceso} label={`En proceso (${pct(enProceso)}%)`}   active={listo} delay={160} />
        <KpiCard className="resuelto" icon="✅" num={resueltas} label={`Resueltas (${pct(resueltas)}%)`}    active={listo} delay={240} />
        <KpiCard className="anonima"  icon="👤" num={anonimas}  label={`Anónimas (${pct(anonimas)}%)`}      active={listo} delay={320} />
      </div>

      {/* CHARTS */}
      <div className="stats-charts">

        {/* Dona */}
        <div className="chart-card">
          <h3>Distribución por estado</h3>
          <div className="chart-legend">
            <span><span className="dot" style={{background:'#f59e0b'}}></span>Pendiente {pendientes}</span>
            <span><span className="dot" style={{background:'#3b82f6'}}></span>En proceso {enProceso}</span>
            <span><span className="dot" style={{background:'#22c55e'}}></span>Resuelto {resueltas}</span>
          </div>
          <div className="chart-wrap-sm">
            <Doughnut data={donutData} options={{
              cutout: '68%',
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              animation: { duration: 1000, easing: 'easeOutQuart' },
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
              maintainAspectRatio: false,
              animation: { duration: 900, easing: 'easeOutQuart' },
            }} />
          </div>
        </div>

        {/* Categorías con barras animadas */}
        <div className="chart-card chart-full">
          <h3>Incidencias por categoría</h3>
          <div className="cat-bars">
            {topCats.map(([cat, count], i) => (
              <div className="cat-row" key={cat} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="cat-label" title={cat}>{cat}</div>
                <div className="cat-bar-wrap">
                  <div
                    className="cat-bar"
                    style={{ width: listo ? `${Math.round((count / maxCat) * 100)}%` : '0%' }}
                  >
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
              {recientes.map((item, i) => (
                <div
                  className="reciente-row"
                  key={item.id}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
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
