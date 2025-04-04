import React, { useState, useEffect, useCallback } from "react";
import MapWrapper from "../components/MapWrapper.jsx";
import { useNavigate } from 'react-router-dom';
import { getStationsWithCollaborators, getCollaborationRequests, updateCollaborationRequest, getUserByToken, createCollaborationRequest, getStationWithOwner, getCollaboratorStations} from "../../Api.js";
import { getTokenOnly } from "../../firebase-config";
import { NotificationOverlay } from "../components/NotificationOverlay.jsx";
import { NotificationProvider } from "../scripts/ContextNotification.jsx";
import { Toaster } from "react-hot-toast";
import Nav from "../components/navUp_app.jsx";
import friendsIcon from "../multimedia/friends.png";
import emailIcon from "../multimedia/email.webp";
import stationIcon from "../multimedia/station.png";
import "./User_Page.css";

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

const Content = ({ activeSection, associates, setAssociates, requests, setRequests, stations, setStations, collaboratorStations, setCollaboratorStations }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stationIdInput, setStationIdInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getTokenOnly();
      if (!token) throw new Error("Token no disponible");

      const userData = await getUserByToken(token);
      if (!userData) throw new Error("No se pudo obtener información del usuario");

      const collaboratorStationsData = await getCollaboratorStations(userData.id);
      setCollaboratorStations(collaboratorStationsData || []);
        // Usamos el nuevo endpoint que trae estaciones con colaboradores
      const stationsWithCollabs = await getStationsWithCollaborators(userData.id);
      setStations(stationsWithCollabs || []);
        if (activeSection === "associates") {
        // Procesamos los colaboradores para mantener compatibilidad
        const allAssociates = [];
        if (stationsWithCollabs) {
          stationsWithCollabs.forEach(station => {
            if (station.collaborators && station.collaborators.length > 0) {
              allAssociates.push(...station.collaborators.map(c => ({
                ...c,
                stationId: station.id,
                stationName: station.name,
                user: {
                  id: c.user_id,
                  username: c.username,
                  image: c.image
                }
              })));
            }
          });
        }
        setAssociates(allAssociates);
      } else if (activeSection === "requests") {
        // Para solicitudes, mantenemos la lógica original
        const userStations = await getStationsWithCollaborators(userData.id);
        setStations(userStations || []);

        if (userStations && userStations.length > 0) {
          const allRequests = [];
          for (const station of userStations) {
            const stationRequests = await getCollaborationRequests(station.id);
            if (stationRequests && stationRequests.length > 0) {
              allRequests.push(...stationRequests.map(r => ({
                ...r,
                stationId: station.id,
                stationName: station.name
              })));
            }
          }
          setRequests(allRequests);
        } else {
          setRequests([]);
        }
      } else if (activeSection === "stations") {
        const data = await getStationsWithCollaborators(userData.id);
        setStations(data || []);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeSection, setAssociates, setRequests, setStations, setCollaboratorStations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendRequest = async () => {
    if (!stationIdInput) {
      console.log("[DEBUG] stationIdInput está vacío");
      return;
    }
    
    console.log("[DEBUG] Iniciando handleSendRequest");
    setIsSending(true);
    setError(null);
    setSendSuccess(false);
    
    try {
      console.log("[DEBUG] Obteniendo token...");
      const token = await getTokenOnly();
      if (!token) throw new Error("Token no disponible");
      
      console.log("[DEBUG] Obteniendo datos de usuario...");
      const userData = await getUserByToken(token);
      if (!userData) throw new Error("No se pudo obtener información del usuario");
  
      console.log("[DEBUG] Enviando solicitud para estación ID:", stationIdInput);
      await createCollaborationRequest(stationIdInput, userData.id);
      
      console.log("[DEBUG] Llamando a getStationWithOwner...");
      try {
        const stationData = await getStationWithOwner(stationIdInput);
        console.log("[DEBUG] Datos completos recibidos:", stationData);
      } catch (err) {
        console.error("[DEBUG] Error al obtener datos de estación:", err);
      }
      
      setSendSuccess(true);
      setStationIdInput('');
      console.log("[DEBUG] Refrescando datos...");
      await fetchData();
      
    } catch (err) {
      console.error("[DEBUG] Error completo en handleSendRequest:", err);
      setError(err.message);
    } finally {
      console.log("[DEBUG] Finalizando handleSendRequest");
      setIsSending(false);
    }
  };
  
  const handleRequestUpdate = async (requestId, status) => {
    try {
      await updateCollaborationRequest(requestId, status);
      setRequests(prev => prev.filter(request => request.id !== requestId));
      
      if (status === "accepted") {
        fetchData(); // Refrescar los datos después de aceptar
      }
    } catch (err) {
      console.error("Error al actualizar solicitud:", err);
      setError(err.message);
    }
  };

  if (loading) return <div className="content"><p>Cargando...</p></div>;
  if (error) return <div className="content"><p className="error">Error: {error}</p></div>;

  return (
    <div className="content">
      {activeSection.startsWith('station-') && (
        (() => {
          const stationId = activeSection.replace('station-', '');
          const station = stations.find(s => s.id.toString() === stationId);
          
          return station ? (
            <div className="station-detail-container">
              {/* Sección del mapa (3/4 del espacio) */}
              <div className="station-map-section">
                <h2 className="station-title">Ubicación de {station.name}</h2>
                <div className="map-container">
                  <MapWrapper 
                    latitude={station.latitude} 
                    longitude={station.longitude} 
                    stationName={station.name}
                  />
                </div>
              </div>
              
              {/* Sección de información (1/4 del espacio) */}
              <div className="station-info-section">
                <div className="station-info-card">
                  <h3>Información de la Estación</h3>
                  <p><strong>ID:</strong> {station.id}</p>
                  <p><strong>Plan:</strong> {station.plan || 'No especificado'}</p>
                  <p><strong>Coordenadas:</strong></p>
                  <p>Latitud: {station.latitude}</p>
                  <p>Longitud: {station.longitude}</p>
                  <p><strong>Dueño:</strong> ID {station.owner_id}</p>
                  
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
                </div>
                <button 
                 onClick={() => navigate(`/graphics/${station.id}`)}
                  className="view-graphics-btn"
                 >
                 Ver Gráficos
                </button>
              </div>
            </div>
          ) : (
            <p>Estación no encontrada</p>
          );
        })()
      )}

{activeSection.startsWith('collab-station-') && (
        (() => {
          const stationId = activeSection.replace('collab-station-', '');
          const station = collaboratorStations.find(s => s.id.toString() === stationId);
          
          return station ? (
            <div className="station-detail-container">
              <div className="station-map-section">
                <h2 className="station-title">Ubicación de {station.name} (Colaborador)</h2>
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
                  <p><strong>Dueño:</strong> {station.owner?.username || 'ID '+station.owner_id}</p>
                  {station.owner?.image && (
                    <img 
                      src={station.owner.image} 
                      alt={station.owner.username} 
                      className="owner-img" 
                    />
                  )}
                </div>
                <button 
                 onClick={() => navigate(`/graphics/${station.id}`)}
                  className="view-graphics-btn"
               >
               Ver Gráficos
              </button>
              </div>
            </div>
          ) : (
            <p>Estación no encontrada</p>
          );
        })()
      )}

      {/* Nueva sección para listar todas las estaciones colaboradas */}
      {activeSection === "collaborator-stations" && (
          collaboratorStations && collaboratorStations.length > 0 ? (
          <div className="stations-list-container">
            <ul className="stations-list">
              {collaboratorStations.map((station) => (
                <li key={`collab-${station.id}`} className="station-item">
                  <h3>{station.name} (de {station.owner?.username || 'owner'})</h3>
                  <p>ID: {station.id}</p>
                  <p>Plan: {station.plan || 'No especificado'}</p>
                  <p>Ubicación: Lat {station.latitude}, Long {station.longitude}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No colaboras en ninguna estación actualmente.</p>
        )
      )}

      {/* El resto de tus condiciones (associates, requests, stations) se mantienen igual */}
      {!activeSection.startsWith('station-') && (
        <>
          {activeSection === "associates" && (
            stations.length > 0 ? (
              <div className="stations-collaborators-container">
                {stations.map((station) => (
                  <div key={station.id} className="station-collaborators">
                    <h3 className="station-title">
                      Estación: {station.name} (Plan: {station.plan || 'No especificado'})
                    </h3>
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
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes estaciones registradas.</p>
            )
          )}
          
          {activeSection === "requests" && (
            <div className="requests-container">
              {/* Formulario para enviar nuevas solicitudes */}
              <div className="send-request-section">
                <h3>Enviar solicitud de colaboración</h3>
                <div className="request-form">
                  <input
                    type="number"
                    value={stationIdInput}
                    onChange={(e) => setStationIdInput(e.target.value)}
                    placeholder="ID de la estación"
                    className="request-input"
                  />
                  <button
                    onClick={handleSendRequest}
                    disabled={!stationIdInput || isSending}
                    className={`send-request-btn ${!stationIdInput ? 'disabled' : ''}`}
                  >
                    {isSending ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </div>
                
                {sendSuccess && (
                  <p className="success-message">¡Solicitud enviada con éxito!</p>
                )}
                
                {error && (
                  <p className="error-message">Error: {error}</p>
                )}
              </div>

              {/* Lista de solicitudes recibidas */}
              <div className="requests-list-section">
                <h3>Solicitudes recibidas</h3>
                {requests.length > 0 ? (
                  <ul className="requests-list">
                    {requests.map((request) => (
                      <li key={request.id} className="request-item">
                        <div className="request-info">
                          <img 
                            src={request.user?.image || "default-user.png"} 
                            alt={request.user?.username} 
                            className="user-img" 
                          />
                          <div>
                            <p>{request.user?.username || 'Usuario desconocido'} quiere unirse a {request.stationName}</p>
                            <small>Solicitud ID: {request.id}</small>
                          </div>
                        </div>
                        <div className="request-buttons">
                          <button 
                            className="accept-btn"
                            onClick={() => handleRequestUpdate(request.id, "accepted")}
                          >
                            Aceptar
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleRequestUpdate(request.id, "rejected")}
                          >
                            Rechazar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tienes solicitudes pendientes.</p>
                )}
              </div>
            </div>
          )}

          {activeSection === "stations" && (
            stations.length > 0 ? (
              <ul className="stations-list">
                {stations.map((station) => (
                  <li key={station.id} className="station-item">
                    <h3>{station.name}</h3>
                    <p>ID: {station.id}</p>
                    <p>Plan: {station.plan || 'No especificado'}</p>
                    <p>Ubicación: Lat {station.latitude}, Long {station.longitude}</p>
                    <p>Colaboradores: {station.collaborators?.length || 0}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes estaciones registradas.</p>
            )    
          )}
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("stations");
  const [stations, setStations] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [collaboratorStations, setCollaboratorStations] = useState([])

  return (
    <NotificationProvider>
      <NotificationOverlay/>
      <Nav/>
      <Toaster position="top-right" reverseOrder={false} />
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
    </NotificationProvider>
  );
};

export default Dashboard;