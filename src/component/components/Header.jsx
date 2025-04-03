import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/multimedia/Nuve.png';
import backgroundImage from '../../assets/multimedia/Maps.jpg';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header-hero-wrapper">
      {/* Sección del Header */}
      <header className="header-container">
        <div className="header-content">
          <div className="logo">
            <img src={logoImage} alt="logo" className="logo-image" />
            <span>Cloudy</span>
          </div>
          <nav className="nav">
            <a 
              onClick={(e) => {
                e.preventDefault();
                navigate('/plans');
              }} 
              href="/plans" 
              className="nav-link" // Mantiene la clase original
            >
              Planes
            </a>
            <a href="#soporte" className="nav-link">Soporte técnico</a>
            <button 
              onClick={() => navigate('/login')} 
              className="login-btn"
            >
              Abrir Cloudy
            </button>
          </nav>
        </div>
      </header>

      {/* Sección Hero */}
      <section className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Un servicio meteorológico de lo más accesible</h1>
          <p>
            Cloudy es una plataforma perfecta donde ver datos meteorológicos de
            manera precisa y exacta de la región que se disponga.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Header;