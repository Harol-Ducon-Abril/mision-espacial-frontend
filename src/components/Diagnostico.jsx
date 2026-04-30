import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as ReRadar } from 'recharts';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Diagnostico = () => {
  const [data, setData] = useState([]);
  const [analisis, setAnalisis] = useState({ fuerte: '---', debil: '---' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiagnostico();
  }, []);

  const fetchDiagnostico = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.from('diagnostico_estratégico').select('*');
      
      if (error) throw error;

      if (res && res.length > 0) {
        setData(res);
        const sorted = [...res].sort((a, b) => b.puntos_actual - a.puntos_actual);
        setAnalisis({
          fuerte: sorted[0]?.materia || '---',
          debil: sorted[sorted.length - 1]?.materia || '---'
        });
      }
    } catch (err) {
      console.error("Error en radar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* CAPAS DE FONDO PARA QUE SE VEA IGUAL A LAS OTRAS */}
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>

      {/* CONTENEDOR PRINCIPAL CON Z-INDEX ALTO */}
      <div style={styles.content}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>◀ VOLVER</button>
          <h1 style={styles.title}>DIAGNÓSTICO GALAXY BRAIN</h1>
        </header>

        {loading ? (
          <p style={styles.loader}>CALIBRANDO ESCUDOS...</p>
        ) : (
          <div style={styles.grid}>
            {/* TARJETA 1: RADAR */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>ESCUDOS ACADÉMICOS (EQUILIBRIO)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={data}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="materia" tick={{fill: '#00f2ff', fontSize: 10}} />
                  <ReRadar 
                    name="Puntos" 
                    dataKey="puntos_actual" 
                    stroke="#ff00ea" 
                    fill="#ff00ea" 
                    fillOpacity={0.5} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* TARJETA 2: PLAN DE ACCIÓN */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>PLAN DE FORTALECIMIENTO</h3>
              <div style={styles.actionItem}>
                <span style={{color: '#ff4b2b', fontWeight: 'bold', letterSpacing: '1px'}}>⚠️ SECTOR CRÍTICO:</span>
                <p style={styles.subjectText}>{analisis.debil.toUpperCase()}</p>
                <p style={styles.descText}>Se recomienda activar Misión de Refuerzo y Cofre Épico para subir energía aquí.</p>
              </div>

              <div style={styles.actionItem}>
                <span style={{color: '#00f2ff', fontWeight: 'bold', letterSpacing: '1px'}}>🚀 MÁXIMO IMPULSO:</span>
                <p style={styles.subjectText}>{analisis.fuerte.toUpperCase()}</p>
                <p style={styles.descText}>Autonomía total detectada. El Comandante domina este sector con éxito.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020204', color: 'white', position: 'relative', overflow: 'hidden' },
  stars: { position: 'absolute', width: '100%', height: '100%', background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, opacity: 0.4, zIndex: 1 },
  nebula: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.08), rgba(255, 0, 234, 0.05), transparent)', filter: 'blur(100px)', zIndex: 2 },
  content: { position: 'relative', zIndex: 10, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '50px' },
  backBtn: { background: 'none', border: '1px solid #00f2ff', color: '#00f2ff', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' },
  title: { fontSize: '28px', fontWeight: '900', color: '#00f2ff', textShadow: '0 0 20px rgba(0,242,255,0.6)', letterSpacing: '3px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(15px)', border: '1px solid rgba(0, 242, 255, 0.2)', padding: '30px', borderRadius: '25px' },
  cardTitle: { color: '#888', fontSize: '13px', letterSpacing: '4px', marginBottom: '25px', textAlign: 'center' },
  actionItem: { marginBottom: '25px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', borderLeft: '4px solid #ff00ea' },
  subjectText: { fontSize: '24px', margin: '10px 0', color: 'white', fontWeight: 'bold' },
  descText: { color: '#ccc', fontSize: '14px', lineHeight: '1.4' },
  loader: { textAlign: 'center', marginTop: '150px', fontSize: '20px', letterSpacing: '8px', color: '#00f2ff' }
};

export default Diagnostico;