import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ConfigPremios = () => {
  const [premios, setPremios] = useState({ 
    prize_1: '', prize_2: '', prize_3: '', prize_max: '' 
  });
  const [cargando, setCargando] = useState(false);
  const [modal, setModal] = useState({ show: false, mensaje: '', esError: false });
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resPremios = await axios.get('https://mision-espacial-backend.onrender.com/api/premios');
        if (resPremios.data) {
          setPremios({
            prize_1: resPremios.data.prize_1_img || '', 
            prize_2: resPremios.data.prize_2_img || '',
            prize_3: resPremios.data.prize_3_img || '', 
            prize_max: resPremios.data.prize_max_img || ''
          });
        }
      } catch (error) { console.error("Error", error); }
    };
    cargarDatos();
  }, []);

  const manejarImagen = (e, nivel) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setModal({ 
          show: true, 
          mensaje: "¡Alerta! Cargamento muy pesado. El límite máximo es de 100MB para transmisiones estelares.", 
          esError: true 
        });
        e.target.value = null; 
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPremios(prev => ({ ...prev, [nivel]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- LÓGICA CORREGIDA PARA MOSTRAR MENSAJE ANTES DE SALIR ---
  const guardarYVolver = async () => {
    setCargando(true);
    try {
      await axios.post('https://mision-espacial-backend.onrender.com/api/premios', {
        prize_1: premios.prize_1,
        prize_2: premios.prize_2,
        prize_3: premios.prize_3,
        prize_max: premios.prize_max
      });
      
      // 1. Mostrar mensaje de éxito
      setModal({ 
        show: true, 
        mensaje: "✅ ¡Bóveda sellada! Los premios han sido guardados correctamente en la base lunar.", 
        esError: false 
      });

      // 2. Esperar 2 segundos antes de redirigir para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/papas');
      }, 2500);

    } catch (error) {
      setModal({ show: true, mensaje: "🔴 Error de conexión con la base central.", esError: true });
    } finally {
      setCargando(false);
    }
  };

  const InputPremio = ({ titulo, nivel, valor, color }) => (
    <div style={{ backgroundColor: '#121921', padding: '25px', borderRadius: '20px', marginBottom: '25px', borderLeft: `8px solid ${color}`, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center' }}>
      <h3 style={{ color: color, marginTop: 0, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>{titulo}</h3>
      
      <div style={{ width: '100%', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px 0', backgroundColor: '#0b0c10', borderRadius: '15px', border: `2px solid ${color}`, overflow: 'hidden' }}>
        {valor ? (
          <img src={valor} alt="exhibición" style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block' }} />
        ) : (
          <span style={{ fontSize: '12px', color: '#45a29e', opacity: 0.5 }}>COFRE VACÍO</span>
        )}
      </div>

      <label style={{ display: 'inline-block', padding: '10px 25px', background: 'transparent', border: `2px solid ${color}`, color: color, borderRadius: '50px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
        SELECCIONAR CARGAMENTO
        <input type="file" accept="image/*" onChange={(e) => manejarImagen(e, nivel)} style={{ display: 'none' }} />
      </label>
    </div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '650px', padding: '30px', backgroundColor: 'rgba(18, 25, 33, 0.9)', borderRadius: '30px', border: '3px solid #ffaa00', boxShadow: '0 0 30px rgba(255, 170, 0, 0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '40px' }}>⚙️</span>
          <h2 style={{ color: '#ffaa00', margin: '10px 0 0', fontSize: '30px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '4px', textShadow: '0 0 10px #ffaa00' }}>BÓVEDA DE RECOMPENSAS</h2>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '5px' }}>CONFIGURACIÓN OFICIAL DEL CARGAMENTO SEMANAL</p>
        </div>
        
        <InputPremio titulo="🛸 NIVEL 1 (12 Puntos)" nivel="prize_1" valor={premios.prize_1} color="#66fcf1" />
        <InputPremio titulo="🪐 NIVEL 2 (24 Puntos)" nivel="prize_2" valor={premios.prize_2} color="#ffaa00" />
        <InputPremio titulo="☄️ NIVEL 3 (36 Puntos)" nivel="prize_3" valor={premios.prize_3} color="#ff4c4c" />
        <InputPremio titulo="🌌 GRAN PREMIO FINAL (48 Puntos)" nivel="prize_max" valor={premios.prize_max} color="#4caf50" />

        <div style={{ display: 'flex', gap: '20px', marginTop: '30px', position: 'sticky', bottom: '20px', zIndex: 10 }}>
          <button onClick={() => navigate('/papas')} style={{ flex: 1, padding: '18px', background: '#1f2833', color: '#c5c6c7', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>CANCELAR</button>
          <button onClick={guardarYVolver} disabled={cargando} style={{ flex: 2, padding: '18px', background: 'linear-gradient(90deg, #ffaa00, #ff4c4c)', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '18px', fontWeight: '900' }}>
            {cargando ? '📦 SINCRONIZANDO...' : '✅ SELLAR COFRES Y VOLVER'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modal.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ background: '#121921', padding: '30px', borderRadius: '20px', border: `2px solid ${modal.esError ? '#ff4c4c' : '#4caf50'}`, textAlign: 'center', color: 'white', maxWidth: '400px' }}>
              <h3 style={{ color: modal.esError ? '#ff4c4c' : '#4caf50' }}>{modal.esError ? '⚠️ ALERTA DE SISTEMA' : '📡 TRANSMISIÓN EXITOSA'}</h3>
              <p style={{ margin: '20px 0', lineHeight: '1.5' }}>{modal.mensaje}</p>
              {!modal.esError && <div style={{ fontSize: '40px' }}>🚀</div>}
              {modal.esError && <button onClick={() => setModal({ ...modal, show: false })} style={{ padding: '12px 30px', background: '#ff4c4c', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>ENTENDIDO</button>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfigPremios;