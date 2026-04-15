import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

// Importación de Componentes
import PanelPapas from './components/PanelPapas';
import ConfigPremios from './components/ConfigPremios';
import RegistroPiloto from './components/RegistroPiloto';
import Home from './components/Home';
import Login from './components/Login';
import Registro from './components/Registro';
import RecuperarPassword from './components/RecuperarPassword';
import Footer from './components/Footer';

// --- CONFIGURACIÓN GLOBAL DE AXIOS ---
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 🌌 COMPONENTE: FONDO ESTELAR GLOBAL
// ==========================================
const FondoEstrellas = () => {
  // Genera 70 estrellas para toda la pantalla
  const estrellas = [...Array(70)].map((_, i) => (
    <motion.div
      key={i}
      style={{
        position: 'fixed',
        width: Math.random() * 3 + 'px',
        height: Math.random() * 3 + 'px',
        background: '#fff',
        borderRadius: '50%',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        boxShadow: '0 0 8px #fff, 0 0 15px #66fcf1',
        zIndex: 0, // Bien al fondo
        pointerEvents: 'none' // Para que no estorben al dar clic
      }}
      animate={{ opacity: [0, 1, 0], scale: [1, 1.3, 1] }}
      transition={{ 
        duration: Math.random() * 4 + 2, 
        repeat: Infinity, 
        ease: "easeInOut", 
        delay: Math.random() * 5 
      }}
    />
  ));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {estrellas}
    </div>
  );
};

