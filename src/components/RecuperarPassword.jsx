import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTE DE INPUT PROFESIONAL (ESTILO NEÓN GALÁCTICO) ---
const InputProfesional = ({ icon, label, ...props }) => (
  <div style={{ position: 'relative', marginBottom: '25px', textAlign: 'left' }}>
    <label style={{ display: 'block', color: '#45a29e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: 'bold' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#66fcf1', opacity: 0.8 }}>
        {icon}
      </span>
      <input 
        {...props} 
        style={{ 
          width: '100%', padding: '15px 15px 15px 50px', 
          borderRadius: '12px', background: 'rgba(11, 12, 16, 0.9)', 
          border: '2px solid rgba(102, 252, 241, 0.3)', color: '#fff', 
          outline: 'none', fontSize: '16px', boxSizing: 'border-box', 
          transition: '0.3s', boxShadow: 'inset 0 0 10px rgba(102, 252, 241, 0.05)', ...props.style 
        }}
        onFocus={(e) => { e.target.style.border = '2px solid #66fcf1'; e.target.style.boxShadow = '0 0 15px rgba(102, 252, 241, 0.3)'; }}
        onBlur={(e) => { e.target.style.border = '2px solid rgba(102, 252, 241, 0.3)'; e.target.style.boxShadow = 'inset 0 0 10px rgba(102, 252, 241, 0.05)'; }}
      />
    </div>
  </div>
);

const RecuperarPassword = () => {
  const [paso, setPaso] = useState(1); // 1: Pedir Correo, 2: OTP y Clave
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modal, setModal] = useState({ show: false, mensaje: '', esError: false });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Paso 1: Pedir el código
  const enviarCodigo = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await axios.post('https://mision-espacial-backend.onrender.com/api/auth/recuperar-otp', { email });
      setPaso(2);
      setModal({ show: true, mensaje: "📡 SEÑAL ESTABLECIDA. Revisa tu email para el código de acceso.", esError: false });
    } catch (error) {
      setModal({ show: true, mensaje: "❌ ERROR DE CONEXIÓN. Email no detectado en los radares.", esError: true });
    } finally { setCargando(false); }
  };

  // Paso 2: Usar OTP y cambiar clave
  const cambiarPassword = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await axios.post('https://mision-espacial-backend.onrender.com/api/auth/reset-password-otp', { email, otp, newPassword });
      setModal({ show: true, mensaje: "🌟 ACCESO RESTAURADO. Contraseña actualizada.", esError: false });
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      setModal({ show: true, mensaje: "⚠️ CÓDIGO INVÁLIDO O EXPIRADO. Intenta de nuevo.", esError: true });
    } finally { setCargando(false); }
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Superposición de cuadrícula futurista opcional */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(102, 252, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 252, 241, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.5 }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: '450px', padding: '10px', position: 'relative', zIndex: 10 }}
      >
        <div style={{ background: 'rgba(18, 25, 33, 0.95)', padding: '50px', borderRadius: '30px', border: '3px solid #66fcf1', boxShadow: '0 0 50px rgba(102, 252, 241, 0.25)', textAlign: 'center', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', background: '#0b0c10', border: '3px solid #66fcf1', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', boxShadow: '0 0 20px rgba(102, 252, 241, 0.3)' }}>
            📡
          </div>

          <h2 style={{ color: '#66fcf1', fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '30px', marginBottom: '10px', textShadow: '0 0 15px #66fcf1' }}>
            {paso === 1 ? 'REPARAR ACCESO' : 'INGRESO DE CLAVE'}
          </h2>
          <p style={{ color: '#c5c6c7', fontSize: '13px', marginBottom: '40px', lineHeight: '1.6', letterSpacing: '0.5px' }}>
            {paso === 1 
              ? 'Transmisión S.O.S. Envía tu frecuencia de radio (email) para recibir el código OTP.' 
              : 'Señal recibida. Ingresa el código de 6 dígitos y tu nueva contraseña.'}
          </p>

          <AnimatePresence mode="wait">
            {paso === 1 ? (
              <motion.form key="f1" onSubmit={enviarCodigo} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <InputProfesional 
                  label="COORDENADA DE COMUNICACIÓN" type="email" placeholder="astronauta@nasa.com" 
                  required value={email} onChange={e => setEmail(e.target.value)} icon="📧" 
                />
                <button type="submit" disabled={cargando} style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #66fcf1, #45a29e)', color: '#0b0c10', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '17px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(102, 252, 241, 0.3)', transition: '0.3s' }}>
                  {cargando ? 'TRANSMITIENDO...' : 'SOLICITAR CÓDIGO OTP'}
                </button>
              </motion.form>
            ) : (
              <motion.form key="f2" onSubmit={cambiarPassword} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <InputProfesional 
                  label="CÓDIGO DE DESBLOQUEO (6 DÍGITOS)" type="text" placeholder="------" 
                  required maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} icon="🔑" 
                  style={{ border: '2px solid #ffaa00', color: '#ffaa00', textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' }} 
                />
                <InputProfesional 
                  label="NUEVA CLAVE DE SEGURIDAD" type="password" placeholder="Mínimo 8 caracteres" 
                  required value={newPassword} onChange={e => setNewPassword(e.target.value)} icon="🔒" 
                />
                <button type="submit" disabled={cargando} style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #ffaa00, #ff4c4c)', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '17px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 170, 0, 0.3)' }}>
                  {cargando ? 'ACTUALIZANDO...' : 'RESETEAR CONTRASEÑA'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(102, 252, 241, 0.1)', paddingTop: '20px' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#45a29e', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', opacity: 0.7 }}>
              ⬅ ABORTAR MISIÓN Y VOLVER
            </button>
          </div>
        </div>
      </motion.div>

      {/* MODAL ESPACIAL (PRO) */}
      <AnimatePresence>
        {modal.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ background: '#121921', padding: '30px', borderRadius: '25px', border: `2px solid ${modal.esError ? '#ff4c4c' : '#66fcf1'}`, textAlign: 'center', maxWidth: '380px', width: '100%', boxShadow: `0 0 30px ${modal.esError ? 'rgba(255, 76, 76, 0.2)' : 'rgba(102, 252, 241, 0.2)'}` }}>
              <h3 style={{ color: modal.esError ? '#ff4c4c' : '#66fcf1', marginTop: 0, textTransform: 'uppercase' }}>{modal.esError ? '⚠️ ALERTA DE SISTEMA' : '🛰️ ÉXITO'}</h3>
              <p style={{ color: '#fff', fontSize: '16px', lineHeight: '1.5' }}>{modal.mensaje}</p>
              <button onClick={() => setModal({ ...modal, show: false })} style={{ padding: '12px 40px', background: modal.esError ? '#ff4c4c' : '#66fcf1', color: '#0b0c10', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>ENTENDIDO</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecuperarPassword;