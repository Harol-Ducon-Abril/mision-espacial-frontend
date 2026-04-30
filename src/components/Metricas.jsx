import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Metricas = () => {
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosMaterias, setDatosMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semanaOffset, setSemanaOffset] = useState(0); // 0 = actual, -1 = pasada, etc.

  useEffect(() => {
    fetchData();
  }, [semanaOffset]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Traer misiones completadas con el nombre de la materia (Relación de tablas)
      // Ajusta los nombres de columnas si en tu DB son diferentes (ej: id_piloto, puntos)
      const { data, error } = await supabase
        .from('misiones_completadas')
        .select(`
          created_at,
          puntos_ganados,
          misiones ( nombre_materia )
        `)
        .eq('id_piloto', user.id); // Solo los puntos del piloto actual

      if (error) throw error;

      // --- Lógica de Procesamiento de Datos ---
      
      // Agrupar por Materia (Para detectar fallos)
      const materiasMap = {};
      data.forEach(reg => {
        const nombre = reg.misiones?.nombre_materia || 'General';
        materiasMap[nombre] = (materiasMap[nombre] || 0) + reg.puntos_ganados;
      });
      const rawMaterias = Object.keys(materiasMap).map(m => ({ materia: m, puntos: materiasMap[m] }));
      setDatosMaterias(rawMaterias);

      // Agrupar por Día (Línea de tiempo)
      // Aquí simplificamos para mostrar la progresión
      const diasMap = { Lun: 0, Mar: 0, Mie: 0, Jue: 0, Vie: 0, Sab: 0, Dom: 0 };
      const nombresDias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      
      data.forEach(reg => {
        const fecha = new Date(reg.created_at);
        const diaNombre = nombresDias[fecha.getDay()];
        diasMap[diaNombre] += reg.puntos_ganados;
      });

      const rawDias = Object.keys(diasMap).map(d => ({ name: d, puntos: diasMap[d] }));
      setDatosSemana(rawDias);

    } catch (err) {
      console.error("Error cargando métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* FONDO DE ESTRELLAS CSS */}
      <div style={styles.stars}></div>

      <nav style={styles.nav}>
        <Link to="/papas" style={styles.link}>⬅️ VOLVER AL COMANDO</Link>
        <h2 style={styles.title}>📊 INFORME DE RENDIMIENTO ACADÉMICO</h2>
      </nav>

      {loading ? (
        <div style={styles.loader}>Cargando coordenadas de puntos...</div>
      ) : (
        <div style={styles.content}>
          
          {/* SECCIÓN DE FILTROS */}
          <div style={styles.filterBar}>
            <button onClick={() => setSemanaOffset(s => s - 1)} style={styles.btnFiltro}>◀ Semana Anterior</button>
            <span style={styles.semanaText}>Mostrando Resumen General</span>
            <button onClick={() => setSemanaOffset(s => s + 1)} style={styles.btnFiltro}>Siguiente Semana ▶</button>
          </div>

          <div style={styles.grid}>
            {/* GRÁFICA DE LÍNEA: PROGRESIÓN */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📈 Evolución de Puntos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosSemana}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#66fcf1" />
                  <YAxis stroke="#66fcf1" />
                  <Tooltip contentStyle={styles.tooltip} />
                  <Line type="monotone" dataKey="puntos" stroke="#45a29e" strokeWidth={4} dot={{r: 6, fill: '#66fcf1'}} />
                </LineChart>
              </ResponsiveContainer>
              <p style={styles.desc}>Visualiza tus picos de actividad diaria.</p>
            </div>

            {/* GRÁFICA DE BARRAS: MATERIAS */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📚 Puntos por Materia</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosMaterias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="materia" stroke="#ffaa00" />
                  <YAxis stroke="#ffaa00" />
                  <Tooltip contentStyle={styles.tooltip} />
                  <Bar dataKey="puntos">
                    {datosMaterias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.puntos < 2 ? '#ff4c4c' : '#ffaa00'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={styles.desc}>Las barras <span style={{color: '#ff4c4c'}}>rojas</span> indican materias con bajo puntaje.</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0b0c10',
    color: 'white',
    fontFamily: "'Orbitron', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '20px'
  },
  stars: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
    zIndex: 0
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    borderBottom: '1px solid #45a29e',
    paddingBottom: '10px'
  },
  title: { color: '#66fcf1', fontSize: '22px', textShadow: '0 0 10px #66fcf1' },
  link: { color: '#c5c6c7', textDecoration: 'none', fontSize: '14px' },
  content: { position: 'relative', zIndex: 1, marginTop: '30px' },
  filterBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  btnFiltro: { background: 'transparent', border: '1px solid #45a29e', color: '#66fcf1', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' },
  semanaText: { fontSize: '18px', color: '#ffaa00' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' },
  card: { background: 'rgba(31, 40, 51, 0.8)', padding: '25px', borderRadius: '15px', border: '1px solid #45a29e', width: '100%', maxWidth: '500px', backdropFilter: 'blur(5px)' },
  cardTitle: { textAlign: 'center', marginBottom: '20px', fontSize: '18px' },
  desc: { textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '10px' },
  tooltip: { backgroundColor: '#1f2833', border: '1px solid #66fcf1', color: '#fff' },
  loader: { textAlign: 'center', marginTop: '100px', fontSize: '20px', color: '#66fcf1' }
};

export default Metricas;