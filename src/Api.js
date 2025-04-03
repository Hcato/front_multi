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

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error enviando el token al backend:", error);
    return null; // Manejo del error para que el frontend pueda reaccionar
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
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getTemperature:", error);
    return null;
  }
};


