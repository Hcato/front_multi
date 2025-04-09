import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { NotificationProvider } from '../scripts/ContextNotification';
import { NotificationOverlay } from '../components/NotificationOverlay';
import Nav from '../components/navUp_app';
import { Toaster } from 'react-hot-toast';
const Graphics = () => {
  const { stationId } = useParams(); // Obtiene el ID de la URL
  
  // Ahora puedes usar stationId para cargar los datos específicos
  useEffect(() => {
    if (stationId) {
      // Lógica para cargar datos de la estación específica
      console.log("Cargando gráficos para estación:", stationId);
    }
  }, [stationId]);

  return (
    <NotificationProvider>
        <NotificationOverlay/>
            <Nav/>
                <Toaster position="top-right" reverseOrder={false} />
                    <div>
                        <h2>Gráficos de la Estación {stationId}</h2>
                    </div>
    </NotificationProvider>
  );
};
export default Graphics