import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../supabaseClient';

const Diagnostico = () => {
  const [data, setData] = useState([]);
  const [analisis, setAnalisis] = useState({ fuerte: '---', debil: '---' });
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
        // Ordenamos para que la barra más alta (fortaleza) salga primero
        const sorted = [...res].sort((a, b) => b.puntos_actual - a.puntos_actual);
        setData(sorted);
        setAnalisis({
          fuerte: sorted[0]?.materia || '---',
          debil: sorted[sorted.length - 1]?.materia || '---'
        });
      }
    } catch (err) {
      console.error("Error en diagnóstico:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>

      <div style={styles.content}>
        {/* TÍTULO CENTRADO CON EFECTO GALAXY */}
        <header style={styles.header}>
          <h1 style={styles.mainTitle}>DIAGNÓSTICO GALAXY BRAIN</h1>
          <div style={styles.underLine}></div>
        </header>

        {loading ? (
          <p style={styles.loader}>ESCANEANDO SECTORES ACADÉMICOS...</p>
        ) : (
          <div style={styles.dashboardGrid}>
            
            {/* TARJETA IZQUIERDA: ESCUDOS (BARRAS) */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardHeader}>ESCUDOS ACADÉMICOS (EQUILIBRIO)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="materia" 
                    stroke="#00f2ff" 
                    tick={{fill: '#00f2ff', fontSize: 12, fontWeight: 'bold'}} 
                    axisLine={false}
                  />
                  <YAxis hide domain={[0, 'dataMax + 2']} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={styles.tooltipStyle} />
                  <Bar dataKey="puntos_actual" radius={[10, 10, 0, 0]} barSize={50}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.puntos_actual < 2 ? 'url(#colorRed)' : 'url(#colorPurple)'} 
                      />
                    ))}
                  </Bar>
                  {/* Definición de degradados para las barras */}
                  <defs>
                    <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff00ea" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#6600cc" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4b2b" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#870000" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* TARJETA DERECHA: PLAN DE FORTALECIMIENTO */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardHeader}>PLAN DE FORTALECIMIENTO</h3>
              
              <div style={styles.strategyBoxCritico}>
                <div style={styles.iconHeader}>
                  <span style={{fontSize: '24px'}}>⚠️</span>
                  <span style={styles.criticoTitle}>SECTOR CRÍTICO:</span>
                </div>
                <h2 style={styles.subjectHighlight}>{analisis.debil.toUpperCase()}</h2>
                <p style={styles.strategyText}>
                  Se recomienda activar Misión de Refuerzo y Cofre Épico para subir energía aquí.
                </p>
              </div>

              <div style={styles.strategyBoxImpulso}>
                <div style={styles.iconHeader}>
                  <span style={{fontSize: '24px'}}>🚀</span>
                  <span style={styles.impulsoTitle}>MÁXIMO IMPULSO:</span>
                </div>
                <h2 style={styles.subjectHighlight}>{analisis.fuerte.toUpperCase()}</h2>
                <p style={styles.strategyText}>
                  Autonomía total detectada. El Comandante domina este sector con éxito.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// --- ESTILOS "MCKINSEY SPACE" ---
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020204', color: 'white', position: 'relative', overflow: 'hidden' },
  stars: { position: 'absolute', width: '100%', height: '100%', background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, opacity: 0.3, zIndex: 1 },
  nebula: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05), rgba(255, 0, 234, 0.03), transparent)', filter: 'blur(100px)', zIndex: 2 },
  content: { position: 'relative', zIndex: 10, padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '60px' },
  mainTitle: { fontSize: '48px', fontWeight: '900', color: '#00f2ff', textShadow: '0 0 30px rgba(0,242,255,0.8)', letterSpacing: '8px', margin: 0 },
  underLine: { width: '200px', height: '4px', background: 'linear-gradient(90deg, transparent, #ff00ea, transparent)', margin: '15px auto' },
  dashboardGrid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 242, 255, 0.15)', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' },
  cardHeader: { color: '#888', fontSize: '14px', letterSpacing: '5px', marginBottom: '30px', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  strategyBoxCritico: { background: 'rgba(255, 75, 43, 0.05)', padding: '30px', borderRadius: '25px', borderLeft: '6px solid #ff4b2b', marginBottom: '30px' },
  strategyBoxImpulso: { background: 'rgba(0, 242, 255, 0.05)', padding: '30px', borderRadius: '25px', borderLeft: '6px solid #00f2ff' },
  iconHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  criticoTitle: { color: '#ff4b2b', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' },
  impulsoTitle: { color: '#00f2ff', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' },
  subjectHighlight: { fontSize: '32px', fontWeight: '900', margin: '5px 0', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  strategyText: { color: '#aaa', fontSize: '16px', lineHeight: '1.6', margin: 0 },
  tooltipStyle: { backgroundColor: '#111', border: '1px solid #00f2ff', borderRadius: '10px', color: '#fff' },
  loader: { textAlign: 'center', marginTop: '150px', fontSize: '22px', letterSpacing: '10px', color: '#00f2ff', fontWeight: 'bold' }
};

export default Diagnostico;