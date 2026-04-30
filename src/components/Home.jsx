import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle, #1b2735 0%, #090a0f 100%)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.h1 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ color: '#66fcf1', fontSize: '50px', textShadow: '0 0 20px #66fcf1', textAlign: 'center' }}
      >
        🚀 EL VIAJE DE UN NIÑO ESTRELLA
      </motion.h1>
      
    <div style={{ 
  maxWidth: '700px', // Un poco más ancho para mejor lectura
  textAlign: 'center', 
  fontSize: '17px', 
  lineHeight: '1.8', 
  color: '#c5c6c7', 
  margin: '40px auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px' // <--- ESTO DA EL ESPACIO AUTOMÁTICO ENTRE PÁRRAFOS
}}>
  <span>Esta plataforma transforma las actividades escolares en retos espaciales donde cada tarea completada se convierte en un paso más hacia convertirse en un verdadero explorador estelar.</span>
  
  <span>A través de un sistema de evaluación sencillo, el niño podrá ganar Astro-Puntos según su desempeño diario. Estos puntos se acumulan y permiten avanzar en la misión, subir de nivel y desbloquear recompensas.</span>
  
  <span>El progreso se traduce en logros visibles, fomentando la disciplina, la constancia y el sentido de responsabilidad en un vínculo directo entre el esfuerzo y la gratificación.</span>

  <span style={{ fontSize: '20px', color: '#66fcf1', marginTop: '10px' }}>🚀 ¡La aventura educativa comienza aquí! ✨</span>
</div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <button onClick={() => navigate('/login')} style={{ padding: '15px 30px', background: '#66fcf1', color: '#0b0c10', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          INGRESAR A LA NAVE
        </button>
        <button onClick={() => navigate('/registro')} style={{ padding: '15px 30px', background: 'transparent', color: '#66fcf1', border: '2px solid #66fcf1', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          REGISTRAR FAMILIA
        </button>
      </div>
    </div>
  );
};

export default Home;