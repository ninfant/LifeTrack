const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper para hacer requests
const apiRequest = async (endpoint: string, options?: RequestInit) => {
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
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export default apiRequest;
