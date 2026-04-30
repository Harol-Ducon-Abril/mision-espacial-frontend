import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PanelPapas = () => {
  const [materias, setMaterias] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState('lunes');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [missionId, setMissionId] = useState(null);

  const navigate = useNavigate();
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

  // Función interna para obtener la autorización
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const obtenerIcono = (nombre) => {
    const n = nombre.toUpperCase();
    if (n.includes('MATE') || n.includes('SAB.MATE')) return '📐';
    if (n.includes('NATU') || n.includes('SAB.NATU')) return '🌱';
    if (n.includes('INGLES') || n.includes('SAB. ING')) return '🌍';
    if (n.includes('TECNOLOGIA')) return '💻';
    if (n.includes('SOCIALES') || n.includes('SAB.SOCI')) return '🪐';
    if (n.includes('TEXTUAL') || n.includes('LENG') || n.includes('PLAN L.')) return '📖';
    if (n.includes('INT. EMO')) return '💖';
    if (n.includes('RELI')) return '🕊️';
    return '🚀';
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const config = getConfig();
        const respuestaMaterias = await axios.get('https://mision-espacial-backend.onrender.com/api/materias', config);
        setMaterias(respuestaMaterias.data);
        if (respuestaMaterias.data.length > 0) setMateriaSeleccionada(respuestaMaterias.data[0].id);

        const respuestaMision = await axios.get('https://mision-espacial-backend.onrender.com/api/progreso', config);
        if (respuestaMision.data.mission_id) {
          setMissionId(respuestaMision.data.mission_id);
        }
      } catch (error) { console.error("Error cargando el radar:", error); }
    };
    cargarDatos();
  }, []);

  const enviar = async (puntos) => {
    if (!missionId) return setMensaje("❌ Error: Debes activar un piloto en la Academia primero.");
    try {
      await axios.put('https://mision-espacial-backend.onrender.com/api/puntaje', {
        mission_id: missionId,
        subject_id: materiaSeleccionada, 
        day_of_week: diaSeleccionado, 
        points: puntos
      }, getConfig());
      
      if (puntos === 2) setMensaje('🌟 ¡EXCELENTE! +2 Astro-Puntos recolectados 🌑🌑');
      else if (puntos === 1) setMensaje('👍 ¡BIEN! +1 Astro-Punto recolectado 🌑');
      else setMensaje('💥 Misión Fallida. ¡A esquivar asteroides mañana!');
      
      setTimeout(() => setMensaje(''), 4000);
    } catch (error) { setMensaje('📡 Error en la transmisión.'); }
  };

  return (
    <div style={{ 
      maxWidth: '800px', margin: '20px auto', padding: '40px', backgroundColor: '#0b0c10', 
      borderRadius: '25px', border: '3px solid #1f2833', boxShadow: '0 0 40px rgba(102, 252, 241, 0.15)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#66fcf1', textShadow: '0 0 20px rgba(102, 252, 241, 0.8)', margin: '0', fontSize: '38px', letterSpacing: '2px' }}>
          🛸 CENTRO DE MANDO
        </h1>
        <p style={{ color: '#c5c6c7', fontSize: '18px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Asignación Oficial de Astro-Puntos
        </p>
      </div>
      
      <div style={{ marginBottom: '35px', backgroundColor: '#121921', padding: '20px', borderRadius: '15px', borderLeft: '4px solid #66fcf1' }}>
        <label style={{ color: '#66fcf1', display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>
          🗓️ SELECCIONA EL DÍA ESTELAR:
        </label>
        <select 
          value={diaSeleccionado} 
          onChange={(e) => setDiaSeleccionado(e.target.value)} 
          style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#0b0c10', color: '#fff', border: '2px solid #45a29e', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
        >
          {dias.map(d => <option key={d} value={d}>🚀 {d.toUpperCase()}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <label style={{ color: '#66fcf1', display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>
          🛰️ ELIGE LA MISIÓN (MATERIA):
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {materias.map((m) => {
            const isSelected = materiaSeleccionada === m.id;
            return (
              <button 
                key={m.id} 
                onClick={() => setMateriaSeleccionada(m.id)} 
                style={{
                  flex: '1 1 20%', minWidth: '130px', padding: '15px 10px', 
                  background: isSelected ? 'linear-gradient(145deg, #45a29e, #1f2833)' : '#121921',
                  color: isSelected ? '#fff' : '#c5c6c7', border: isSelected ? '2px solid #66fcf1' : '2px solid #1f2833', 
                  borderRadius: '15px', cursor: 'pointer', boxShadow: isSelected ? '0 0 20px rgba(102, 252, 241, 0.6)' : 'inset 0 0 10px rgba(0,0,0,0.5)',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)', transition: 'all 0.2s ease-in-out'
                }}
              >
                <div style={{ fontSize: '35px', filter: isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none' }}>
                  {obtenerIcono(m.name)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '8px' }}>{m.name}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#121921', padding: '30px', borderRadius: '20px', border: '2px dashed #45a29e' }}>
        <label style={{ color: '#fff', display: 'block', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center', fontSize: '22px' }}>
          ¿CUÁNTOS ASTRO-PUNTOS GANÓ EL COMANDANTE?
        </label>
        
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', flexWrap: 'wrap' }}>
          <button onClick={() => enviar(0)} style={{ flex: 1, minWidth: '200px', padding: '25px 10px', background: 'linear-gradient(145deg, #3a1c1c, #1a0a0a)', color: '#ff4c4c', border: '2px solid #ff4c4c', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>💥</div>
            <div style={{ fontSize: '20px', fontWeight: '900' }}>FALLIDA</div>
          </button>

          <button onClick={() => enviar(1)} style={{ flex: 1, minWidth: '200px', padding: '25px 10px', background: 'linear-gradient(145deg, #3a2e1c, #1a150a)', color: '#ffaa00', border: '2px solid #ffaa00', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🌑</div>
            <div style={{ fontSize: '20px', fontWeight: '900' }}>REGULAR</div>
          </button>

          <button onClick={() => enviar(2)} style={{ flex: 1, minWidth: '200px', padding: '25px 10px', background: 'linear-gradient(145deg, #1c3a24, #0a1a10)', color: '#4caf50', border: '2px solid #4caf50', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🌟🌑🌟</div>
            <div style={{ fontSize: '20px', fontWeight: '900' }}>¡EXCELENTE!</div>
          </button>
        </div>
      </div>

      {mensaje && (
        <div style={{ marginTop: '30px', padding: '20px', background: 'linear-gradient(90deg, transparent, rgba(102, 252, 241, 0.2), transparent)', color: '#66fcf1', border: '1px solid #45a29e', borderRadius: '15px', fontWeight: '900', textAlign: 'center', fontSize: '22px' }}>
          {mensaje}
        </div>
      )}

      <div style={{ marginTop: '50px', borderTop: '3px dashed #1f2833', paddingTop: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ffaa00', marginBottom: '20px', fontSize: '24px' }}>🎁 GESTIÓN DE RECOMPENSAS SEMANALES</h3>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/premios')} style={{ flex: '1', maxWidth: '350px', padding: '20px 30px', background: 'linear-gradient(90deg, #ffaa00, #ff4c4c)', color: '#0b0c10', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '900', cursor: 'pointer' }}>
            Configurar Cofres ➔
          </button>
          <button onClick={() => navigate('/registro-piloto')} style={{ flex: '1', maxWidth: '350px', padding: '20px 30px', background: 'linear-gradient(90deg, #66fcf1, #45a29e)', color: '#0b0c10', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '900', cursor: 'pointer' }}>
            Academia Pilotos ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelPapas;