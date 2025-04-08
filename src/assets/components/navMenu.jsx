import React from "react";
import "./Cloudy.css";
import background from "../multimedia/maps.png";
import Navbar from "./Navbar";

const CloudyHome = () => {
  return (
    <div className="cloudy-container" style={{ backgroundImage: `url(${background})` }}>
      <Navbar />

      <main className="cloudy-content">
        <h1>Un servicio meteorológico de lo más accesible</h1>
        <p>
          Cloudy es una plataforma perfecta donde ver datos meteorológicos de manera precisa y exacta de la región que se disponga.
        </p>
      </main>

      <footer className="cloudy-footer">
        *Actualmente disponible en la zona sur de México.
      </footer>
    </div>
  );
};

export default CloudyHome;
