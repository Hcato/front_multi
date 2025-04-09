import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import dataSensorApi from '../scripts/dataSensor';
import { useParams } from 'react-router-dom';

const SensorChart = ({ endpoint, title, color, unit, valueSelector }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { stationId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataSensorApi.get(endpoint);
        const allData = response.data;
        
        const filteredData = allData.filter(item => 
          item.station_id && item.station_id.toString() === stationId
        );

        if (filteredData.length === 0) {
          console.warn(`No hay datos para la estación ${stationId} en ${endpoint}`);
          return;
        }

        const labels = filteredData.map(item => new Date(item.createdAt).toLocaleTimeString());
        const values = valueSelector 
          ? valueSelector(filteredData) 
          : filteredData.map(item => {
              if (endpoint.includes('bmp180')) return item.pressure;
              if (endpoint.includes('sensor')) return item.temperature;
              if (endpoint.includes('sensor')) return item.humenity;
              if (endpoint.includes('ldr')) return item.ldr_percent;
              return 0;
            });

        // Configuración del gráfico
        const ctx = chartRef.current.getContext('2d');
        
        // Destruimos la instancia anterior si existe
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: `${title} (${unit})`,
                data: values,
                borderColor: color,
                backgroundColor: `${color}20`,
                borderWidth: 2,
                tension: 0.1,
                fill: true
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.raw} ${unit}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Hora'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: unit
                  }
                }
              }
            }
          });
          
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    };

    fetchData();

    // Limpieza al desmontar el componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [endpoint, title, color, unit, stationId]); // Añadimos stationId a las dependencias

  return (
    <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
      <h3>{title} </h3>
      <canvas ref={chartRef} />
    </div>
  );
};

export default SensorChart;