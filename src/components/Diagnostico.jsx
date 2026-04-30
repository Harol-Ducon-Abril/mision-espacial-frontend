import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Label 
} from 'recharts';

const Diagnostico = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({ totalActual: 0, totalPasada: 0 });

  // --- CONFIGURACIÓN DE METAS (Lo que "debería" tener) ---
  const METAS = {
    'INGLES': 8,
    'MATEMATICAS': 6,
    'CIENCIAS NATURALES': 4,
    'CIENCIAS SOCIALES': 4,
    'LENGUAJE': 4,
    'TECNOLOGIA': 2,
    // Las demás materias por defecto pedirán 2 puntos si no están aquí
  };

  useEffect(() => {
    fetchDiagnostico();
  }, []);

  const fetchDiagnostico = async () => {
    setLoading(true);
    try {
      const { data: res } = await supabase.from('diagnostico_estratégico').select('*');
      if (res) {
        const totalA = res.reduce((acc, curr) => acc + curr.puntos_actual, 0);
        const totalP = res.reduce((acc, curr) => acc + curr.puntos_pasada, 0);
        setMetricas({ totalActual: totalA, totalPasada: totalP });

        // Procesamos los datos para añadir el cálculo de "Energía"
        const procesados = res.map(m => {
          const metaMateria = METAS[m.materia.toUpperCase()] || 2;
          const porcentaje = Math.min(Math.round((m.puntos_actual / metaMateria) * 100), 100);
          return { ...m, meta: metaMateria, energia: porcentaje };
        });
        setData(procesados.sort((a, b) => b.energia - a.energia));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>

      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.mainTitle}>SISTEMA DE ENERGÍA GALAXY BRAIN</h1>
          <p style={styles.subtitle}>MONITOREO DE CELDAS ACADÉMICAS</p>
        </header>

        {loading ? (
          <p style={styles.loader}>SINCRONIZANDO NÚCLEOS...</p>
        ) : (
          <div style={styles.dashboard}>
            
            {/* 1. COMPARATIVA DE ALTO NIVEL */}
            <div style={styles.topSection}>
              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>EVOLUCIÓN SEMANAL</h3>
                <div style={styles.progressContainer}>
                  <div style={styles.progressLabel}>PASADA: {metricas.totalPasada} pts</div>
                  <div style={styles.barBack}><div style={{...styles.barFill, width: '60%', background: '#444'}} /></div>
                  <div style={styles.progressLabel}>ACTUAL: {metricas.totalActual} pts</div>
                  <div style={styles.barBack}><div style={{...styles.barFill, width: '85%', background: 'linear-gradient(90deg, #ff00ea, #00f2ff)'}} /></div>
                </div>
              </div>
            </div>

            {/* 2. CELDAS DE ENERGÍA POR MATERIA */}
            <div style={styles.gridSectores}>
              {data.map((m, i) => (
                <div key={i} style={styles.materiaCard}>
                  <div style={styles.materiaInfo}>
                    <span style={styles.materiaName}>{m.materia.toUpperCase()}</span>
                    <span style={styles.materiaPoints}>{m.puntos_actual} / {m.meta} PTS</span>
                  </div>
                  {/* Barra de Energía Individual */}
                  <div style={styles.energyTrack}>
                    <div style={{
                      ...styles.energyFill, 
                      width: `${m.energia}%`,
                      backgroundColor: m.energia < 50 ? '#ff4b2b' : '#00f2ff',
                      boxShadow: m.energia < 50 ? '0 0 10px #ff4b2b' : '0 0 10px #00f2ff'
                    }} />
                  </div>
                  <span style={{...styles.percentText, color: m.energia < 50 ? '#ff4b2b' : '#00f2ff'}}>
                    CAPACIDAD: {m.energia}%
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020204', color: 'white', position: 'relative', overflow: 'hidden' },
  stars: { position: 'absolute', width: '100%', height: '100%', background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, opacity: 0.2, zIndex: 1 },
  nebula: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05), transparent)', zIndex: 2 },
  content: { position: 'relative', zIndex: 10, padding: '40px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  mainTitle: { fontSize: '32px', fontWeight: '900', color: '#00f2ff', letterSpacing: '5px', textShadow: '0 0 15px #00f2ff' },
  subtitle: { color: '#ff00ea', letterSpacing: '3px', fontSize: '12px', fontWeight: 'bold' },
  dashboard: { maxWidth: '1100px', margin: '0 auto' },
  topSection: { marginBottom: '30px' },
  glassCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0, 242, 255, 0.2)', padding: '25px', borderRadius: '20px' },
  cardHeader: { fontSize: '12px', color: '#888', letterSpacing: '3px', marginBottom: '15px' },
  progressContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  progressLabel: { fontSize: '11px', color: '#ccc' },
  barBack: { height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease' },
  gridSectores: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  materiaCard: { background: 'rgba(11, 12, 16, 0.8)', padding: '20px', borderRadius: '15px', border: '1px solid #1f2833' },
  materiaInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' },
  materiaName: { fontSize: '12px', fontWeight: 'bold', color: '#45a29e' },
  materiaPoints: { fontSize: '10px', color: '#888' },
  energyTrack: { height: '15px', background: '#000', borderRadius: '4px', overflow: 'hidden', border: '1px solid #333' },
  energyFill: { height: '100%', transition: 'width 1.5s ease-in-out' },
  percentText: { fontSize: '10px', fontWeight: 'bold', display: 'block', marginTop: '8px', textAlign: 'right' },
  loader: { textAlign: 'center', color: '#00f2ff', letterSpacing: '5px', marginTop: '100px' }
};

export default Diagnostico;