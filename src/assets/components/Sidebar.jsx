import React from "react";
import friendsIcon from "../multimedia/friends.png";
import emailIcon from "../multimedia/email.webp";
import stationIcon from "../multimedia/station.png";
import "./Sidebar.css";

const Sidebar = ({ activeSection, setActiveSection, stations, collaboratorStations }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-group">
        <button
          className={`sidebar-btn ${activeSection === "associates" ? "active" : ""}`}
          onClick={() => setActiveSection("associates")}
        >
          <img src={friendsIcon} alt="Asociados" className="icon" /> Asociados
        </button>
        <button
          className={`sidebar-btn ${activeSection === "requests" ? "active" : ""}`}
          onClick={() => setActiveSection("requests")}
        >
          <img src={emailIcon} alt="Solicitudes" className="icon" /> Solicitudes
        </button>
      </div>

      <div className="sidebar-stations">
        <h4 className="sidebar-subtitle">Propias</h4>
        <button
          className={`sidebar-btn ${activeSection === "stations" ? "active" : ""}`}
          onClick={() => setActiveSection("stations")}
        >
          <img src={stationIcon} alt="Estaciones" className="icon" /> Estaciones
        </button>
        {stations.map((station) => (
          <button
            key={station.id}
            className={`sidebar-btn station-btn ${activeSection === `station-${station.id}` ? "active" : ""}`}
            onClick={() => setActiveSection(`station-${station.id}`)}
          >
            #{station.id} {station.name}
          </button>
        ))}
      </div>
      <div className="sidebar-stations">
        <h4 className="sidebar-subtitle">Colaboraciones</h4>
        <button
          className={`sidebar-btn ${activeSection === "collaborator-stations" ? "active" : ""}`}
          onClick={() => setActiveSection("collaborator-stations")}
        >
          <img src={stationIcon} alt="Estaciones" className="icon" /> estaciones colaboradas
        </button>
        {collaboratorStations.map((station) => (
          <button
            key={`collab-${station.id}`}
            className={`sidebar-btn station-btn ${activeSection === `collab-station-${station.id}` ? "active" : ""}`}
            onClick={() => setActiveSection(`collab-station-${station.id}`)}
          >
            #{station.id} {station.name} (de {station.owner?.username || 'owner'})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;