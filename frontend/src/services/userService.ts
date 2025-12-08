import apiRequest from "./api";

export const userService = {
  getUserById: (id: string) => apiRequest(`/api/users/getuserbyid/${id}`),

  createUser: (userData: { name: string; email: string; password: string }) =>
    apiRequest("/api/users/create", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // ... otros métodos
};
