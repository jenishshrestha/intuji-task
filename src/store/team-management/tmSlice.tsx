import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface
export interface TMTypes {
  id: number;
  name: string;
}

// Initial state
const initialState = {
  data: [
    { id: 1, name: "Team 1" },
    { id: 2, name: "Team 2" },
  ] as TMTypes[],
};

/**
 * =================================================
 * Redux slice for managing team data state
 * - Manages team data (id, name)
 * - Provides action to set the team list
 * =================================================
 */
const tmSlice = createSlice({
  name: "tmSlice",
  initialState: initialState,
  reducers: {
    setTeamDatas: (state, action: PayloadAction<TMTypes[]>) => {
      state.data = action.payload;
    },
    removeTeamData: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((data) => data.id !== action.payload);
    },
  },
});

export const { setTeamDatas, removeTeamData } = tmSlice.actions;

export default tmSlice.reducer;
