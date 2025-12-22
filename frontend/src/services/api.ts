const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper para hacer requests
const apiRequest = async (endpoint: string, options?: RequestInit) => {
  //RequestInit es el tipo que define las opciones que puedes pasar a fetch().
  // . ? significa que el argumento es opcional.

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Intentar obtener el mensaje de error del backend
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      // Si no se puede parsear el JSON, usar statusText
    }
    throw new Error(`API Error: ${errorMessage}`);
  }

  return response.json();
};

export default apiRequest;
