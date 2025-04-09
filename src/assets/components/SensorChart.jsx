import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import dataSensorApi from '../scripts/dataSensor';

const SensorChart = ({ endpoint, title, color, unit, valueSelector }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataSensorApi.get(endpoint);
        const data = response.data;
        
        // Formateamos las etiquetas con hora completa
        const labels = data.map(item => {
          const date = new Date(item.created_at);
          return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        });

        const values = valueSelector 
          ? valueSelector(data) 
          : data.map(item => {
              if (endpoint.includes('bmp180')) return item.pressure;
              if (endpoint.includes('sensor')) return item.temperature;
              if (endpoint.includes('sensor')) return item.humenity;
              if (endpoint.includes('wind')) return item.wind_speed;
              return 0;
            });

        const ctx = chartRef.current.getContext('2d');
        
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
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  title: function(context) {
                    const dataItem = data[context[0].dataIndex];
                    const date = new Date(dataItem.created_at);
                    return date.toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    });
                  },
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw} ${unit}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Hora de Medición',
                },
                ticks: {
                  autoSkip: true,
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
              y: {
                title: {
                  display: true,
                  text: unit,
                },
              },
            },
          },          
        });

      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    };

    fetchData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [endpoint, title, color, unit, valueSelector]);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
      <h3>{title}</h3>
      <canvas ref={chartRef} />
    </div>
  );
};

export default SensorChart;