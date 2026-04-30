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
      // 1. Obtener el usuario actual de Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Sesión no encontrada");

      // 2. Consultar la VISTA (Camino A) filtrando por el usuario logueado
      const { data, error } = await supabase
        .from('metricas_estelares')
        .select('*')
        .eq('usuario_id', user.id) // Seguridad: solo tus puntos
        .order('fecha', { ascending: true });

      if (error) throw error;

      // 3. Cálculo preciso del Lunes de la semana actual
      const ahora = new Date();
      const diaSemana = ahora.getDay(); // 0: Dom, 1: Lun...
      const diferenciaAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
      
      const lunesActual = new Date(ahora);
      lunesActual.setDate(ahora.getDate() + diferenciaAlLunes);
      lunesActual.setHours(0, 0, 0, 0);

      // 4. Filtrado de datos
      const registrosSemana = data.filter(reg => new Date(reg.fecha) >= lunesActual);

      // --- PROCESAMIENTO: GRÁFICA DE LÍNEAS ---
      const etiquetas = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      const estructuraLineas = etiquetas.map(d => ({ name: d, puntos: 0 }));

      registrosSemana.forEach(reg => {
        const f = new Date(reg.fecha);
        const index = (f.getDay() + 6) % 7; // Ajuste: Lunes=0, Domingo=6
        if (estructuraLineas[index]) {
          estructuraLineas[index].puntos += reg.puntos;
        }
      });
      setDatosSemana(estructuraLineas);

      // --- PROCESAMIENTO: GRÁFICA DE BARRAS ---
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
      console.error("Error en el radar de misión:", err.message);
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
          <div style={styles.loaderContainer}>
            <p style={styles.loader}>CALIBRANDO SENSORES...</p>
          </div>
        ) : (
          <div style={styles.dashboard}>
            
            {/* GRÁFICA DE PROGRESIÓN */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>PROGRESIÓN DIARIA (ASTRO-PUNTOS)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosSemana}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#00f2ff" tick={{fontSize: 12}} />
                  <YAxis stroke="#00f2ff" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={styles.glassTooltip} itemStyle={{color: '#00f2ff'}} />
                  <Line 
                    type="monotone" 
                    dataKey="puntos" 
                    stroke="#00f2ff" 
                    strokeWidth={4} 
                    dot={{r: 6, fill: '#00f2ff', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 8, fill: '#ff00ea'}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* GRÁFICA DE MATERIAS */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>RENDIMIENTO POR SECTOR</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosMaterias}>
                  <XAxis dataKey="materia" stroke="#ff00ea" tick={{fontSize: 10}} />
                  <YAxis stroke="#ff00ea" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={styles.glassTooltip} itemStyle={{color: '#ff00ea'}} />
                  <Bar dataKey="puntos" radius={[10, 10, 0, 0]}>
                    {datosMaterias.map((entry, index) => (
                      <Cell key={index} fill={entry.puntos < 1 ? '#ff4b2b' : '#ff00ea'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={styles.alertText}>⚠️ Los sectores en rojo requieren atención inmediata.</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// --- ESTILOS ORIGINALES CON TOQUES DE MEJORA ---
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020204', color: 'white', position: 'relative', overflow: 'hidden' },
  stars: { position: 'absolute', width: '100%', height: '100%', background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`, opacity: 0.4, zIndex: 1 },
  nebula: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.08), rgba(255, 0, 234, 0.05), transparent)', filter: 'blur(100px)', zIndex: 2 },
  content: { position: 'relative', zIndex: 10, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '50px' },
  mainTitle: { fontSize: '32px', fontWeight: '900', color: '#00f2ff', textShadow: '0 0 20px rgba(0,242,255,0.6)', letterSpacing: '3px' },
  dashboard: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(15px)', border: '1px solid rgba(0, 242, 255, 0.2)', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  cardTitle: { color: '#888', fontSize: '13px', letterSpacing: '4px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' },
  glassTooltip: { backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #00f2ff', color: '#fff', borderRadius: '15px', padding: '10px' },
  alertText: { fontSize: '11px', color: '#ff4b2b', marginTop: '20px', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  loaderContainer: { textAlign: 'center', marginTop: '150px' },
  loader: { fontSize: '20px', letterSpacing: '8px', color: '#00f2ff', fontWeight: 'bold' }
};

export default Metricas;