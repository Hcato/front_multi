import React from "react";
import "./Plans.css";
import background from "../multimedia/maps.png";
import Navbar from "../components/Navbar.jsx";

const Plans = () => {
  return (
    <div className="plans-container" style={{ backgroundImage: `url(${background})` }}>
      <Navbar />
      <main className="plans-content">
        <div className="plan-card">
          <h2>Básico</h2>
          <ul>
            <li>#1 Instalacion, configuración y acceso al equipo meteorológico.</li>
            <li>#2 Compartir el acceso a un máximo de 10 personas.</li>
            <li>#3 Un mes de garantía</li>
          </ul>
          <div className="plan-price">$399</div>
        </div>

        <div className="plan-card">
          <h2>Básico +</h2>
          <ul>
            <li>#1 Todo lo del plan Básico.</li>
            <li>#2 Aumente la cantidad de personas a un maximo de 100 para el acceso a tu estación.</li>
            <li>#3 La garantía aumenta a un año.</li>
          </ul>
          <div className="plan-price">$899</div>
        </div>
      </main>

      <footer className="plans-footer">
        *Actualmente disponible en la zona sur de México.
      </footer>
    </div>
  );
};

export default Plans;
