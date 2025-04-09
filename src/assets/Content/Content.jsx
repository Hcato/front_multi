import React, { useState, useEffect, useCallback } from "react";
import { 
  getStationsWithCollaborators, 
  getCollaborationRequests, 
  updateCollaborationRequest, 
  getUserByToken, 
  createCollaborationRequest, 
  getStationWithOwner, 
  getCollaboratorStations
} from "../../Api.js";
import { getTokenOnly } from "../../firebase-config.js";
import StationDetail from "../Content/Sections/StationDetail.jsx";
import CollaboratorStations from "../Content/sections/CollaboratorStations";
import Associates from "../Content/sections/Associates";
import Requests from "../Content/sections/Requests";
import Stations from "../Content/Sections/StationDetail.jsx";
import "./Content.css";

const Content = ({ 
  activeSection, 
  associates, 
  setAssociates, 
  requests, 
  setRequests, 
  stations, 
  setStations, 
  collaboratorStations, 
  setCollaboratorStations 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stationIdInput, setStationIdInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

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

  // Extraer ID de estación si es una sección de detalle
  const getStationId = (prefix) => activeSection.replace(`${prefix}-`, '');
  
  return (
    <div className="content">
      {activeSection.startsWith('station-') && (
        <StationDetail 
          station={stations.find(s => s.id.toString() === getStationId('station'))} 
        />
      )}
      
      {activeSection.startsWith('collab-station-') && (
        <StationDetail 
          station={collaboratorStations.find(s => s.id.toString() === getStationId('collab-station'))} 
          isCollaborator 
        />
      )}

      {activeSection === "collaborator-stations" && (
        <CollaboratorStations collaboratorStations={collaboratorStations} />
      )}

      {!activeSection.startsWith('station-') && !activeSection.startsWith('collab-station-') && (
        <>
          {activeSection === "associates" && (
            <Associates stations={stations} />
          )}
          
          {activeSection === "requests" && (
            <Requests 
              stationIdInput={stationIdInput}
              setStationIdInput={setStationIdInput}
              isSending={isSending}
              sendSuccess={sendSuccess}
              error={error}
              handleSendRequest={handleSendRequest}
              requests={requests}
              handleRequestUpdate={handleRequestUpdate}
            />
          )}

          {activeSection === "stations" && (
            <Stations stations={stations} />
          )}
        </>
      )}
    </div>
  );
};

export default Content;