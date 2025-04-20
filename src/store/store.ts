import { configureStore } from "@reduxjs/toolkit";

import pmReducer from "./player-management/pmSlice";
import tmReducer from "./team-management/tmSlice";
import generatedTeamsSlice from "./team-generation/generatedTeamsSlice";
import { playersApi } from "@/services/playersApi";
import { teamsApi } from "@/services/teamApi";
import { generatedTeamsApi } from "@/services/generateTeamApi";

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
    [playersApi.reducerPath]: playersApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [generatedTeamsApi.reducerPath]: generatedTeamsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(playersApi.middleware)
      .concat(teamsApi.middleware)
      .concat(generatedTeamsApi.middleware),
});

export default store;

// define TypeScript types for your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
