const API_URL = process.env.REACT_APP_API_URL
const API_TEM = process.env.REACT_APP_API_URL_TEMP
const API_2 = process.env.REACT_APP_API2_URL
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
export const getTemperature = async () => { //sin usar de momento
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

export const getUserByToken = async (token) => {
  try {
    const response = await fetch(`${API_2}/users/token/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error("Error al obtener el usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getUserByToken:", error);
    return null;
  }
};

export const sendCollaborationRequest = async (stationId, userId) => {
  try {
    const response = await fetch(`${API_2}/stations/${stationId}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al enviar solicitud de colaboración:", error);
    return null;
  }
};

export const getCollaborationRequests = async (stationId) => {
  try {
    const response = await fetch(`${API_2}/stations/${stationId}/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener solicitudes de colaboración:", error);
    return null;
  }
};

export const updateCollaborationRequest = async (requestId, status) => {
  try {
    const response = await fetch(`${API_2}/requests/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar solicitud de colaboración:", error);
    return null;
  }
};

export const getStationsByUser = async (userId) => {
  try {
    const response = await fetch(`${API_2}/users/${userId}/stations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener estaciones del usuario:", error);
    return null;
  }
};

export const getCollaboratorStations = async (userId) => {
  try {
    const response = await fetch(`${API_2}/users/${userId}/collaborator-stations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener estaciones como colaborador:", error);
    return null;
  }
};

export const getStationsByToken = async (token) => {
  try {
    const response = await fetch(`${API_2}/users/token/${token}/stations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener estaciones por token:", error);
    return null;
  }
};

export const getStationsWithCollaborators = async (userId) => {
  try {
    const response = await fetch(`${API_2}/users/${userId}/stations-with-collaborators`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener estaciones con colaboradores:", error);
    return null;
  }
};
export const createCollaborationRequest = async (stationId, userId) => {
  try {
    const response = await fetch(`${API_2}/stations/${stationId}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId })
    });

    console.log("Status de la respuesta:", response.status); // Debug
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la respuesta:", errorText); // Debug
      throw new Error(errorText || 'Error al crear solicitud');
    }

    // Manejar caso donde la respuesta puede estar vacía
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { success: true };
    } catch (e) {
      console.warn("La respuesta no es JSON válido, pero la operación fue exitosa");
      return { success: true };
    }
    
  } catch (error) {
    console.error("Error completo al crear solicitud:", error);
    throw error;
  }
};
export const getStationWithOwner = async (stationId) => {
  try {
    console.log(`[DEBUG] URL completa: ${API_2}/stations/${stationId}`);
    const response = await fetch(`${API_2}/stations/${stationId}`);
    
    console.log(`[DEBUG] Estado de la respuesta: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DEBUG] Error en la respuesta: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("[DEBUG] Datos recibidos:", data);
    return data;
  } catch (error) {
    console.error("[DEBUG] Error completo en getStationWithOwner:", error);
    throw error;
  }
};
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_2}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el login');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    if (userData.image) {
      formData.append('image', userData.image);
    }
    formData.append('token2', userData.token2);

    const response = await fetch(`${API_2}/users`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};