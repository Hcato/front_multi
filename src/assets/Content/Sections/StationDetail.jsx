import React from "react";
import MapWrapper from "../../components/MapWrapper.jsx";

const StationDetail = ({ station, isCollaborator = false }) => {
  return (
    <div className="station-detail-container">
      <div className="station-map-section">
        <h2 className="station-title">
          Ubicación de {station.name} {isCollaborator && "(Colaborador)"}
        </h2>
        <div className="map-container">
          <MapWrapper 
            latitude={station.latitude} 
            longitude={station.longitude} 
            stationName={station.name}
          />
        </div>
      </div>
      
      <div className="station-info-section">
        <div className="station-info-card">
          <h3>Información de la Estación</h3>
          <p><strong>ID:</strong> {station.id}</p>
          <p><strong>Plan:</strong> {station.plan || 'No especificado'}</p>
          <p><strong>Coordenadas:</strong></p>
          <p>Latitud: {station.latitude}</p>
          <p>Longitud: {station.longitude}</p>
          <p><strong>Dueño:</strong> {station.owner?.username || `ID ${station.owner_id}`}</p>
          
          {station.owner?.image && (
            <img 
              src={station.owner.image} 
              alt={station.owner.username} 
              className="owner-img" 
            />
          )}
          
          {!isCollaborator && (
            <>
              <h4 className="collaborators-title">Colaboradores ({station.collaborators?.length || 0})</h4>
              
              {station.collaborators && station.collaborators.length > 0 ? (
                <ul className="collaborators-list">
                  {station.collaborators.map((collaborator) => (
                    <li key={`${collaborator.id}-${station.id}`} className="collaborator-item">
                      <div className="collaborator-info">
                        <img 
                          src={collaborator.image || "default-user.png"} 
                          alt={collaborator.username} 
                          className="user-img" 
                        />
                        <div>
                          <p>{collaborator.username || 'Usuario desconocido'}</p>
                          <small>ID: {collaborator.id}</small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-collaborators">No hay colaboradores en esta estación</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationDetail;