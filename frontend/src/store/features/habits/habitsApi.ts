import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const habitsApi = createApi({
  reducerPath: "habitsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL, // URL base de tu backend
    prepareHeaders: (headers, { getState }) => {
      // Agregar token si existe
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Habits"],
  endpoints: (builder) => ({
    // Get all habits by userId
    getHabits: builder.query({
      query: (userId: string) => `/api/habits/getall/${userId}`,
      providesTags: ["Habits"],
    }),
    // Get habit by id
    getHabitById: builder.query({
      query: (id: string) => `/api/habits/get/${id}`,
      providesTags: ["Habits"],
    }),
    // Create habit
    createHabit: builder.mutation({
      query: (habitData: {
        name: string;
        description: string;
        userId: string;
      }) => ({
        url: "/api/habits/create",
        method: "POST",
        body: habitData,
      }),
      invalidatesTags: ["Habits"],
    }),
    // Update habit
    updateHabit: builder.mutation({
      query: ({
        id,
        ...patch
      }: {
        id: string;
        name?: string;
        description?: string;
        completed?: boolean;
      }) => ({
        url: `/api/habits/update/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Habits"],
    }),
    // Delete habit
    deleteHabit: builder.mutation({
      query: (id: string) => ({
        url: `/api/habits/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Habits"],
    }),
    // Log habit completion
    logHabitCompletion: builder.mutation({
      query: ({
        id,
        date,
        completed,
      }: {
        id: string;
        date?: string;
        completed: boolean;
      }) => ({
        url: `/api/habits/log-completion/${id}`,
        method: "POST",
        body: { date, completed },
      }),
      invalidatesTags: ["Habits"],
    }),
    // Get habit streak
    getHabitStreak: builder.query({
      query: (id: string) => `/api/habits/get-streak/${id}`,
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useGetHabitByIdQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useLogHabitCompletionMutation,
  useGetHabitStreakQuery,
} = habitsApi;
