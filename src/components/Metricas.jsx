import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { supabase } from '../supabaseClient';

const Metricas = () => {
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosMaterias, setDatosMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatosSemanaActual();
  }, []);

  const fetchDatosSemanaActual = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('misiones_completadas')
        .select(`
          created_at,
          puntos_ganados,
          misiones ( nombre_materia )
        `)
        .eq('id_piloto', user.id);

      if (error) throw error;

      // LÓGICA DE SEMANA ACTUAL
      const hoy = new Date();
      const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1)); 
      inicioSemana.setHours(0,0,0,0);

      const registrosSemana = data.filter(reg => new Date(reg.created_at) >= inicioSemana);

      // Procesar Materias
      const matMap = {};
      registrosSemana.forEach(reg => {
        const nom = reg.misiones?.nombre_materia || 'General';
        matMap[nom] = (matMap[nom] || 0) + reg.puntos_ganados;
      });
      setDatosMaterias(Object.keys(matMap).map(m => ({ materia: m, puntos: matMap[m] })));

      // Procesar Días (Lunes a Domingo)
      const dias = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      const diasData = dias.map(d => ({ name: d, puntos: 0 }));
      registrosSemana.forEach(reg => {
        const dIndex = (new Date(reg.created_at).getDay() + 6) % 7;
        diasData[dIndex].puntos += reg.puntos_ganados;
      });
      setDatosSemana(diasData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* CAPAS DE FONDO ESPACIAL */}
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>

      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.mainTitle}>INFORME DE MISIÓN: SEMANA ACTUAL</h1>
        </header>

        {loading ? (
          <div style={styles.loaderContainer}>
            <p style={styles.loader}>ESCANEANDO SECTOR ESTELAR...</p>
          </div>
        ) : (
          <div style={styles.dashboard}>
            
            {/* GRÁFICA DE LÍNEA: PROGRESIÓN DIARIA */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>PROGRESIÓN DE LA SEMANA</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosSemana}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#00f2ff" tick={{fontSize: 12}} />
                  <YAxis stroke="#00f2ff" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Line 
                    type="monotone" 
                    dataKey="puntos" 
                    stroke="#00f2ff" 
                    strokeWidth={4} 
                    dot={{r: 6, fill: '#00f2ff', strokeWidth: 2, stroke: '#000'}} 
                    activeDot={{r: 8}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* GRÁFICA DE BARRAS: FALLOS POR MATERIA */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>RENDIMIENTO POR MATERIA</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosMaterias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="materia" stroke="#ff00ea" tick={{fontSize: 12}} />
                  <YAxis stroke="#ff00ea" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Bar dataKey="puntos">
                    {datosMaterias.map((entry, index) => (
                      <Cell key={index} fill={entry.puntos < 1 ? '#ff4b2b' : '#ff00ea'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={styles.alertText}>⚠️ Sectores en rojo requieren atención inmediata.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#020204',
    color: 'white',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`,
    opacity: 0.4,
    zIndex: 1
  },
  nebula: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.08), rgba(255, 0, 234, 0.05), transparent)',
    filter: 'blur(100px)',
    zIndex: 2
  },
  content: { 
    position: 'relative', 
    zIndex: 10, 
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: { 
    textAlign: 'center', 
    marginBottom: '50px' 
  },
  mainTitle: { 
    fontSize: '32px', 
    fontWeight: '900', 
    color: '#00f2ff', 
    textShadow: '0 0 20px rgba(0,242,255,0.6)',
    letterSpacing: '3px',
    margin: 0
  },
  dashboard: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
    gap: '30px' 
  },
  glassCard: { 
    background: 'rgba(255, 255, 255, 0.02)', 
    backdropFilter: 'blur(15px)', 
    border: '1px solid rgba(0, 242, 255, 0.2)', 
    padding: '30px', 
    borderRadius: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  cardTitle: { 
    color: '#666', 
    fontSize: '14px', 
    letterSpacing: '4px', 
    marginBottom: '25px', 
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  glassTooltip: { 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    border: '1px solid #00f2ff', 
    color: '#fff',
    borderRadius: '10px'
  },
  alertText: { 
    fontSize: '12px', 
    color: '#ff4b2b', 
    marginTop: '20px', 
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  loaderContainer: { textAlign: 'center', marginTop: '150px' },
  loader: { fontSize: '20px', letterSpacing: '8px', color: '#00f2ff', animation: 'pulse 2s infinite' }
};

export default Metricas;