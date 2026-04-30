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

  // --- CONFIGURACIÓN DE METAS (Basado en tu tabla de energía) ---
  const METAS = {
    'INGLÉS': 8,
    'MATEMÁTICAS': 6,
    'C. NATURALES': 4,
    'C. SOCIALES': 4,
    'LENGUAJE': 4,
    'TECNOLOGÍA': 2,
    'PRO.TEXTUAL': 2,
    'PLAN L': 2,
    'SAB. MATE': 2,
    'SAB. NATU': 2,
    'SAB. LENG': 2,
    'SAB. SOCI': 2,
    'SAB. ING': 2,
    'ETIC / RELI': 2,
    'INT. EMO': 2
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
        // 1. Cálculos para la barra de Comparativa Superior
        const totalActual = res.reduce((acc, curr) => acc + (curr.puntos_actual || 0), 0);
        const totalPasada = res.reduce((acc, curr) => acc + (curr.puntos_pasada || 0), 0);
        const dif = totalActual - totalPasada;
        const porc = totalPasada > 0 ? Math.round((dif / totalPasada) * 100) : 100;

        setSemanal({ actual: totalActual, pasada: totalPasada, crecimiento: porc });

        // 2. PROCESO DE ENERGÍA: Validamos puntos actuales contra la tabla de METAS
        const procesados = res.map(m => {
          const nombreLimpio = m.materia.toUpperCase().trim();
          const metaMateria = METAS[nombreLimpio] || 2; // Si no está en la tabla, se asume 2
          const porcentajeEnergia = Math.min(Math.round((m.puntos_actual / metaMateria) * 100), 100);
          
          return { 
            ...m, 
            meta: metaMateria, 
            energia: porcentajeEnergia 
          };
        });

        // 3. DETECCIÓN CRÍTICA REAL (Basada en Promedio Histórico)
        const criticaHistorica = [...res].sort((a, b) => a.promedio_historico - b.promedio_historico)[0];
        const fuerteHistorica = [...res].sort((a, b) => b.promedio_historico - a.promedio_historico)[0];

        // Ordenamos las celdas por energía (las más bajas primero para diagnóstico rápido)
        setData(procesados.sort((a, b) => a.energia - b.energia));
        
        setAnalisis({
          fuerte: fuerteHistorica?.materia || '---',
          debil: criticaHistorica?.materia || '---',
          totalPoints: totalActual
        });
      }
    } catch (err) {
      console.error("Error en diagnóstico estratégico:", err);
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
          <div style={styles.scanline}></div>
          <h1 style={styles.mainTitle}>GALAXY BRAIN: CENTRO DE MANDO</h1>
          <p style={styles.subtitle}>DIAGNÓSTICO ESTRATÉGICO BASADO EN PROMEDIO HISTÓRICO</p>
        </header>

        {loading ? (
          <p style={styles.loader}>SINCRONIZANDO HISTORIAL ESTELAR...</p>
        ) : (
          <div style={styles.dashboard}>
            
            {/* COMPARATIVA SEMANAL */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardHeader}>EVOLUCIÓN INTER-SEMANAL (TOTAL PUNTOS)</h3>
              <div style={styles.progresoRow}>
                <span style={styles.progresoLabel}>Semana Pasada</span>
                <div style={styles.barraFondo}><div style={{...styles.barraRelleno, width: `${Math.min(semanal.pasada, 100)}%`, background: '#444'}} /></div>
                <span style={styles.valP}>{semanal.pasada} pts</span>
              </div>
              <div style={styles.progresoRow}>
                <span style={styles.progresoLabel}>Semana Actual</span>
                <div style={styles.barraFondo}><div style={{...styles.barraRelleno, width: `${Math.min(semanal.actual, 100)}%`, background: 'linear-gradient(90deg, #ff00ea, #00f2ff)'}} /></div>
                <span style={styles.valA}>{semanal.actual} pts</span>
              </div>
              <p style={styles.crecimientoMsg}>
                {semanal.crecimiento >= 0 ? '🚀 PROGRESO:' : '⚠️ ALERTA:'} Variación del {Math.abs(semanal.crecimiento)}% respecto al historial previo.
              </p>
            </div>

            <div style={styles.mainGrid}>
              {/* SECTORES CRÍTICOS */}
              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>DETECCIÓN DE SECTORES CRÍTICOS</h3>
                <div style={styles.alertBox}>
                  <span style={styles.criticoLabel}>❌ FALLA CONSTANTE DETECTADA:</span>
                  <h2 style={styles.subjectText}>{analisis.debil.toUpperCase()}</h2>
                  <p style={styles.adviceText}>Basado en el historial de todas las semanas, esta materia es la que presenta menor puntuación promedio.</p>
                </div>
                <div style={styles.successBox}>
                  <span style={styles.fuerteLabel}>✅ MÁXIMO IMPULSO:</span>
                  <h2 style={styles.subjectText}>{analisis.fuerte.toUpperCase()}</h2>
                </div>
              </div>

              {/* NÚCLEO DE ENERGÍA */}
              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>ENERGÍA SEMANAL GLOBAL</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[{v:analisis.totalPoints},{v:Math.max(0,100-analisis.totalPoints)}]} innerRadius={60} outerRadius={80} dataKey="v" stroke="none">
                      <Cell fill="#ff00ea" /><Cell fill="rgba(255,255,255,0.05)" />
                      <Label value={`${analisis.totalPoints}%`} position="center" fill="#ff00ea" style={{fontSize:'24px', fontWeight:'bold'}}/>
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CELDAS DE ENERGÍA CON LÓGICA DE TABLA */}
            <h3 style={styles.gridTitle}>ESTADO DE CELDAS ACADÉMICAS (SISTEMA DE CARGA)</h3>
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
                  <div style={{fontSize: '9px', marginTop: '6px', color: '#666', textAlign: 'right'}}>
                    META: {m.meta} PTS | ACTUAL: {m.puntos_actual}
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
  mainTitle: { fontSize: '38px', fontWeight: '900', color: '#00f2ff', letterSpacing: '5px', textShadow: '0 0 20px rgba(0, 242, 255, 0.5)' },
  subtitle: { fontSize: '11px', color: '#45a29e', letterSpacing: '4px', marginTop: '10px' },
  scanline: { width: '100%', height: '2px', background: 'rgba(0, 242, 255, 0.2)', position: 'absolute', bottom: '-15px', left: 0 },
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
  alertBox: { padding: '20px', background: 'rgba(255, 75, 43, 0.05)', borderLeft: '5px solid #ff4b2b', borderRadius: '15px', marginBottom: '15px' },
  successBox: { padding: '20px', background: 'rgba(0, 242, 255, 0.05)', borderLeft: '5px solid #00f2ff', borderRadius: '15px' },
  criticoLabel: { color: '#ff4b2b', fontSize: '11px', fontWeight: 'bold' },
  fuerteLabel: { color: '#00f2ff', fontSize: '11px', fontWeight: 'bold' },
  subjectText: { fontSize: '28px', color: 'white', fontWeight: 'bold', margin: '5px 0' },
  adviceText: { fontSize: '12px', color: '#888', lineHeight: '1.4' },
  gridTitle: { fontSize: '14px', letterSpacing: '3px', color: '#45a29e', marginBottom: '20px', textAlign: 'center' },
  energyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' },
  energyCell: { background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid #1f2833' },
  cellHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px', fontWeight: 'bold' },
  miniTrack: { height: '6px', background: '#000', borderRadius: '10px', overflow: 'hidden' },
  miniFill: { height: '100%', transition: 'width 1.5s ease' },
  loader: { textAlign: 'center', marginTop: '150px', fontSize: '20px', letterSpacing: '8px', color: '#00f2ff' }
};

export default Diagnostico;