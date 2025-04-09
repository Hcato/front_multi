import React from 'react';
import styles from './CollaboratorStation.css';

const CollaboratorStations = ({ collaboratorStations }) => {
  return (
    <div className={styles.container}>
      <h2>Estaciones donde colaboro</h2>
      <ul className={styles.list}>
        {collaboratorStations.map((station) => (
          <li key={`collab-${station.id}`} className={styles.item}>
            <h3>{station.name} (de {station.owner?.username || 'owner'})</h3>
            <p>ID: {station.id}</p>
            <p>Plan: {station.plan || 'No especificado'}</p>
            <p>Ubicación: Lat {station.latitude}, Long {station.longitude}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorStations;