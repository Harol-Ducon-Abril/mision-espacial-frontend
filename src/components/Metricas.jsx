import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
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
      // 1. Obtener usuario de la sesión de Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      // 2. Consultar la VISTA (Camino A)
      const { data, error } = await supabase
        .from('metricas_estelares')
        .select('*')
        .order('fecha', { ascending: true });

      if (error) throw error;

      // 3. Lógica para filtrar solo la semana actual (Lunes a Domingo)
      const ahora = new Date();
      const diaActual = ahora.getDay(); 
      const diffLunes = diaActual === 0 ? -6 : 1 - diaActual;
      const lunesActual = new Date(ahora);
      lunesActual.setDate(ahora.getDate() + diffLunes);
      lunesActual.setHours(0, 0, 0, 0);

      const registrosSemana = data.filter(reg => new Date(reg.fecha) >= lunesActual);

      // --- FUNCIONALIDAD: PROCESAR GRÁFICA DE LÍNEAS ---
      const etiquetas = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      const estructuraLineas = etiquetas.map(d => ({ name: d, puntos: 0 }));

      registrosSemana.forEach(reg => {
        const f = new Date(reg.fecha);
        const index = (f.getDay() + 6) % 7; 
        if (estructuraLineas[index]) {
          estructuraLineas[index].puntos += reg.puntos;
        }
      });
      setDatosSemana(estructuraLineas);

      // --- FUNCIONALIDAD: PROCESAR GRÁFICA DE BARRAS ---
      const materiasMap = {};
      registrosSemana.forEach(reg => {
        const nombreMat = reg.materia || 'Otras';
        materiasMap[nombreMat] = (materiasMap[nombreMat] || 0) + reg.puntos;
      });

      const estructuraBarras = Object.keys(materiasMap).map(m => ({
        materia: m,
        puntos: materiasMap[m]
      }));
      setDatosMaterias(estructuraBarras);

    } catch (err) {
      console.error("Falla en radar:", err.message);
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
          <h1 style={styles.mainTitle}>INFORME DE MISIÓN: SEMANA ACTUAL</h1>
        </header>

        {loading ? (
          <p style={styles.loader}>SINCRONIZANDO HISTORIAL...</p>
        ) : (
          <div style={styles.dashboard}>
            {/* PROGRESIÓN DIARIA */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>PROGRESIÓN DIARIA</h3>
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
                    dot={{r: 6, fill: '#00f2ff'}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* RENDIMIENTO MATERIAS */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>RENDIMIENTO POR MATERIA</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosMaterias}>
                  <XAxis dataKey="materia" stroke="#0e9efd" />
                  <YAxis stroke="#0e9efd" />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Bar dataKey="puntos">
                    {datosMaterias.map((entry, index) => (
                      <Cell key={index} fill={entry.puntos < 1 ? '#ff4b2b' : '#18e4a7fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={styles.alertText}>⚠️ Las barras rojas indican falta de actividad.</p>
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
  header: { textAlign: 'center', marginBottom: '50px' },
  mainTitle: { fontSize: '32px', fontWeight: '900', color: '#00f2ff', textShadow: '0 0 20px rgba(0,242,255,0.6)', letterSpacing: '3px' },
  dashboard: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(15px)', border: '1px solid rgba(0, 242, 255, 0.2)', padding: '30px', borderRadius: '25px' },
  cardTitle: { color: '#888', fontSize: '14px', letterSpacing: '4px', marginBottom: '25px', textAlign: 'center' },
  glassTooltip: { backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #00f2ff', color: '#fff', borderRadius: '10px' },
  alertText: { fontSize: '12px', color: '#ff4b2b', marginTop: '20px', textAlign: 'center', fontWeight: 'bold' },
  loader: { textAlign: 'center', marginTop: '150px', fontSize: '20px', letterSpacing: '8px', color: '#00f2ff' }
};

export default Metricas;