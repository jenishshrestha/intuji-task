import { configureStore } from "@reduxjs/toolkit";

import pmReducer from "./player-management/pmSlice";

/**
 * =================================================
 * Store Configuration
 * =================================================
 */

const store = configureStore({
  reducer: {
    playerData: pmReducer,
  },
});

export default store;

// define TypeScript types for your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
