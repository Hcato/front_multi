const API_URL = process.env.REACT_APP_API_URL
const API_TEM = process.env.REACT_APP_API_URL_TEMP

export const sendTokenToBackend = async (token) => {
  try {
    const response = await fetch(`${API_URL}/suscribe-topic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error enviando el token al backend:", error);
  }
};
export const getTemperature = async () => {
  try {
    const response = await fetch(`${API_TEM}/sensor/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }

    const data = await response.json();
    return data; // Devuelve los datos
  } catch (error) {
    console.error("Error en getTemperature:", error);
    return null;
  }
};

