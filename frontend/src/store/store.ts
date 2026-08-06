import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

// rootReducer is already the combined reducer, so it is passed as is.
// Spreading it ({...rootReducer}) yielded {} and left the store with no reducers.
const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
