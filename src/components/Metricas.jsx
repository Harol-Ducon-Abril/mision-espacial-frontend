import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Lunes', misiones: 4, puntos: 240 },
  { name: 'Martes', misiones: 3, puntos: 139 },
  { name: 'Miércoles', misiones: 2, puntos: 980 },
  { name: 'Jueves', misiones: 6, puntos: 390 },
  { name: 'Viernes', misiones: 8, puntos: 480 },
];

const Metricas = () => {
  return (
    <div style={{ padding: '20px', color: 'white', background: 'rgba(0,0,0,0.8)', borderRadius: '15px', margin: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>🚀 Rendimiento de la Misión</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="misiones" stroke="#8884d8" strokeWidth={3} />
            <Line type="monotone" dataKey="puntos" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Metricas;