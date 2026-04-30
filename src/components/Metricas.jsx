import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, Legend 
} from 'recharts';
import { supabase } from '../supabaseClient';

const Metricas = () => {
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosMaterias, setDatosMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetricas();
  }, []);

  const fetchMetricas = async () => {
    setLoading(true);
    try {
      // 1. Llamamos a la VISTA que une daily_scores con subjects automáticamente
      const { data, error } = await supabase
        .from('metricas_estelares')
        .select('*')
        .order('fecha', { ascending: true });

      if (error) throw error;

      // 2. Calculamos el inicio de la semana actual (Lunes a las 00:00)
      const hoy = new Date();
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));
      lunes.setHours(0, 0, 0, 0);

      // 3. Filtramos solo los datos que pertenecen a esta semana
      const datosFiltrados = data.filter(reg => new Date(reg.fecha) >= lunes);

      // --- PROCESAMIENTO PARA GRÁFICA DE LÍNEAS (Días de la semana) ---
      const diasEtiq = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      const diasProgreso = diasEtiq.map(d => ({ name: d, puntos: 0 }));

      datosFiltrados.forEach(reg => {
        const fechaReg = new Date(reg.fecha);
        const dIndex = (fechaReg.getDay() + 6) % 7; // Ajuste para que 0 sea Lunes
        if(diasProgreso[dIndex]) {
          diasProgreso[dIndex].puntos += reg.puntos;
        }
      });
      setDatosSemana(diasProgreso);

      // --- PROCESAMIENTO PARA GRÁFICA DE BARRAS (Por Materia) ---
      const matMap = {};
      datosFiltrados.forEach(reg => {
        matMap[reg.materia] = (matMap[reg.materia] || 0) + reg.puntos;
      });
      
      const chartMaterias = Object.keys(matMap).map(m => ({
        materia: m,
        puntos: matMap[m]
      }));
      setDatosMaterias(chartMaterias);

    } catch (err) {
      console.error("Error cargando el radar de misión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>
      
      <div style={styles.content}>
        <h1 style={styles.mainTitle}>📊 INFORME DE MISIÓN SEMANAL</h1>

        {loading ? (
          <div style={styles.loaderContainer}>
            <p style={styles.loader}>SINCRONIZANDO CON EL SATÉLITE...</p>
          </div>
        ) : (
          <div style={styles.dashboard}>
            
            {/* PANEL DE PROGRESO DIARIO */}
            <div style={styles.glassCardLine}>
              <h3 style={styles.cardTitle}>RENDIMIENTO ENERGÉTICO (PUNTOS)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosSemana}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#00f2ff" />
                  <YAxis stroke="#00f2ff" />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Line 
                    type="monotone" 
                    dataKey="puntos" 
                    stroke="#00f2ff" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#00f2ff', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8, fill: '#ff00ea' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PANEL DE MATERIAS */}
            <div style={styles.glassCardBar}>
              <h3 style={styles.cardTitle}>DOMINIO POR SECTOR (MATERIAS)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosMaterias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="materia" stroke="#ff00ea" />
                  <YAxis stroke="#ff00ea" />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Bar dataKey="puntos" radius={[10, 10, 0, 0]}>
                    {datosMaterias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff00ea' : '#00f2ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// --- ESTILOS ESPACIALES ---
const styles = {
  container: { 
    minHeight: '100vh', 
    backgroundColor: '#020204', 
    color: 'white', 
    position: 'relative', 
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  stars: { 
    position: 'absolute', width: '100%', height: '100%', 
    background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, 
    opacity: 0.3, zIndex: 1 
  },
  nebula: { 
    position: 'absolute', width: '100%', height: '100%', 
    background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05), rgba(255, 0, 234, 0.03), transparent)', 
    filter: 'blur(80px)', zIndex: 2 
  },
  content: { position: 'relative', zIndex: 10, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' },
  mainTitle: { textAlign: 'center', color: '#00f2ff', textShadow: '0 0 15px rgba(0,242,255,0.5)', letterSpacing: '4px', marginBottom: '40px' },
  dashboard: { display: 'grid', gridTemplateColumns: '1fr', gap: '30px' },
  glassCardLine: { 
    background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', 
    padding: '25px', borderRadius: '25px', border: '1px solid rgba(0, 242, 255, 0.3)',
    boxShadow: '0 0 20px rgba(0, 242, 255, 0.1)'
  },
  glassCardBar: { 
    background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', 
    padding: '25px', borderRadius: '25px', border: '1px solid rgba(255, 0, 234, 0.3)',
    boxShadow: '0 0 20px rgba(255, 0, 234, 0.1)'
  },
  cardTitle: { textAlign: 'center', fontSize: '14px', letterSpacing: '2px', marginBottom: '20px', opacity: 0.8 },
  glassTooltip: { backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid #00f2ff', borderRadius: '10px', color: '#fff' },
  loaderContainer: { textAlign: 'center', marginTop: '100px' },
  loader: { fontSize: '18px', letterSpacing: '5px', color: '#00f2ff', animation: 'pulse 2s infinite' }
};

export default Metricas;