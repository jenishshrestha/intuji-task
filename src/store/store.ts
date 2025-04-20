import { configureStore } from "@reduxjs/toolkit";

import pmReducer from "./player-management/pmSlice";
import tmReducer from "./team-management/tmSlice";
import generatedTeamsSlice from "./team-generation/generatedTeamsSlice";

/**
 * =================================================
 * Store Configuration
 * =================================================
 */

const store = configureStore({
  reducer: {
    playerDatas: pmReducer,
    teamDatas: tmReducer,
    generatedTeams: generatedTeamsSlice,
  },
});

export default store;

// define TypeScript types for your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
