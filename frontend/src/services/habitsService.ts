import apiRequest from "./api";

export const habitsService = {
  // GET all habits
  getHabits: (userId: string) => apiRequest(`/api/habits/getall/${userId}`),

  // GET habit by id
  getHabitById: (id: string) => apiRequest(`/api/habits/get/${id}`),

  // CREATE habit
  createHabit: (habitData: {
    name: string;
    userId: string;
    category: string;
    objective: string;
  }) =>
    apiRequest("/api/habits/create", {
      method: "POST",
      body: JSON.stringify(habitData),
    }),

  // UPDATE habit
  updateHabit: (
    id: string,
    data: {
      name?: string;
      category?: string;
      objective?: string;
    }
  ) =>
    apiRequest(`/api/habits/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // DELETE habit
  deleteHabit: (id: string) =>
    apiRequest(`/api/habits/delete/${id}`, {
      method: "DELETE",
    }),

  // LOG completion
  logCompletion: (
    id: string,
    data: {
      date?: string;
      completed: boolean;
    }
  ) =>
    apiRequest(`/api/habits/log-completion/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // GET streak
  getStreak: (id: string) => apiRequest(`/api/habits/get-streak/${id}`),
};
