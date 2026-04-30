import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Metricas = () => {
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(16);
  const [detalleSemana, setDetalleSemana] = useState([]);

  // 1. Cargar datos generales para el gráfico
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/metricas`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setDatosGrafico(data));
  }, []);

  // 2. Cargar detalle cuando cambie la semana en el filtro
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/metricas/detalle/${semanaSeleccionada}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setDetalleSemana(data));
  }, [semanaSeleccionada]);

  // Cálculos para las tarjetas
  const mejorSemana = datosGrafico.reduce((prev, curr) => (prev.total > curr.total) ? prev : curr, {semana: 0, total: 0});

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0b0c10' }}>
      <h2 style={{ color: '#66fcf1' }}>📊 Panel de Control Galáctico</h2>

      {/* --- TARJETAS DE RESUMEN --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4>🏆 Mejor Semana</h4>
          <p style={{ fontSize: '24px', color: '#66fcf1' }}>Semana {mejorSemana.semana}</p>
          <span>{mejorSemana.total} Puntos</span>
        </div>
        <div style={cardStyle}>
          <h4>📈 Meta Semanal</h4>
          <div style={progressContainer}>
            <div style={{ ...progressBar, width: '70%' }}></div>
          </div>
          <span>70% de la misión</span>
        </div>
      </div>

      {/* --- GRÁFICO EVOLUTIVO --- */}
      <div style={{ backgroundColor: '#1f2833', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
        <h3>Evolución de Puntos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#45a29e" />
            <XAxis dataKey="semana" stroke="#66fcf1" label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#66fcf1" />
            <Tooltip contentStyle={{ backgroundColor: '#0b0c10', border: '1px solid #66fcf1' }} />
            <Line type="monotone" dataKey="total" stroke="#66fcf1" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- FILTRO POR SEMANA --- */}
      <div style={{ backgroundColor: '#1f2833', padding: '20px', borderRadius: '15px' }}>
        <h3>🔍 Detalle por Materia</h3>
        <div style={{ marginBottom: '15px' }}>
          <label>Seleccionar Semana: </label>
          <select 
            value={semanaSeleccionada} 
            onChange={(e) => setSemanaSeleccionada(e.target.value)}
            style={selectStyle}
          >
            {[...Array(52).keys()].map(n => (
              <option key={n+1} value={n+1}>Semana {n+1}</option>
            ))}
          </select>
        </div>

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #66fcf1' }}>
              <th style={{ padding: '10px' }}>Materia</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {detalleSemana.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #45a29e' }}>
                <td style={{ padding: '10px' }}>{item.materia}</td>
                <td>{item.puntos} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Estilos rápidos
const cardStyle = { backgroundColor: '#1f2833', padding: '20px', borderRadius: '15px', flex: '1', minWidth: '200px', border: '1px solid #45a29e' };
const progressContainer = { width: '100%', backgroundColor: '#0b0c10', borderRadius: '10px', height: '10px', margin: '10px 0' };
const progressBar = { backgroundColor: '#66fcf1', height: '100%', borderRadius: '10px', boxShadow: '0 0 10px #66fcf1' };
const selectStyle = { backgroundColor: '#0b0c10', color: '#66fcf1', border: '1px solid #66fcf1', padding: '5px', borderRadius: '5px', marginLeft: '10px' };

export default Metricas;