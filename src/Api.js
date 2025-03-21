const API_URL = process.env.REACT_APP_API_URL

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
