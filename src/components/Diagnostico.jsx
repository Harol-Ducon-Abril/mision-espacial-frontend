import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Label 
} from 'recharts';
import { supabase } from '../supabaseClient';

const Diagnostico = () => {
  const [data, setData] = useState([]);
  const [semanal, setSemanal] = useState({ actual: 0, pasada: 0, crecimiento: 0 });
  const [analisis, setAnalisis] = useState({ fuerte: '---', debil: '---', totalPoints: 0 });
  const [loading, setLoading] = useState(true);

  // --- CONFIGURACIÓN DE METAS REALES POR MATERIA ---
  const METAS = {
    'INGLÉS': 8, 'MATEMÁTICAS': 6, 'C. NATURALES': 4, 'C. SOCIALES': 4,
    'LENGUAJE': 4, 'TECNOLOGÍA': 2, 'PRO.TEXTUAL': 2, 'PLAN L': 2,
    'SAB. MATE': 2, 'SAB. NATU': 2, 'SAB. LENG': 2, 'SAB. SOCI': 2, 'SAB. ING': 2,
    'ETIC / RELI': 2, 'INT. EMO': 2
  };

  useEffect(() => {
    fetchDiagnostico();
  }, []);

  const fetchDiagnostico = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.from('diagnostico_estratégico').select('*');
      if (error) throw error;

      if (res && res.length > 0) {
        const totalActual = res.reduce((acc, curr) => acc + curr.puntos_actual, 0);
        const totalPasada = res.reduce((acc, curr) => acc + curr.puntos_pasada, 0);
        const dif = totalActual - totalPasada;
        const porc = totalPasada > 0 ? Math.round((dif / totalPasada) * 100) : 100;

        setSemanal({ actual: totalActual, pasada: totalPasada, crecimiento: porc });

        // Procesamos energía basándonos en las metas
        const procesados = res.map(m => {
          const meta = METAS[m.materia.toUpperCase()] || 2;
          const energia = Math.min(Math.round((m.puntos_actual / meta) * 100), 100);
          return { ...m, meta, energia };
        });

        const sorted = [...procesados].sort((a, b) => a.energia - b.energia); // Las más bajas primero
        setData(sorted);
        setAnalisis({
          fuerte: [...procesados].sort((a,b) => b.energia - a.energia)[0]?.materia || '---',
          debil: sorted[0]?.materia || '---',
          totalPoints: totalActual
        });
      }
    } catch (err) {
      console.error("Error:", err);
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
          <h1 style={styles.mainTitle}>GALAXY BRAIN: DIAGNÓSTICO ESTRATÉGICO</h1>
          <p style={styles.subtitle}>MONITOREO DE EVOLUCIÓN Y RENDIMIENTO SEMANAL</p>
        </header>

        {loading ? (
          <p style={styles.loader}>CALIBRANDO SENSORES...</p>
        ) : (
          <div style={styles.dashboard}>
            
            {/* 1. COMPARATIVA SEMANAL: ¿Vamos mejor o peor? */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardHeader}>ANÁLISIS DE EVOLUCIÓN INTER-SEMANAL</h3>
              <div style={styles.progresoRow}>
                <span style={styles.progresoLabel}>Semana Pasada</span>
                <div style={styles.barraFondo}><div style={{...styles.barraRelleno, width: `${Math.min(semanal.pasada, 100)}%`, background: '#444'}} /></div>
                <span style={styles.valP}> {semanal.pasada} pts</span>
              </div>
              <div style={styles.progresoRow}>
                <span style={styles.progresoLabel}>Semana Actual</span>
                <div style={styles.barraFondo}><div style={{...styles.barraRelleno, width: `${Math.min(semanal.actual, 100)}%`, background: 'linear-gradient(90deg, #ff00ea, #00f2ff)'}} /></div>
                <span style={styles.valA}> {semanal.actual} pts</span>
              </div>
              <p style={styles.crecimientoMsg}>
                {semanal.crecimiento >= 0 ? '🚀 PROGRESO POSITIVO:' : '⚠️ CAÍDA DE RENDIMIENTO:'} El Comandante presenta un {Math.abs(semanal.crecimiento)}% de cambio.
              </p>
            </div>

            <div style={styles.mainGrid}>
              {/* 2. ALERTAS DE MATERIAS CRÍTICAS */}
              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>SECTORES QUE REQUIEREN REFUERZO</h3>
                <div style={styles.statusBox}>
                  <div style={styles.alertItem}>
                    <span style={styles.criticoLabel}>❌ MATERIA CRÍTICA:</span>
                    <h2 style={styles.subjectText}>{analisis.debil.toUpperCase()}</h2>
                    <p style={styles.advice}>Esta materia está por debajo del umbral de energía. Se recomienda tutoría inmediata.</p>
                  </div>
                  <div style={styles.successItem}>
                    <span style={styles.impulsoLabel}>✅ MÁXIMO IMPULSO:</span>
                    <h2 style={styles.subjectText}>{analisis.fuerte.toUpperCase()}</h2>
                    <p style={styles.advice}>Dominio total del sector. Autonomía garantizada.</p>
                  </div>
                </div>
              </div>

              {/* 3. NÚCLEO DE CUMPLIMIENTO */}
              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>NÚCLEO DE ENERGÍA GLOBAL</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[{v:analisis.totalPoints},{v:100-analisis.totalPoints}]} innerRadius={60} outerRadius={80} dataKey="v" stroke="none">
                      <Cell fill="#ff00ea" /><Cell fill="rgba(255,255,255,0.05)" />
                      <Label value={`${analisis.totalPoints}%`} position="center" fill="#ff00ea" style={{fontSize:'24px', fontWeight:'bold'}}/>
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. CELDAS DE ENERGÍA PEQUEÑAS (EL DETALLE) */}
            <h3 style={styles.subTitleGrid}>ESTADO DE CELDAS POR MATERIA (CAPACIDAD ACTUAL)</h3>
            <div style={styles.energyGrid}>
              {data.map((m, i) => (
                <div key={i} style={styles.energyCell}>
                  <div style={styles.cellHeader}>
                    <span>{m.materia}</span>
                    <span style={{color: m.energia < 50 ? '#ff4b2b' : '#00f2ff'}}>{m.energia}%</span>
                  </div>
                  <div style={styles.miniTrack}>
                    <div style={{...styles.miniFill, width:`${m.energia}%`, background: m.energia < 50 ? '#ff4b2b' : '#00f2ff'}} />
                  </div>
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
  container: { minHeight: '100vh', backgroundColor: '#020204', color: '#c5c6c7', position: 'relative', overflow: 'hidden' },
  stars: { position: 'absolute', width: '100%', height: '100%', background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, opacity: 0.2, zIndex: 1 },
  nebula: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05), transparent)', zIndex: 2 },
  content: { position: 'relative', zIndex: 10, padding: '40px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  mainTitle: { fontSize: '32px', fontWeight: '900', color: '#00f2ff', letterSpacing: '5px', textShadow: '0 0 15px #00f2ff' },
  subtitle: { color: '#45a29e', letterSpacing: '3px', fontSize: '11px', marginTop: '10px' },
  dashboard: { maxWidth: '1200px', margin: '0 auto' },
  glassCard: { background: 'rgba(11, 12, 16, 0.8)', border: '1px solid rgba(69, 162, 158, 0.2)', padding: '25px', borderRadius: '20px', marginBottom: '20px' },
  cardHeader: { fontSize: '10px', color: '#45a29e', letterSpacing: '3px', marginBottom: '20px', borderBottom: '1px solid rgba(69,162,158,0.1)', paddingBottom: '10px' },
  progresoRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' },
  progresoLabel: { width: '110px', fontSize: '11px', color: '#888' },
  barraFondo: { flexGrow: 1, height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' },
  barraRelleno: { height: '100%', borderRadius: '10px', transition: 'width 1s ease' },
  valP: { width: '60px', color: '#666', fontSize: '12px' },
  valA: { width: '60px', color: '#00f2ff', fontSize: '12px', fontWeight: 'bold' },
  crecimientoMsg: { textAlign: 'center', fontSize: '12px', color: '#ccc', fontStyle: 'italic', marginTop: '15px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '30px' },
  statusBox: { display: 'flex', flexDirection: 'column', gap: '15px' },
  alertItem: { padding: '15px', background: 'rgba(255, 75, 43, 0.05)', borderLeft: '4px solid #ff4b2b', borderRadius: '10px' },
  successItem: { padding: '15px', background: 'rgba(0, 242, 255, 0.05)', borderLeft: '4px solid #00f2ff', borderRadius: '10px' },
  criticoLabel: { color: '#ff4b2b', fontSize: '10px', fontWeight: 'bold' },
  impulsoLabel: { color: '#00f2ff', fontSize: '10px', fontWeight: 'bold' },
  subjectText: { fontSize: '22px', color: 'white', margin: '5px 0' },
  advice: { fontSize: '12px', color: '#aaa' },
  subTitleGrid: { fontSize: '14px', letterSpacing: '3px', color: '#45a29e', marginBottom: '20px', textAlign: 'center' },
  energyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' },
  energyCell: { background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid #1f2833' },
  cellHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px', fontWeight: 'bold' },
  miniTrack: { height: '6px', background: '#000', borderRadius: '10px', overflow: 'hidden' },
  miniFill: { height: '100%', transition: 'width 1.5s ease-in-out' },
  loader: { textAlign: 'center', marginTop: '100px', color: '#00f2ff', letterSpacing: '5px' }
};

export default Diagnostico;