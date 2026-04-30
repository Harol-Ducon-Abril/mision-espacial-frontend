import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Estado del modal más preciso
  const [modal, setModal] = useState({ show: false, mensaje: '', esError: false });
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      // Intentamos el registro
      const res = await axios.post('http://localhost:5000/api/auth/registro', { email, password });
      
      // Si llega aquí, el registro fue exitoso
      setModal({ 
        show: true, 
        mensaje: "🚀 ¡Registro exitoso! Tu tripulación ha sido dada de alta en la base de datos galáctica.", 
        esError: false 
      });
    } catch (err) {
      // Si hay error (como el correo duplicado que vimos antes)
      const mensajeError = err.response?.data?.message || "Los radares indican una interferencia. Intenta con otro correo.";
      setModal({ 
        show: true, 
        mensaje: `❌ ${mensajeError}`, 
        esError: true 
      });
    }
  };

  const cerrarModal = () => {
    const tuvoExito = !modal.esError;
    setModal({ ...modal, show: false });
    
    // Solo si tuvo éxito lo mandamos al login al cerrar
    if (tuvoExito) {
      navigate('/login');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, #1b2735 0%, #090a0f 100%)', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ background: '#121921', padding: '40px', borderRadius: '30px', border: '2px solid #ffaa00', width: '100%', maxWidth: '400px', boxShadow: '0 0 40px rgba(255, 170, 0, 0.15)', textAlign: 'center' }}
      >
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>🚀</div>
        <h2 style={{ color: '#ffaa00', fontSize: '28px', marginBottom: '10px', fontWeight: '900', letterSpacing: '2px' }}>REGISTRO</h2>
        <p style={{ color: '#c5c6c7', marginBottom: '30px', fontSize: '14px' }}>Crea tu propia Flota Estelar</p>

        <form onSubmit={manejarRegistro}>
          <input 
            type="email" placeholder="Correo Electrónico" required 
            onChange={e => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', background: '#0b0c10', border: '1px solid #ffaa00', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
          />
          <input 
            type="password" placeholder="Crea tu Clave" required 
            onChange={e => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '12px', background: '#0b0c10', border: '1px solid #ffaa00', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
          />
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', padding: '15px', background: 'linear-gradient(90deg, #ffaa00, #ff4c4c)', 
              border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', 
              color: '#0b0c10', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px'
            }}
          >
            Crear Cuenta ➔
          </button>
        </form>

        <p style={{ color: '#c5c6c7', marginTop: '25px', fontSize: '14px' }}>
          ¿Ya eres parte de la flota? <br/>
          <span onClick={() => navigate('/login')} style={{ color: '#ffaa00', cursor: 'pointer', fontWeight: 'bold' }}>Inicia sesión aquí</span>
        </p>

        <div style={{ marginTop: '20px', borderTop: '1px solid #1f2833', paddingTop: '15px' }}>
            <button 
                onClick={() => navigate('/')} 
                style={{ background: 'transparent', color: '#45a29e', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline' }}
            >
                ⬅ VOLVER AL INICIO
            </button>
        </div>
      </motion.div>

      {/* MODAL EMERGENTE CORREGIDO */}
      <AnimatePresence>
        {modal.show && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              style={{ background: '#121921', padding: '30px', borderRadius: '25px', border: `2px solid ${modal.esError ? '#ff4c4c' : '#66fcf1'}`, maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: `0 0 30px ${modal.esError ? 'rgba(255, 76, 76, 0.3)' : 'rgba(102, 252, 241, 0.3)'}` }}
            >
              <h3 style={{ color: modal.esError ? '#ff4c4c' : '#66fcf1', marginTop: 0 }}>
                {modal.esError ? '⚠️ ERROR DE SISTEMA' : '🛰️ ¡CONTACTO ESTABLECIDO!'}
              </h3>
              <p style={{ color: '#fff', fontSize: '16px', lineHeight: '1.5' }}>{modal.mensaje}</p>
              <button 
                onClick={cerrarModal} 
                style={{ marginTop: '20px', padding: '12px 30px', background: modal.esError ? '#ff4c4c' : '#66fcf1', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: '#0b0c10' }}
              >
                {modal.esError ? 'CORREGIR RUTA' : 'IR AL ACCESO'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registro;