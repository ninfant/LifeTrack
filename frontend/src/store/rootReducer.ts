import { combineReducers } from "@reduxjs/toolkit";
import habitsSlice from "./features/habits/habitsSlice.ts";
import userSlice from "./features/user/userSlice.ts";


export const rootReducer = combineReducers({
  habits: habitsSlice,
  user: userSlice,
});
