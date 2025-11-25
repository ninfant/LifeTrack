// User RTK Query API
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get user by id
    getUserById: builder.query({
      query: (id: string) => `/api/users/getuserbyid/${id}`,
      providesTags: ["User"],
    }),
    // Create user
    createUser: builder.mutation({
      query: (userData: { name: string; email: string; password: string }) => ({
        url: "/api/users/create",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    // Update user
    updateUser: builder.mutation({
      query: ({
        id,
        ...patch
      }: {
        id: string;
        name?: string;
        email?: string;
        password?: string;
      }) => ({
        url: `/api/users/update/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["User"],
    }),
    // Delete habit
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/api/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
