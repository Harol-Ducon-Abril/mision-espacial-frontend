import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const RegistroPiloto = () => {
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState('');
  const [pilotos, setPilotos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: '' });
  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({ show: false, type: '', pilot: null });
  const [nuevoNombre, setNuevoNombre] = useState('');

  const lanzarAviso = (mensaje, tipo = 'exito') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
  };

  const cargarPilotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pilotos');
      setPilotos(Array.isArray(res.data) ? res.data : []);
    } catch (error) { 
      console.error("Error cargando hangar", error); 
    }
  };

  useEffect(() => { cargarPilotos(); }, []);

  const registrar = async () => {
    if (!nombre || !foto) return lanzarAviso("⚠️ Faltan coordenadas (Nombre/Foto)", "error");
    setCargando(true);
    try {
      await axios.post('http://localhost:5000/api/registrar-piloto', { kid_name: nombre, kid_photo_url: foto });
      setNombre(''); 
      setFoto(''); 
      await cargarPilotos();
      lanzarAviso("🚀 ¡NUEVO PILOTO RECLUTADO CON ÉXITO!", "exito");
    } catch (error) { 
      lanzarAviso("❌ FALLA EN EL REGISTRO", "error"); 
    } finally { setCargando(false); }
  };

  const confirmarAccion = async () => {
    const { type, pilot } = modalConfig;
    try {
      if (type === 'borrar') {
        await axios.delete(`http://localhost:5000/api/pilotos/${pilot.id}`);
        lanzarAviso(`🗑️ PILOTO ${pilot.kid_name.toUpperCase()} ELIMINADO`);
      } else if (type === 'editar') {
        await axios.put(`http://localhost:5000/api/pilotos/${pilot.id}`, { kid_name: nuevoNombre });
        lanzarAviso("✏️ DATOS DE VUELO ACTUALIZADOS");
      }
      await cargarPilotos();
      cerrarModal();
    } catch (error) { lanzarAviso("❌ ERROR EN LA OPERACIÓN", "error"); }
  };

  const abrirModal = (e, type, pilot) => {
    e.stopPropagation();
    setNuevoNombre(pilot.kid_name);
    setModalConfig({ show: true, type, pilot });
  };

  const cerrarModal = () => setModalConfig({ show: false, type: '', pilot: null });

  const seleccionar = async (id) => {
    try {
      await axios.post('http://localhost:5000/api/seleccionar-piloto', { id });
      navigate('/explorar'); 
    } catch (error) { lanzarAviso("⚠️ ERROR DE ACTIVACIÓN", "error"); }
  };

  const manejarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return lanzarAviso("⚠️ ARCHIVO MUY PESADO (MÁX 2MB)", "error");
      const reader = new FileReader();
      reader.onloadend = () => setFoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0c10', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflowX: 'hidden' }}>
      
      {/* NOTIFICACIÓN EMERGENTE */}
      <AnimatePresence>
        {notificacion.show && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }}
            style={{ 
              position: 'fixed', top: '20px', zIndex: 9999,
              background: notificacion.tipo === 'error' ? '#ff4c4c' : '#66fcf1',
              color: '#0b0c10', padding: '15px 30px', borderRadius: '50px',
              fontWeight: '900', boxShadow: '0 0 20px rgba(102, 252, 241, 0.4)',
              border: '2px solid #fff', fontSize: '14px'
            }}
          >
            {notificacion.mensaje}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN VOLVER CENTRADO */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/papas')} 
          style={{ padding: '12px 25px', background: 'transparent', color: '#45a29e', border: '2px solid #45a29e', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', transition: '0.3s' }}
          onMouseEnter={(e) => { e.target.style.color = '#66fcf1'; e.target.style.borderColor = '#66fcf1'; }}
          onMouseLeave={(e) => { e.target.style.color = '#45a29e'; e.target.style.borderColor = '#45a29e'; }}
        >
          ⬅ Regresar al Centro de Mando
        </button>
      </div>

      <div style={{ maxWidth: '850px', width: '100%', padding: '40px', backgroundColor: '#121921', borderRadius: '40px', border: '2px solid #66fcf1', color: '#fff', boxShadow: '0 0 40px rgba(102, 252, 241, 0.15)' }}>
        <h2 style={{ color: '#66fcf1', textAlign: 'center', fontSize: '32px', fontWeight: '900', marginBottom: '40px', letterSpacing: '3px', textShadow: '0 0 10px rgba(102, 252, 241, 0.5)' }}>👨‍🚀 ACADEMIA DE PILOTOS</h2>
        
        {/* REGISTRO */}
        <div style={{ background: 'rgba(11, 12, 16, 0.8)', padding: '30px', borderRadius: '25px', border: '1px solid #45a29e', marginBottom: '50px' }}>
          <h3 style={{ marginTop: 0, color: '#45a29e', textAlign: 'center', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', marginBottom: '25px' }}>Iniciar Reclutación</h3>
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center' }}>
            <input type="text" placeholder="Identificador del Recluta (Nombre)" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '15px', background: '#1f2833', border: '1px solid #45a29e', color: '#fff', outline: 'none', fontSize: '16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'center' }}>
                <input type="file" accept="image/*" id="foto-input" onChange={manejarFoto} style={{ display: 'none' }} />
                <label htmlFor="foto-input" style={{ padding: '10px 20px', background: '#0b0c10', border: '1px dashed #66fcf1', borderRadius: '10px', color: '#66fcf1', cursor: 'pointer', fontSize: '12px' }}>
                    {foto ? '📷 FOTO CARGADA' : '📁 SELECCIONAR AVATAR'}
                </label>
                {foto && <img src={foto} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #66fcf1', objectFit: 'cover' }} alt="Preview" />}
            </div>
            <button onClick={registrar} disabled={cargando} style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #66fcf1, #45a29e)', border: 'none', borderRadius: '15px', color: '#0b0c10', fontWeight: '900', cursor: 'pointer', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {cargando ? 'PROCESANDO DATOS...' : 'ENROLAR EN LA FLOTA ➔'}
            </button>
          </div>
        </div>

        {/* LISTA */}
        <h3 style={{ color: '#66fcf1', textAlign: 'center', marginBottom: '35px', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '18px' }}>🛰️ Hangar de Misión</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          {pilotos.length > 0 ? pilotos.map(p => (
            <motion.div key={p.id} whileHover={{ scale: 1.05 }} onClick={() => seleccionar(p.id)} style={{ cursor: 'pointer', padding: '25px', width: '210px', borderRadius: '35px', background: p.is_active ? 'rgba(102, 252, 241, 0.1)' : '#0b0c10', border: p.is_active ? '3px solid #66fcf1' : '1px solid #1f2833', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={p.kid_photo_url || 'https://via.placeholder.com/150'} alt={p.kid_name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: p.is_active ? '3px solid #66fcf1' : '1px solid #45a29e', marginBottom: '15px' }} />
              <div style={{ fontWeight: '900', fontSize: '16px', textTransform: 'uppercase', color: p.is_active ? '#66fcf1' : '#fff', textAlign: 'center' }}>{p.kid_name}</div>
              {p.is_active && <div style={{ fontSize: '10px', color: '#66fcf1', marginTop: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>● ESTADO: ACTIVO</div>}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={(e) => abrirModal(e, 'editar', p)} style={{ background: '#ffaa00', border: 'none', borderRadius: '8px', fontSize: '10px', padding: '8px 12px', cursor: 'pointer', fontWeight: '900', color: '#000' }}>EDITAR</button>
                <button onClick={(e) => abrirModal(e, 'borrar', p)} style={{ background: '#ff4c4c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px', padding: '8px 12px', cursor: 'pointer', fontWeight: '900' }}>BORRAR</button>
              </div>
            </motion.div>
          )) : (
            <p style={{ color: '#45a29e', textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>No hay pilotos registrados. Inicia la secuencia de reclutación arriba.</p>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <AnimatePresence>
        {modalConfig.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000 }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ background: '#121921', padding: '40px', borderRadius: '35px', border: '2px solid #66fcf1', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
              <h3 style={{ color: modalConfig.type === 'borrar' ? '#ff4c4c' : '#ffaa00', textTransform: 'uppercase', letterSpacing: '2px' }}>{modalConfig.type === 'borrar' ? '⚠️ Confirmar Baja' : '✏️ Editar Registro'}</h3>
              <p style={{ color: '#fff', fontSize: '16px', margin: '20px 0', lineHeight: '1.5' }}>{modalConfig.type === 'borrar' ? `¿Estás seguro de desvincular al piloto ${modalConfig.pilot.kid_name.toUpperCase()}?` : 'Ingresa el nuevo identificador:'}</p>
              {modalConfig.type === 'editar' && <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '15px', background: '#0b0c10', color: '#fff', border: '1px solid #66fcf1', outline: 'none', marginBottom: '25px', textAlign: 'center', fontSize: '18px' }} />}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={cerrarModal} style={{ padding: '12px 25px', background: '#1f2833', color: '#fff', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>CANCELAR</button>
                <button onClick={confirmarAccion} style={{ padding: '12px 25px', background: modalConfig.type === 'borrar' ? '#ff4c4c' : '#66fcf1', color: '#0b0c10', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>CONFIRMAR</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistroPiloto;