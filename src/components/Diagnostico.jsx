import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Diagnostico = () => {
  const [data, setData] = useState([]);
  const [analisis, setAnalisis] = useState({ fuerte: '', debil: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiagnostico();
  }, []);

  const fetchDiagnostico = async () => {
    const { data: res } = await supabase.from('diagnostico_estratégico').select('*');
    if (res) {
      setData(res);
      // Lógica para detectar la mejor y peor materia
      const sorted = [...res].sort((a, b) => b.puntos_actual - a.puntos_actual);
      setAnalisis({
        fuerte: sorted[0]?.materia || '---',
        debil: sorted[sorted.length - 1]?.materia || '---'
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>◀ VOLVER</button>
        <h1 style={styles.title}>DIAGNÓSTICO GALAXY BRAIN</h1>
      </div>

      <div style={styles.grid}>
        {/* TARJETA 1: RADAR DE EQUILIBRIO */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>ESCUDOS ACADÉMICOS (EQUILIBRIO)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="materia" tick={{fill: '#00f2ff', fontSize: 10}} />
              <Radar name="Puntos" dataKey="puntos_actual" stroke="#ff00ea" fill="#ff00ea" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* TARJETA 2: PLAN DE ACCIÓN */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>PLAN DE FORTALECIMIENTO</h3>
          <div style={styles.actionItem}>
            <span style={{color: '#ff4b2b', fontWeight: 'bold'}}>⚠️ SECTOR CRÍTICO:</span>
            <p style={{fontSize: '22px', margin: '5px 0'}}>{analisis.debil.toUpperCase()}</p>
            <p style={{color: '#ccc', fontSize: '14px'}}>Se recomienda activar Misión de Refuerzo y Cofre Épico para subir energía aquí.</p>
          </div>
          <div style={styles.actionItem}>
            <span style={{color: '#00f2ff', fontWeight: 'bold'}}>🚀 MÁXIMO IMPULSO:</span>
            <p style={{fontSize: '22px', margin: '5px 0'}}>{analisis.fuerte.toUpperCase()}</p>
            <p style={{color: '#ccc', fontSize: '14px'}}>Autonomía total detectada. El Comandante domina este sector.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020204', color: 'white', padding: '40px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' },
  backBtn: { background: 'none', border: '1px solid #00f2ff', color: '#00f2ff', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' },
  title: { color: '#00f2ff', textShadow: '0 0 15px #00f2ff', fontSize: '28px', letterSpacing: '2px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' },
  card: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 242, 255, 0.2)', padding: '30px', borderRadius: '25px' },
  cardTitle: { textAlign: 'center', color: '#888', letterSpacing: '3px', fontSize: '14px', marginBottom: '20px' },
  actionItem: { marginBottom: '30px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px' }
};

export default Diagnostico;