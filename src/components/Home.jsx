import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle, #1b2735 0%, #090a0f 100%)', 
      color: '#fff', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      overflowX: 'hidden' // Evita scroll horizontal innecesario
    }}>
      
      {/* --- TÍTULO RESPONSIVO --- */}
      <motion.h1 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          color: '#66fcf1', 
          // fontSize dinámico: mínimo 28px, ideal 8% del ancho de pantalla, máximo 50px
          fontSize: 'clamp(28px, 8vw, 50px)', 
          textShadow: '0 0 20px #66fcf1', 
          textAlign: 'center',
          lineHeight: '1.2', // Evita que las líneas se monten
          maxWidth: '900px',
          margin: '0 auto 20px auto'
        }}
      >
        🚀 EL VIAJE DE UN NIÑO ESTRELLA
      </motion.h1>
      
      {/* --- BLOQUE DE TEXTO --- */}
      <div style={{ 
        maxWidth: '700px', 
        textAlign: 'center', 
        fontSize: 'clamp(15px, 4vw, 17px)', // Texto también un poco flexible
        lineHeight: '1.8', 
        color: '#c5c6c7', 
        margin: '20px auto 40px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '0 15px'
      }}>
        <span>Esta plataforma transforma las actividades escolares en retos espaciales donde cada tarea completada se convierte en un paso más hacia convertirse en un verdadero explorador estelar.</span>
        
        <span>A través de un sistema de evaluación sencillo, el niño podrá ganar Astro-Puntos según su desempeño diario. Estos puntos se acumulan y permiten avanzar en la misión, subir de nivel y desbloquear recompensas.</span>
        
        <span>El progreso se traduce en logros visibles, fomentando la disciplina, la constancia y el sentido de responsabilidad en un vínculo directo entre el esfuerzo y la gratificación.</span>

        <span style={{ fontSize: '1.2rem', color: '#66fcf1', marginTop: '10px', fontWeight: 'bold' }}>
          🚀 ¡La aventura educativa comienza aquí! ✨
        </span>
      </div>

      {/* --- BOTONES RESPONSIVOS --- */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap', // Si no caben, se ponen uno debajo del otro
        justifyContent: 'center' 
      }}>
        <button 
          onClick={() => navigate('/login')} 
          style={{ 
            padding: '15px 30px', 
            background: '#66fcf1', 
            color: '#0b0c10', 
            border: 'none', 
            borderRadius: '50px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontSize: '16px',
            boxShadow: '0 0 15px rgba(102, 252, 241, 0.3)'
          }}
        >
          INGRESAR A LA NAVE
        </button>
        <button 
          onClick={() => navigate('/registro')} 
          style={{ 
            padding: '15px 30px', 
            background: 'transparent', 
            color: '#66fcf1', 
            border: '2px solid #66fcf1', 
            borderRadius: '50px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontSize: '16px' 
          }}
        >
          REGISTRAR FAMILIA
        </button>
      </div>
    </div>
  );
};

export default Home;