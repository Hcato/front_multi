import { useEffect } from "react";
import axios from "axios";

const Weather = ({ setIsCloudy }) => {
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY_WEATHER;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const cloudy = response.data.weather.some(
          (condition) => condition.main === "Clouds"
        );
        setIsCloudy(cloudy);
      } catch (err) {
        console.error("Error al obtener el clima", err);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (error) => console.error("Error obteniendo la ubicación", error)
    );
  }, [setIsCloudy]);

  return null; // No renderiza nada, solo actualiza el estado
};

export default Weather;
