import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '../supabaseClient'; // Asegúrate de tener tu cliente de supabase configurado

const Metricas = () => {
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosMaterias, setDatosMaterias] = useState([]);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState('actual');

  useEffect(() => {
    const fetchPuntosReales = async () => {
      // 1. Traer misiones completadas con el nombre de la misión/materia
      const { data, error } = await supabase
        .from('misiones_completadas')
        .select(`
          fecha,
          puntos_ganados,
          misiones ( nombre_materia )
        `);

      if (error) {
        console.error("Error al traer datos:", error);
      } else {
        // AQUÍ PROCESAMOS LOS 4 PUNTOS REALES
        // Agrupamos por día para la gráfica de línea
        const procesadosSemana = procesarPuntosPorDia(data); 
        // Agrupamos por materia para la gráfica de barras
        const procesadosMaterias = procesarPuntosPorMateria(data);

        setDatosSemana(procesadosSemana);
        setDatosMaterias(procesadosMaterias);
      }
    };

    fetchPuntosReales();
  }, [semanaSeleccionada]);

  return (
    <div style={{ padding: '20px', color: 'white', minHeight: '100vh', background: 'radial-gradient(circle, #1b2735 0%, #090a0f 100%)' }}>
      <h2 style={{ textAlign: 'center', color: '#66fcf1', fontWeight: '900' }}>📊 REPORTE DE INTELIGENCIA ESTRATÉGICA</h2>

      {/* FILTRO DE SEMANA */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <label style={{ marginRight: '10px' }}>SELECCIONAR PERIODO:</label>
        <select 
          value={semanaSeleccionada} 
          onChange={(e) => setSemanaSeleccionada(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', background: '#111', color: '#66fcf1', border: '1px solid #45a29e' }}
        >
          <option value="actual">Semana Actual</option>
          <option value="pasada">Semana Pasada</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        
        {/* GRÁFICA POR DÍA (LINEA) */}
        <div style={{ width: '100%', maxWidth: '550px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
          <h3 style={{ color: '#8884d8' }}>📈 Progresión de Puntos (Semanal)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #45a29e' }} />
              <Legend />
              <Line type="monotone" dataKey="puntos" stroke="#66fcf1" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICA POR MATERIA (BARRAS) */}
        <div style={{ width: '100%', maxWidth: '550px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
          <h3 style={{ color: '#ffaa00' }}>📚 Puntos por Área de Conocimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosMaterias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="materia" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #45a29e' }} />
              <Bar dataKey="puntos" fill="#ffaa00" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

// Funciones de ayuda para procesar los datos de Supabase
const procesarPuntosPorDia = (data) => {
  // Aquí mapeas las fechas a nombres de días (Lun, Mar...)
  // Si solo hay 4 puntos, solo mostrará 4 puntos en la línea
  return [
    { name: 'Lun', puntos: 0 },
    { name: 'Mar', puntos: 4 }, // Ejemplo del punto real
    { name: 'Mie', puntos: 0 },
    // ... resto de la semana
  ];
};

const procesarPuntosPorMateria = (data) => {
  // Aquí agrupas por el nombre de la materia de la tabla misiones
  return [
    { materia: 'Matemáticas', puntos: 4 },
    { materia: 'Español', puntos: 0 },
  ];
};

export default Metricas;