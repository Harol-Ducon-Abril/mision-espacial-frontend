import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ show: false, mensaje: '' });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setCargando(true);

    try {
      const res = await axios.post('https://mision-espacial-backend.onrender.com/api/auth/login', { 
        email: email.trim(), 
        password: password 
      });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/papas');
      }
    } catch (err) {
      const mensajeError = err.response?.data?.message || "Interferencia detectada: Error de enlace.";
      setModal({ show: true, mensaje: mensajeError });
      setCargando(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', width: '100vw', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      background: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)',
      position: 'fixed', top: 0, left: 0, overflow: 'hidden' 
    }}>
      
      {/* CUADRÍCULA DE RADAR ESTÉTICA */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(102, 252, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 252, 241, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          width: '100%', maxWidth: '420px', padding: '45px', 
          background: 'rgba(18, 25, 33, 0.98)', borderRadius: '40px', 
          border: '2px solid #66fcf1', boxShadow: '0 0 50px rgba(102, 252, 241, 0.25)', 
          textAlign: 'center', zIndex: 50, position: 'relative' 
        }}
      >
        {/* SATÉLITE CON MARGEN AJUSTADO */}
        <div style={{ 
            fontSize: '65px', 
            marginBottom: '30px', // Aumentamos el margen para que no toque las letras
            marginTop: '-10px',   // Lo subimos un poco hacia el borde superior
            filter: 'drop-shadow(0 0 15px #66fcf1)',
            display: 'inline-block'
        }}>🛰️</div>

        <h2 style={{ color: '#66fcf1', fontSize: '30px', fontWeight: '900', letterSpacing: '5px', textShadow: '0 0 15px #66fcf1', margin: '0' }}>PANEL CENTRAL</h2>
        <p style={{ color: '#45a29e', fontSize: '11px', marginBottom: '35px', textTransform: 'uppercase', letterSpacing: '2px' }}>Autenticación de Comandante</p>

        <form onSubmit={manejarLogin} noValidate>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ color: '#66fcf1', fontSize: '10px', marginLeft: '10px', textTransform: 'uppercase' }}>Frecuencia de Radio (Email)</label>
            <input 
              type="email" placeholder="usuario@base-lunar.com" required 
              value={email} onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '16px', marginTop: '5px', borderRadius: '15px', background: '#0b0c10', border: '1px solid rgba(102, 252, 241, 0.4)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px' }} 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label style={{ color: '#66fcf1', fontSize: '10px', marginLeft: '10px', textTransform: 'uppercase' }}>Código de Enlace (Clave)</label>
            <input 
              type="password" placeholder="••••••••" required 
              value={password} onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '16px', marginTop: '5px', borderRadius: '15px', background: '#0b0c10', border: '1px solid rgba(102, 252, 241, 0.4)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px' }} 
            />
          </div>
          
          <div style={{ textAlign: 'right', marginBottom: '30px' }}>
            <span onClick={() => navigate('/recuperar')} style={{ color: '#45a29e', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>¿Perdiste tu llave de acceso?</span>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            style={{ width: '100%', padding: '18px', background: cargando ? '#222' : 'linear-gradient(90deg, #66fcf1, #45a29e)', color: '#0b0c10', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px', transition: '0.3s', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
          >
            {cargando ? 'SINCRONIZANDO...' : 'INICIAR SECUENCIA'}
          </button>
        </form>

        <p style={{ color: '#c5c6c7', marginTop: '30px', fontSize: '14px' }}>
          ¿Nueva tripulación? <span onClick={() => navigate('/registro')} style={{ color: '#66fcf1', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Regístrate</span>
        </p>

        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(102, 252, 241, 0.1)', paddingTop: '20px' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ background: 'transparent', color: '#45a29e', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}
          >
            ⬅ Abortar Misión y Volver al Radar
          </button>
        </div>
      </motion.div>

      {/* MODAL DE ERROR BLOQUEADO */}
      <AnimatePresence>
        {modal.show && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              style={{ background: '#121921', padding: '45px', borderRadius: '35px', border: '3px solid #ff4c4c', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 0 60px rgba(255, 76, 76, 0.4)' }}
            >
              <div style={{ fontSize: '55px', marginBottom: '20px' }}>⚠️</div>
              <h3 style={{ color: '#ff4c4c', fontWeight: '900', fontSize: '26px', letterSpacing: '3px', margin: '0 0 10px 0' }}>SISTEMA BLOQUEADO</h3>
              <p style={{ color: '#fff', lineHeight: '1.7', fontSize: '16px', margin: '20px 0' }}>{modal.mensaje}</p>
              <button 
                onClick={() => setModal({ show: false, mensaje: '' })} 
                style={{ width: '100%', padding: '16px', background: '#ff4c4c', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }}
              >
                CORREGIR RUMBO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;