import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedHabitId: null,
  filterHabits: "all",
};

export const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setSelectedHabit: (state, action) => {
      state.selectedHabitId = action.payload;
    },
    setFilterHabits: (state, action) => {
      state.filterHabits = action.payload;
    },
  },
});

export const { setSelectedHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
