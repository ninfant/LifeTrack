import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { habitsApi } from "./features/habits/habitsApi.ts";
import { userApi } from "./features/user/userApi.ts";

const store = configureStore({
  reducer: {
    ...rootReducer,
    // Agregar el reducer de RTK Query
    [habitsApi.reducerPath]: habitsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  // Agregar el middleware de RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(habitsApi.middleware).concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
