import React, { useState, useEffect } from "react";
import "./principalPage.css"; // Importa los estilos
import LunarPhase from "../../assets/scripts/lunarPhase";
import Weather from "../../assets/scripts/openWeather";

export default function WeatherBackground() {
  const [bgClass, setBgClass] = useState("bg-morning");
  const [stars, setStars] = useState([]);
  const [moonPhase, setMoonPhase] = useState("luna-nueva"); 
  const [moonPosition, setMoonPosition] = useState(0);
  const [isCloudy, setIsCloudy] = useState(false);
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      if (hour >= 7 && hour < 12) {
        setBgClass("bg-morning"); // Mañana
        setStars([]); 
      } else if ((hour >= 17 && hour < 19) || (hour >= 5 && hour <=6)) {
        setBgClass("bg-afternoon"); // Tarde
        setStars([]); 
      } else {
        setBgClass("bg-night"); // Noche
        generateStars(); 
        moveMoon(hour);
      }
    };

    const generateStars = () => {
      const starCount = Math.floor(Math.random() * 50) + 30;
      const newStars = Array.from({ length: starCount }).map(() => ({
        top: Math.random() * 100, 
        left: Math.random() * 100, 
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5, 
      }));
      setStars(newStars);
    };

    const moveMoon = (hour) => {
      const maxPosition = 90;
      const middlePosition = maxPosition / 2;
      if (hour >= 18 && hour < 23) {
        setMoonPosition(((hour - 18) * (maxPosition / 5))); // Movimiento hacia la derecha
      } else if (hour >= 23 || hour < 5) {
        setMoonPosition(middlePosition + ((hour - 23) * (maxPosition - middlePosition) / 6));
      } else {
        setMoonPosition(0); // Posición inicial
      }
    };

    updateBackground();
    const interval = setInterval(updateBackground, 60000); 

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const generateClouds = () => {
      if (isCloudy) {
        setClouds(
          Array.from({ length: 10 }).map(() => ({
            top: Math.random() * 15, // Nubes en la parte superior
            left: Math.random() * 100,
            size: Math.random() * 100 + 50,
          }))
        );
      } else {
        // Si NO está nublado, generar solo 1 o 2 nubes dispersas
        setClouds(
          Array.from({ length: Math.floor(Math.random() * 2) + 1 }).map(() => ({
            top: Math.random() * 15, 
            left: Math.random() * 100,
            size: Math.random() * 100 + 50,
          }))
        );
      }
    };

    generateClouds();
  }, [isCloudy]);
  return (
    <div className={`h-screen ${bgClass} relative`}>
      <Weather setIsCloudy={setIsCloudy}/>
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
      <LunarPhase setMoonPhase={setMoonPhase} />
      {bgClass === "bg-night" && moonPhase && (
        <div
        className={`moon moon-${moonPhase.toLowerCase().trim().replace(/\s+/g, "-")}`}
        style={{
          position: "absolute",
          top: "20%", 
          left: `${moonPosition}%`, 
        }}
      >
        <div className="moon-shadow"></div>
      </div>      
      )}
      {clouds.map((cloud, index) => (
        <div
          key={index}
          className="cloud"
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size / 2}px`,
          }}
        />
      ))}
      <h1 className="text">{moonPhase}</h1>
      <h1 className="text">Está nublado: {isCloudy ? "Sí" : "No"}</h1>
    </div>
  );
}
