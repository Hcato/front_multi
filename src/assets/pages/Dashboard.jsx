import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Content from "../Content/Content.jsx";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("stations");
  const [stations, setStations] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [collaboratorStations, setCollaboratorStations] = useState([]);

  return (
    <div className="dashboard">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        stations={stations} 
        collaboratorStations={collaboratorStations}
      />
      <Content
        activeSection={activeSection}
        associates={associates}
        setAssociates={setAssociates}
        requests={requests}
        setRequests={setRequests}
        stations={stations}
        setStations={setStations}
        collaboratorStations={collaboratorStations}
        setCollaboratorStations={setCollaboratorStations}
      />
    </div>
  );
};

export default Dashboard;