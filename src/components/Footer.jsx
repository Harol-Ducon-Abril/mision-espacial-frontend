import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '30px 0',
      backgroundColor: '#0b0c10',
      borderTop: '1px solid #1f2833',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <p style={{
          color: '#45a29e',
          fontSize: '14px',
          letterSpacing: '2px',
          margin: 0,
          fontWeight: '300',
          textTransform: 'uppercase'
        }}>
          Plataforma de Entrenamiento Espacial – Programa de Mejora Académica
        </p>
        
        <div style={{
          height: '1px',
          width: '50px',
          background: 'linear-gradient(90deg, transparent, #66fcf1, transparent)',
          margin: '5px 0'
        }}></div>

        <p style={{
          color: '#66fcf1',
          fontSize: '16px',
          margin: 0,
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(102, 252, 241, 0.3)'
        }}>
          Arquitectura y Desarrollo por: <span style={{ color: '#fff', letterSpacing: '1px' }}>Harold Ducon</span>
        </p>
        
        <p style={{
          color: '#1f2833',
          fontSize: '10px',
          marginTop: '10px',
          letterSpacing: '3px'
        }}>
          &copy; 2026 PLATAFORMA DE MISION ESPACIAL - TODOS LOS DERECHOS RESERVADOS
        </p>
      </div>
    </footer>
  );
};

export default Footer;