// ==========================================
// 🚀 COMPONENTE: VISOR ESPACIAL
// ==========================================
function VisorEspacial() {
  const [progreso, setProgreso] = useState(null);
  const [premiosReales, setPremiosReales] = useState({});
  const [mostrarPremioFinal, setMostrarPremioFinal] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cargando, setCargando] = useState(true);

  const obtenerDatos = async () => {
    try {
      const resProgreso = await axios.get('https://mision-espacial-backend.onrender.com/api/progreso');
      setProgreso(resProgreso.data);
      const resPremios = await axios.get('https://mision-espacial-backend.onrender.com/api/premios');
      if (resPremios.data) setPremiosReales(resPremios.data);
      setCargando(false);
    } catch (error) { 
      console.error("Error de conexión", error); 
      setCargando(false);
    }
  };

  useEffect(() => { 
    obtenerDatos(); 
    const intervalo = setInterval(obtenerDatos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const total = progreso && progreso.total_points !== undefined ? parseInt(progreso.total_points) : 0;
  const cofreGenerico = "https://img.freepik.com/vector-premium/cofre-tesoro-cerrado-icono-juego-3d-aislado_110534-436.jpg";

  const obtenerPremioGanado = () => {
    if (total >= 48) return { img: premiosReales.prize_max_img || cofreGenerico, titulo: "🌌 ¡NUEVA GALAXIA DESCUBIERTA!" };
    if (total >= 36) return { img: premiosReales.prize_3_img || cofreGenerico, titulo: "☄️ ¡SISTEMA SOLAR CONQUISTADO!" };
    if (total >= 24) return { img: premiosReales.prize_2_img || cofreGenerico, titulo: "🪐 ¡BASE LUNAR ESTABLECIDA!" };
    if (total >= 12) return { img: premiosReales.prize_1_img || cofreGenerico, titulo: "🛸 ¡ÓRBITA ALCANZADA!" };
    return null;
  };

  const premioFinal = obtenerPremioGanado();

  const crearRutaZigZag = () => {
    const filas = [];
    for (let i = 0; i < 6; i++) {
      let fila = Array.from({ length: 8 }, (_, j) => i * 8 + j + 1);
      if (i % 2 !== 0) fila.reverse(); 
      filas.push(fila);
    }
    return filas;
  };

  if (cargando) return <div style={{ textAlign: 'center', color: '#66fcf1', marginTop: '100px', fontSize: '24px', fontWeight: 'bold', zIndex: 10, position: 'relative' }}>📡 ESCANEANDO SECTOR...</div>;

  return (
    <div style={{ position: 'relative', paddingBottom: '120px', zIndex: 10 }}>
      {mostrarPremioFinal && total >= 12 && <Confetti numberOfPieces={500} gravity={0.15} style={{ zIndex: 3000 }} />}

      <div style={{ padding: '40px 15px', textAlign: 'center' }}>
        <motion.h1 
          animate={{ scale: [1, 1.05, 1], textShadow: ["0 0 10px #66fcf1", "0 0 30px #66fcf1", "0 0 10px #66fcf1"] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ 
            color: '#66fcf1', fontSize: 'clamp(28px, 8vw, 50px)', lineHeight: '1.2', 
            margin: '0 auto', fontWeight: '900', letterSpacing: '2px', wordWrap: 'break-word', maxWidth: '95%'
          }}
        >
          RUTA DE EXPLORACIÓN
        </motion.h1>
        
        {progreso && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: 'clamp(18px, 5vw, 28px)', color: '#fff', textTransform: 'uppercase' }}>
              COMANDANTE {progreso.kid_name || 'PILOTO'}
            </h2>
            <div style={{ 
              fontSize: '40px', color: '#0b0c10', fontWeight: '900', background: '#66fcf1', 
              display: 'inline-block', padding: '10px 40px', borderRadius: '50px', 
              boxShadow: '0 0 30px #66fcf1', border: '4px solid #fff', marginTop: '10px' 
            }}>
              {total} / 48
            </div>
          </div>
        )}
      </div>

      {/* --- EL MAPA: RESTAURADO A TAMAÑO ORIGINAL CON SCROLL LATERAL PARA MÓVIL --- */}
      <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '30px' }}>
        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: '40px', 
          alignItems: 'center', minWidth: '850px', /* <-- EVITA QUE SE APLASTEN */
          margin: '0 auto', padding: '10px 20px' 
        }}>
          {crearRutaZigZag().map((fila, indiceFila) => (
            <div key={indiceFila} style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
              {fila.map((num) => {
                const esEstacion = [12, 24, 36, 48].includes(num);
                const yaPasó = num <= total;
                const esActual = (total === 0 && num === 1) || (num === total);

                return (
                  <div key={num} style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatePresence>
                      {hoveredNode === num && esEstacion && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }}
                          style={{ position: 'absolute', top: '-65px', width: '140px', background: yaPasó ? '#4caf50' : '#ffaa00', color: 'white', padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', zIndex: 300, textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }}
                        >
                          {yaPasó ? "🏆 ¡PREMIO OBTENIDO!" : `🚀 Faltan ${num - total} puntos`}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div 
                      onMouseEnter={() => setHoveredNode(num)}
                      onMouseLeave={() => setHoveredNode(null)}
                      whileHover={{ scale: 1.25, rotate: esEstacion ? 0 : 10 }}
                      style={{ 
                        width: '80px', height: '80px', /* <-- TAMAÑO ORIGINAL PERFECTO */
                        borderRadius: esEstacion ? '50%' : '45% 55% 50% 50% / 50% 45% 55% 50%', 
                        background: esEstacion 
                          ? 'radial-gradient(circle at 30% 30%, #ffcc00, #ff8c00 60%, #ff4500)' 
                          : (yaPasó ? 'radial-gradient(circle at 30% 30%, #66fcf1, #1f2833)' : '#1a1a1a'),
                        border: yaPasó ? (esEstacion ? '4px solid #fff' : '3px solid #66fcf1') : '2px solid #333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: '900', color: yaPasó ? '#fff' : '#444',
                        boxShadow: yaPasó ? `0 0 25px ${esEstacion ? 'rgba(255, 140, 0, 0.7)' : 'rgba(102, 252, 241, 0.7)'}` : 'none',
                        cursor: 'pointer', position: 'relative'
                      }}
                    >
                      {esEstacion && <div style={{ position: 'absolute', width: '120px', height: '25px', border: '4px solid rgba(255, 255, 255, 0.4)', borderRadius: '50%', transform: 'rotate(-25deg)', pointerEvents: 'none' }} />}
                      <span style={{ position: 'relative', zIndex: 2 }}>{num}</span>
                    </motion.div>

                    {/* --- ASTRONAUTA --- */}
                    {esActual && progreso && (
                      <motion.div
                        layoutId="avatarAstronauta"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, y: -72 }} 
                        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                        style={{ position: 'absolute', zIndex: 500, width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', left: '50%', transform: 'translateX(-50%)' }}
                      >
                        <motion.div animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                          <div style={{ width: '65px', height: '60px', background: '#fff', borderRadius: '50% 50% 40% 40%', position: 'relative', border: '2.5px solid #ddd', boxShadow: '0 8px 20px rgba(102, 252, 241, 0.6)' }}>
                            <div style={{ width: '50px', height: '40px', background: '#000', borderRadius: '30% 30% 45% 45%', margin: '8px auto', border: '1.5px solid #66fcf1', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {progreso.kid_photo_url ? (
                                <img src={progreso.kid_photo_url} alt="Piloto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '22px' }}>👨‍🚀</span>
                              )}
                            </div>
                          </div>
                          <div style={{ width: '44px', height: '36px', background: '#f5f5f5', borderRadius: '12px', margin: '-4px auto 0', border: '2.5px solid #ddd' }} />
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '350px' }}>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px #4caf50' }} whileTap={{ scale: 0.95 }}
          onClick={() => setMostrarPremioFinal(true)}
          style={{ width: '100%', padding: '15px 10px', background: 'linear-gradient(90deg, #4caf50, #2e7d32)', color: 'white', border: '3px solid #81c784', borderRadius: '60px', cursor: 'pointer', fontWeight: '900', fontSize: 'clamp(16px, 4vw, 20px)', letterSpacing: '1px', boxShadow: '0 10px 25px rgba(0,0,0,0.6)' }}
        >
          🏁 REVELAR PREMIO
        </motion.button>
      </div>

      <AnimatePresence>
        {mostrarPremioFinal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
            {premioFinal ? (
              <motion.div initial={{ scale: 0.6, y: 100 }} animate={{ scale: 1, y: 0 }} style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#66fcf1', fontSize: 'clamp(30px, 8vw, 55px)', textShadow: '0 0 30px #66fcf1', margin: '0' }}>{premioFinal.titulo}</h1>
                <p style={{ color: '#ffaa00', fontSize: '30px', fontWeight: '900', margin: '20px 0' }}>¡Misión Cumplida: {total} Puntos!</p>
                <img src={premioFinal.img} alt="Premio" style={{ width: '100%', maxWidth: '480px', borderRadius: '40px', border: '10px solid #66fcf1', boxShadow: '0 0 60px rgba(102, 252, 241, 0.5)' }} />
                <br />
                <button onClick={() => setMostrarPremioFinal(false)} style={{ marginTop: '50px', padding: '18px 60px', background: '#ff4c4c', color: 'white', border: 'none', borderRadius: '20px', fontSize: '22px', fontWeight: '900', cursor: 'pointer' }}>CERRAR TRANSMISIÓN</button>
              </motion.div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#ff4c4c', fontSize: '45px' }}>⚠️ ACCESO DENEGADO ⚠️</h1>
                <p style={{ color: '#fff', fontSize: '24px', maxWidth: '500px' }}>Necesitas al menos 12 puntos para desbloquear el primer cargamento de premios.</p>
                <button onClick={() => setMostrarPremioFinal(false)} style={{ marginTop: '40px', padding: '18px 50px', background: '#66fcf1', color: '#000', border: 'none', borderRadius: '15px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>VOLVER AL RADAR</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 🌌 NAVEGACIÓN GALÁCTICA
// ==========================================
function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const rutasOcultas = ['/', '/login', '/registro', '/recuperar', '/premios', '/registro-piloto'];
  if (rutasOcultas.includes(location.pathname) || !token) return null;

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={{ 
      padding: '15px', 
      background: 'transparent', // Para que se vean las estrellas globales detrás
      borderBottom: '2px solid rgba(102, 252, 241, 0.5)', 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'space-evenly', 
      alignItems: 'center',
      gap: '10px', 
      position: 'relative',
      zIndex: 100 // Por encima de las estrellas
    }}>
      <Link to="/explorar" style={{ color: '#66fcf1', textDecoration: 'none', fontSize: 'clamp(12px, 3.5vw, 16px)', fontWeight: '900', textShadow: '0 0 10px rgba(102, 252, 241, 0.5)' }}>
        🛰️ EXPLORACIÓN
      </Link>
      <Link to="/papas" style={{ color: '#ffaa00', textDecoration: 'none', fontSize: 'clamp(12px, 3.5vw, 16px)', fontWeight: '900', textShadow: '0 0 10px rgba(255, 170, 0, 0.5)' }}>
        🛠️ COMANDO
      </Link>
      <button onClick={cerrarSesion} style={{ background: 'rgba(255, 76, 76, 0.1)', border: '1px solid #ff4c4c', color: '#ff4c4c', cursor: 'pointer', borderRadius: '5px', padding: '8px 15px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: 'bold' }}>
        SALIR
      </button>
    </nav>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      {/* --- AQUÍ ESTÁ LA MAGIA: EL CONTENEDOR PRINCIPAL --- */}
      <div style={{ 
        backgroundColor: '#0b0c10', 
        background: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)', // Fondo base
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        position: 'relative' // Necesario para que las estrellas se fijen bien
      }}>
        
        {/* LAS ESTRELLAS GLOBALES ESTÁN AQUÍ */}
        <FondoEstrellas />

        {/* TODO EL CONTENIDO TIENE Z-INDEX MÁS ALTO PARA ESTAR SOBRE LAS ESTRELLAS */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Navigation />
          
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/recuperar" element={<RecuperarPassword />} />
              <Route path="/explorar" element={<ProtectedRoute><VisorEspacial /></ProtectedRoute>} />
              <Route path="/papas" element={<ProtectedRoute><PanelPapas /></ProtectedRoute>} />
              <Route path="/premios" element={<ProtectedRoute><ConfigPremios /></ProtectedRoute>} /> 
              <Route path="/registro-piloto" element={<ProtectedRoute><RegistroPiloto /></ProtectedRoute>} />
            </Routes>
          </div>

          <Footer /> 
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;