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

  useEffect(() => {
    fetchDiagnostico();
  }, []);

  const fetchDiagnostico = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.from('diagnostico_estratégico').select('*');
      if (error) throw error;

      if (res && res.length > 0) {
        // Cálculo de totales para la comparativa semanal
        const totalActual = res.reduce((acc, curr) => acc + curr.puntos_actual, 0);
        const totalPasada = res.reduce((acc, curr) => acc + curr.puntos_pasada, 0);
        const dif = totalActual - totalPasada;
        const porc = totalPasada > 0 ? Math.round((dif / totalPasada) * 100) : 100;

        setSemanal({ actual: totalActual, pasada: totalPasada, crecimiento: porc });

        const sorted = [...res].sort((a, b) => b.puntos_actual - a.puntos_actual);
        setData(sorted);
        setAnalisis({
          fuerte: sorted[0]?.materia || '---',
          debil: sorted[sorted.length - 1]?.materia || '---',
          totalPoints: totalActual
        });
      }
    } catch (err) {
      console.error("Error en diagnóstico:", err);
    } finally {
      setLoading(false);
    }
  };

  const energyData = [
    { name: 'Completado', value: analisis.totalPoints },
    { name: 'Restante', value: Math.max(0, 100 - analisis.totalPoints) }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>

      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.scanline}></div>
          <h1 style={styles.mainTitle}>CENTRO DE MANDO PARA PADRES</h1>
          <p style={styles.subtitle}>SISTEMA DE ANÁLISIS DE RENDIMIENTO - DEEP SPACE V1.0</p>
        </header>

        {loading ? (
          <p style={styles.loader}>CARGANDO INTERFAZ TÁCTICA...</p>
        ) : (
          <div style={styles.dashboard}>
            
            {/* --- BLOQUE 1: COMPARATIVA SEMANAL (EL QUE PEDISTE) --- */}
            <div style={styles.comparativaCard}>
              <h3 style={styles.cardHeader}>EVOLUCIÓN SEMANAL DE ASTRO-PUNTOS</h3>
              <div style={styles.progresoRow}>
                <span style={styles.progresoLabel}>Semana Pasada</span>
                <div style={styles.barraFondo}><div style={{...styles.barraRelleno, width: `${Math.min(semanal.pasada, 100)}%`, background: '#444'}} /></div>
                <span style={{...styles.porcentaje, color: '#888'}}>{semanal.pasada} pts</span>
              </div>
              <div style={styles.progresoRow}>
                <span style={styles.progresoLabel}>Semana Actual</span>
                <div style={styles.barraFondo}><div style={{...styles.barraRelleno, width: `${Math.min(semanal.actual, 100)}%`, background: 'linear-gradient(90deg, #ff00ea, #00f2ff)'}} /></div>
                <span style={{...styles.porcentaje, color: '#00f2ff'}}>{semanal.actual} pts</span>
              </div>
              <p style={styles.textoCrecimiento}>
                {semanal.crecimiento >= 0 ? '🚀 CRECIMIENTO' : '📉 DESCENSO'} DEL {Math.abs(semanal.crecimiento)}% RESPECTO A LA SEMANA ANTERIOR.
              </p>
            </div>

            {/* --- BLOQUE 2: KPIs RÁPIDOS --- */}
            <div style={styles.topStats}>
              <div style={styles.miniCard}>
                <span style={styles.miniLabel}>RENDIMIENTO TOTAL</span>
                <span style={styles.miniValue}>{analisis.totalPoints} pts</span>
              </div>
              <div style={styles.miniCard}>
                <span style={styles.miniLabel}>ESTADO DE MISIÓN</span>
                <span style={{...styles.miniValue, color: '#22c55e'}}>ESTABLE</span>
              </div>
              <div style={styles.miniCard}>
                <span style={styles.miniLabel}>SECTORES ACTIVOS</span>
                <span style={styles.miniValue}>{data.length}</span>
              </div>
            </div>

            {/* --- BLOQUE 3: GRÁFICAS PRINCIPALES --- */}
            <div style={styles.mainGrid}>
              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>ANÁLISIS DE TAREAS POR SECTOR</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 242, 255, 0.1)" vertical={false} />
                    <XAxis dataKey="materia" stroke="#45a29e" tick={{fontSize: 10}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'rgba(0, 242, 255, 0.05)'}} contentStyle={styles.tooltip} />
                    <Bar dataKey="puntos_actual" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={index} fill={entry.puntos_actual < 2 ? '#ff4b2b' : '#00f2ff'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.glassCard}>
                <h3 style={styles.cardHeader}>NÚCLEO DE ENERGÍA TOTAL</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={energyData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#ff00ea" />
                      <Cell fill="rgba(255, 255, 255, 0.05)" />
                      <Label 
                        value={`${analisis.totalPoints}%`} 
                        position="center" 
                        fill="#ff00ea" 
                        style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Orbitron' }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={styles.statusBox}>
                  <div style={styles.statusItem}>
                    <span style={styles.criticoText}>⚠️ SECTOR DÉBIL: {analisis.debil.toUpperCase()}</span>
                  </div>
                  <div style={styles.statusItem}>
                    <span style={styles.impulsoText}>🚀 FORTALEZA: {analisis.fuerte.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            <footer style={styles.footerInfo}>
                SISTEMA DE DIAGNÓSTICO GALAXY BRAIN // DATOS EN TIEMPO REAL
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020204', color: '#c5c6c7', position: 'relative', overflow: 'hidden' },
  stars: { position: 'absolute', width: '100%', height: '100%', background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, opacity: 0.2, zIndex: 1 },
  nebula: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 20% 30%, rgba(0, 242, 255, 0.07), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 0, 234, 0.04), transparent 50%)', zIndex: 2 },
  content: { position: 'relative', zIndex: 10, padding: '40px' },
  header: { textAlign: 'center', marginBottom: '40px', position: 'relative' },
  mainTitle: { fontSize: '42px', fontWeight: '900', color: '#00f2ff', textShadow: '0 0 20px rgba(0, 242, 255, 0.5)', letterSpacing: '6px', margin: 0 },
  subtitle: { fontSize: '11px', color: '#45a29e', letterSpacing: '4px', marginTop: '10px' },
  scanline: { width: '100%', height: '2px', background: 'rgba(0, 242, 255, 0.2)', position: 'absolute', bottom: '-10px' },
  dashboard: { maxWidth: '1200px', margin: '0 auto' },
  comparativaCard: { background: 'rgba(11, 12, 16, 0.8)', border: '1px solid rgba(0, 242, 255, 0.3)', padding: '25px', borderRadius: '20px', marginBottom: '30px' },
  progresoRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' },
  progresoLabel: { width: '120px', fontSize: '12px', color: '#45a29e', textAlign: 'right' },
  barraFondo: { flexGrow: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' },
  barraRelleno: { height: '100%', borderRadius: '10px', transition: 'width 1s ease' },
  porcentaje: { width: '80px', fontWeight: 'bold', fontSize: '14px' },
  textoCrecimiento: { textAlign: 'center', fontStyle: 'italic', color: '#888', marginTop: '10px', fontSize: '12px', letterSpacing: '1px' },
  topStats: { display: 'flex', gap: '20px', marginBottom: '30px' },
  miniCard: { flex: 1, background: 'rgba(11, 12, 16, 0.8)', border: '1px solid #1f2833', padding: '15px', borderRadius: '10px' },
  miniLabel: { fontSize: '9px', color: '#45a29e', letterSpacing: '2px' },
  miniValue: { fontSize: '22px', fontWeight: 'bold', color: '#fff', marginTop: '5px', display: 'block' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' },
  glassCard: { background: 'rgba(11, 12, 16, 0.6)', border: '1px solid rgba(69, 162, 158, 0.3)', padding: '25px', borderRadius: '20px', backdropFilter: 'blur(10px)' },
  cardHeader: { fontSize: '11px', color: '#45a29e', letterSpacing: '3px', marginBottom: '25px', borderBottom: '1px solid rgba(69, 162, 158, 0.2)', paddingBottom: '10px' },
  statusBox: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' },
  statusItem: { padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(69, 162, 158, 0.1)' },
  criticoText: { color: '#ff4b2b', fontSize: '12px', fontWeight: 'bold' },
  impulsoText: { color: '#00f2ff', fontSize: '12px', fontWeight: 'bold' },
  tooltip: { backgroundColor: '#0b0c10', border: '1px solid #45a29e', color: '#fff', fontSize: '12px' },
  footerInfo: { textAlign: 'center', marginTop: '40px', fontSize: '9px', color: '#1f2833', letterSpacing: '2px' },
  loader: { textAlign: 'center', marginTop: '100px', color: '#00f2ff', letterSpacing: '5px' }
};

export default Diagnostico;