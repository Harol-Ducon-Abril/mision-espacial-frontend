import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

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

      // Traemos solo lo de la semana actual (puedes filtrar por fecha en el query si prefieres)
      const { data, error } = await supabase
        .from('misiones_completadas')
        .select(`
          created_at,
          puntos_ganados,
          misiones ( nombre_materia )
        `)
        .eq('id_piloto', user.id);

      if (error) throw error;

      // FILTRAR SOLO SEMANA ACTUAL (Lógica de JS)
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

      // Procesar Días
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
      {/* FONDO ESPACIAL MEJORADO */}
      <div style={styles.stars}></div>
      <div style={styles.nebula}></div>

      <div style={styles.content}>
        <header style={styles.header}>
          <Link to="/papas" style={styles.backBtn}>🚀 VOLVER</Link>
          <h1 style={styles.mainTitle}>REPORTE DE MISIÓN: SEMANA ACTUAL</h1>
        </header>

        {loading ? (
          <p style={styles.loader}>Sincronizando con el satélite...</p>
        ) : (
          <div style={styles.dashboard}>
            {/* PANEL IZQUIERDO: LÍNEA DE TIEMPO */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>PROGRESIÓN DIARIA</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={datosSemana}>
                  <XAxis dataKey="name" stroke="#00f2ff" />
                  <YAxis stroke="#00f2ff" />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Line type="monotone" dataKey="puntos" stroke="#00f2ff" strokeWidth={3} dot={{r: 5, fill: '#00f2ff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PANEL DERECHO: MATERIAS (PARA VER FALLOS) */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>RENDIMIENTO POR MATERIA</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={datosMaterias}>
                  <XAxis dataKey="materia" stroke="#ff00ea" />
                  <YAxis stroke="#ff00ea" />
                  <Tooltip contentStyle={styles.glassTooltip} />
                  <Bar dataKey="puntos">
                    {datosMaterias.map((entry, index) => (
                      <Cell key={index} fill={entry.puntos < 1 ? '#ff4b2b' : '#ff00ea'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={styles.alertText}>Las barras rojas indican misiones fallidas o sin puntos.</p>
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
    backgroundColor: '#050505',
    color: 'white',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  stars: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    background: `url('https://www.transparenttextures.com/patterns/stardust.png') repeat`,
    animation: 'move-stars 100s linear infinite',
    opacity: 0.5
  },
  nebula: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.1), rgba(255, 0, 234, 0.05), transparent)',
    filter: 'blur(80px)'
  },
  content: { position: 'relative', zIndex: 10, padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  mainTitle: { fontSize: '28px', fontWeight: '900', color: '#00f2ff', textShadow: '0 0 15px rgba(0,242,255,0.7)' },
  backBtn: { color: '#fff', textDecoration: 'none', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px', fontSize: '12px' },
  dashboard: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '25px', borderRadius: '20px' },
  cardTitle: { color: '#aaa', fontSize: '14px', letterSpacing: '2px', marginBottom: '20px' },
  glassTooltip: { backgroundColor: '#000', border: '1px solid #00f2ff', color: '#fff' },
  alertText: { fontSize: '11px', color: '#ff4b2b', marginTop: '10px', textAlign: 'center' },
  loader: { textAlign: 'center', marginTop: '100px', fontSize: '18px', letterSpacing: '3px' }
};

export default Metricas;