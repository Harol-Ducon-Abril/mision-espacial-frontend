import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  // --- ESTILOS DE FANTASÍA GALÁCTICA ---
  const starContainerStyle = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', // Las estrellas no bloquean clics
    zIndex: 0 // Detrás del texto
  };

  // Generador de estrellas aleatorias
  const createStars = (num) => {
    return [...Array(num)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 3 + 'px',
          height: Math.random() * 3 + 'px',
          background: '#fff',
          borderRadius: '50%',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          boxShadow: '0 0 10px #fff, 0 0 20px #66fcf1',
        }}
        animate={{
          opacity: [0, 1, 0], // Parpadeo
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5 // Retraso aleatorio para que no parpadeen todas a la vez
        }}
      />
    ));
  };

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
      overflowX: 'hidden',
      position: 'relative' // Necesario para posicionar las estrellas absolutas
    }}>
      
      {/* --- FONDO DE ESTRELLAS PARPADEANTES --- */}
      <div style={starContainerStyle}>
        {createStars(50)} {/* Crea 50 estrellas parpadeantes */}
      </div>

      {/* --- TÍTULO GALÁCTICO RESPONSIVO --- */}
      <motion.h1 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          color: '#66fcf1', 
          fontSize: 'clamp(28px, 8vw, 50px)', 
          // Efecto de resplandor (Glow) mejorado
          textShadow: '0 0 10px #66fcf1, 0 0 20px #66fcf1, 0 0 40px #fff', 
          textAlign: 'center',
          lineHeight: '1.2',
          maxWidth: '900px',
          margin: '0 auto 20px auto',
          position: 'relative', // Para estar sobre las estrellas
          zIndex: 1
        }}
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, 0] }} // Animación sutil del cohete
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block', marginRight: '15px' }}
        >
          🚀
        </motion.span>
        EL VIAJE DE UN NIÑO ESTRELLA
      </motion.h1>
      
      {/* --- BLOQUE DE TEXTO --- */}
      <div style={{ 
        maxWidth: '700px', 
        textAlign: 'center', 
        fontSize: 'clamp(15px, 4vw, 17px)', 
        lineHeight: '1.8', 
        color: '#c5c6c7', 
        margin: '20px auto 40px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '0 15px',
        position: 'relative',
        zIndex: 1
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
        flexWrap: 'wrap', 
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1 
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
            boxShadow: '0 0 20px rgba(102, 252, 241, 0.5)' // Resplandor en el botón
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