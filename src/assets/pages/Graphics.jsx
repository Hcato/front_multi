import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NotificationProvider } from '../scripts/ContextNotification';
import { NotificationOverlay } from '../components/NotificationOverlay';
import Nav from '../components/navUp_app';
import SensorChart from '../components/SensorChart';
import { Toaster } from 'react-hot-toast';
import './WeatherDashboard.css'; 

const Graphics = () => {
  const { stationId } = useParams();
  const [dht22Data, setDht22Data] = useState(null);
  const [bmp180Data, setBmp180Data] = useState(null);
  const [ldrData, setLdrData] = useState(null);
  const [windData, setWindData] = useState(null);
  const [wsConnections, setWsConnections] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  const formatStationId = (id) => {
    if (!id) return '';
    return id.toString().padStart(2, '0');
  };
  // Función para guardar datos en localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(`station_${formatStationId(stationId)}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };

  // Función para cargar datos desde localStorage
  const loadFromLocalStorage = (key) => {
    try {
      const data = localStorage.getItem(`station_${formatStationId(stationId)}_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      return null;
    }
  };

  // Función para determinar el icono del clima
  const getWeatherIcon = () => {
    if (!dht22Data || !ldrData || !windData) return 'wi-day-sunny';
    
    const { temperature, humidity } = dht22Data;
    const light = ldrData.LDR_percent;
    const windSpeed = windData.wind_speed;

    if (light < 20) return 'wi-night-clear';
    if (humidity > 70 && temperature > 25) return 'wi-day-rain';
    if (windSpeed > 5) return 'wi-day-windy';
    if (temperature > 30) return 'wi-day-sunny';
    if (temperature < 10) return 'wi-snowflake-cold';
    
    return 'wi-day-cloudy';
  };

  // Función para calcular la sensación térmica
  const calculateHeatIndex = (t, rh) => {
    if (!t || !rh) return null;
    
    const tC = t;
    const rhPct = rh;
    
    const hi = -8.784695 + 
      1.61139411 * tC + 
      2.338549 * rhPct - 
      0.14611605 * tC * rhPct - 
      0.012308094 * Math.pow(tC, 2) - 
      0.016424828 * Math.pow(rhPct, 2) + 
      0.002211732 * Math.pow(tC, 2) * rhPct + 
      0.00072546 * tC * Math.pow(rhPct, 2) - 
      0.000003582 * Math.pow(tC, 2) * Math.pow(rhPct, 2);
    
    return hi.toFixed(1);
  };

  // Cargar datos iniciales desde localStorage al montar el componente
  useEffect(() => {
    document.body.classList.add('weather-dashboard-body');
    if (!stationId) return;

    setDht22Data(loadFromLocalStorage('dht22'));
    setBmp180Data(loadFromLocalStorage('bmp180'));
    setLdrData(loadFromLocalStorage('ldr'));
    setWindData(loadFromLocalStorage('wind'));
  }, [stationId]);

  // Efecto para guardar datos cuando cambian
  useEffect(() => {
    if (dht22Data) saveToLocalStorage('dht22', dht22Data);
  }, [dht22Data]);

  useEffect(() => {
    if (bmp180Data) saveToLocalStorage('bmp180', bmp180Data);
  }, [bmp180Data]);

  useEffect(() => {
    if (ldrData) saveToLocalStorage('ldr', ldrData);
  }, [ldrData]);

  useEffect(() => {
    if (windData) saveToLocalStorage('wind', windData);
  }, [windData]);

  useEffect(() => {
    if (!stationId) return;

    const createWebSocketConnection = (sensorType) => {
      const wsUrl = `ws://localhost:8084/ws/${sensorType}`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`Conexión WebSocket establecida para ${sensorType}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.station_id && data.station_id.toString() === stationId) {
            switch(sensorType) {
              case 'dht22':
                setDht22Data(data);
                break;
              case 'bmp180':
                setBmp180Data(data);
                break;
              case 'ldr':
                setLdrData(data);
                break;
              case 'wind':
                setWindData(data);
                break;
              default:
                console.warn('Tipo de sensor no reconocido:', sensorType);
            }
            setLastUpdate(new Date());
          }
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error(`Error en WebSocket ${sensorType}:`, error);
      };

      ws.onclose = () => {
        console.log(`Conexión WebSocket cerrada para ${sensorType}`);
      };

      return ws;
    };

    const connections = [
      createWebSocketConnection('dht22'),
      createWebSocketConnection('bmp180'),
      createWebSocketConnection('ldr'),
      createWebSocketConnection('wind')
    ];

    setWsConnections(connections);

    return () => {
      document.body.classList.remove('weather-dashboard-body');
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, [stationId]);

  return (
    <NotificationProvider>
      <NotificationOverlay/>
            <Nav/>
    <div className="weather-container">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="weather-container">
        <header className="weather-header">
          <h1>Estación Meteorológica</h1>
          <p>#{stationId}</p>
          {lastUpdate && (
            <p className="last-update">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </header>

        <main className="weather-main">
          {/* Sección principal con condiciones actuales */}
          <section className="current-conditions">
            <div className="weather-icon">
              <i className={`wi ${getWeatherIcon()}`}></i>
              {dht22Data && (
                <span className="temperature">
                  {dht22Data.temperature}°C
                </span>
              )}
            </div>

            <div className="weather-details">
              {dht22Data && (
                <div className="weather-detail">
                  <i className="wi wi-humidity"></i>
                  <span>Humedad: {dht22Data.humidity}%</span>
                </div>
              )}

              {dht22Data && (
                <div className="weather-detail">
                  <i className="wi wi-thermometer"></i>
                  <span>Sensación térmica: {calculateHeatIndex(dht22Data.temperature, dht22Data.humidity)}°C</span>
                </div>
              )}

              {windData && (
                <div className="weather-detail">
                  <i className="wi wi-wind"></i>
                  <span>Viento: {windData.wind_speed} m/s</span>
                </div>
              )}
            </div>
          </section>

          {/* Sección secundaria con datos adicionales */}
          <section className="secondary-data">
            <div className="data-card">
              <h3><i className="wi wi-barometer"></i> Presión Atmosférica</h3>
              {bmp180Data ? (
                <p>{bmp180Data.pressure} hPa</p>
              ) : (
                <p className="no-data">Sin datos</p>
              )}
            </div>

            <div className="data-card">
              <h3><i className="wi wi-sunrise"></i> Nivel de Luz</h3>
              {ldrData ? (
                <div>
                  <p>{ldrData.LDR_percent}%</p>
                  <div className="light-meter">
                    <div 
                      className="light-level" 
                      style={{ width: `${ldrData.LDR_percent}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="no-data">Sin datos</p>
              )}
            </div>

            <div className="data-card">
              <h3><i className="wi wi-cloud"></i> Condiciones</h3>
              {dht22Data && windData && (
                <p>
                  {dht22Data.temperature > 25 ? 'Cálido' : 'Templado'}, {' '}
                  {windData.wind_speed > 3 ? 'ventoso' : 'poco viento'}
                </p>
              )}
            </div>
          </section>
        </main>

        {/* Estado de los sensores */}
        <footer className="sensor-status">
          <h3>Estado de los Sensores</h3>
          <div className="status-grid">
            <div className={`status-item ${dht22Data?.status === 'activate' ? 'active' : 'inactive'}`}>
              <span>DHT22</span>
              <i className={`wi ${dht22Data?.status === 'activate' ? 'wi-check' : 'wi-alien'}`}></i>
            </div>
            <div className={`status-item ${bmp180Data?.status === 'activate' ? 'active' : 'inactive'}`}>
              <span>BMP180</span>
              <i className={`wi ${bmp180Data?.status === 'activate' ? 'wi-check' : 'wi-alien'}`}></i>
            </div>
            <div className={`status-item ${ldrData?.status === 'activate' ? 'active' : 'inactive'}`}>
              <span>LDR</span>
              <i className={`wi ${ldrData?.status === 'activate' ? 'wi-check' : 'wi-alien'}`}></i>
            </div>
            <div className={`status-item ${windData?.status === 'activate' ? 'active' : 'inactive'}`}>
              <span>Wind</span>
              <i className={`wi ${windData?.status === 'activate' ? 'wi-check' : 'wi-alien'}`}></i>
            </div>
          </div>
        </footer>
        <div className="chart-grid">
          
        <div className="chart-item">
          <SensorChart 
            endpoint="/sensor/data" 
            title="Temperatura" 
            color="rgb(66, 124, 160)" 
            unit="°C"
          />
        </div>

        <div className="chart-item">
          <SensorChart 
            endpoint="/sensor/data" 
            title="Humedad" 
            color="rgb(66, 124, 160)" 
            unit="%"
            valueSelector={data => data.map(item => item.humidity)}
          />
        </div>

        <div className="chart-item">
          <SensorChart 
            endpoint="/bmp180/data" 
            title="Presión Atmosférica" 
            color="rgb(212, 208, 0)" 
            unit="hPa"
          />
        </div>
        
        <div className="chart-item">
          <SensorChart 
            endpoint="/wind/data" 
            title="Velocidad del Viento" 
            color="rgb(212, 208, 0)" 
            unit="km/h"
          />
        </div>
      </div>
      </div>
    </div>
    </NotificationProvider>
  );
};

export default Graphics;