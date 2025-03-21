import React, { useState, useEffect } from "react";
import { generationToken, messaging } from "./firebase-config.js";
import { onMessage } from "firebase/messaging";
import toast, {Toaster} from 'react-hot-toast';
import { getTemperature } from "./Api.js";

import morningImage from "../src/assets/multimedia/diatres.gif"
import eveningImage from "../src/assets/multimedia/atardecer.gif"
import nightImage from "../src/assets/multimedia/noche.gif"
import mobileMorning from "../src/assets/multimedia/diados.gif"
import mobileEvening from "./assets/multimedia/amanecerdos.gif"
import mobileNight from "./assets/multimedia/nochedos.gif"
import rainOverlay from "./assets/multimedia/lluvia.webp"

function App() {
  const [background, setBackground] = useState(morningImage);
  const [isRaining, setIsRaining] = useState(()=>{
    return localStorage.getItem("isRaining") === "true";
  });
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  useEffect(() => {
    generationToken();
    onMessage(messaging, (payload) =>{
      console.log(payload);
      if (payload.notification.body === "lluvia") {
        setIsRaining(true);
        localStorage.setItem("isRaining", "true");
        toast(payload.notification.body,
          {
            icon: '🌧️',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          }
        );
      } else if (payload.notification.body === "¡Tu token fue guardado exitosamente!") {
        toast(payload.notification.body,
          {
            icon: '✅',
            style:{
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          }
        );
      } else if (payload.notification.body === "lluvia detenida") {
        setIsRaining(false);
        localStorage.setItem("isRaining", "false");
        toast(payload.notification.body,{
          icon: '☀️',
          style:{
            borderRadius: '10px',
            background: '#333',
            color: '#fff'
          }
        })
      } else if (payload.notification.body === "La temperatura es demasiado baja.") {
        toast(payload.notification.body,{
          icon: '🧊',
          style:{
            borderRadius: '10px',
            background: '#333',
            color: '#fff'
          }
        })
      }
    });
    const updateBackground = () => {
      const hour = new Date().getHours();
      const isMobile = window.innerWidth <= 768;
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      if (hour >= 6 && hour < 18) {
        setBackground(isMobile || isPortrait ? mobileMorning : morningImage); // Día
      } else if ((hour >= 18 && hour < 20) || (hour >= 5 && hour < 6)) {
        setBackground(isMobile || isPortrait ? mobileEvening : eveningImage); // Atardecer/Amanecer
      } else {
        setBackground(isMobile || isPortrait ? mobileNight : nightImage); // Noche
      }
    };
    const fetchData = async () => {
      const data = await getTemperature();
      if (data && data.length > 0) {
        setTemperature(data[0].temperature);
        setHumidity(data[0].humidity);
      }
    };

    fetchData();
    updateBackground();

    window.addEventListener("resize", updateBackground);
    const interval = setInterval(updateBackground, 60000);
    const intervalo = setInterval(fetchData, 5000);

    return () => {
      window.removeEventListener("resize", updateBackground);
      clearInterval(interval);
      clearInterval(intervalo);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            width: "100%",
            height: "100%",
          }}
        ></div>

        {isRaining && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${rainOverlay})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              pointerEvents: "none", // Para que no bloquee interacciones
            }}
          ></div>
        )}
    <div style={{ padding: "20px", textAlign: "center", color: "#fff" }}>
      <h1>Clima Actual</h1>
      <h2>Temperatura: {temperature !== null ? `${temperature}°C` : "Cargando..."}</h2>
      <h2>Humedad: {humidity !== null ? `${humidity}%` : "Cargando..."}</h2>
    </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
}

export default App;