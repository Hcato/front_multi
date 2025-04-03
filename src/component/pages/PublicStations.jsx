// pages/PublicStations.jsx
import React, { useEffect, useState } from 'react';
// import stationService from '../services/stationService';

const PublicStations = () => {
  const [publicStations, setPublicStations] = useState([]);

  useEffect(() => {
    // stationService.getPublicStations().then(data => setPublicStations(data));
    // Simulando datos:
    setPublicStations([
      { id: 10, name: 'Estación Pública 1' },
      { id: 11, name: 'Estación Pública 2' },
    ]);
  }, []);

  return (
    <div>
      <h2>Estaciones Públicas</h2>
      <ul>
        {publicStations.map(station => (
          <li key={station.id}>
            {station.name}
            {/* Podrías mostrar ubicación en un mapa si gustas */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicStations;
