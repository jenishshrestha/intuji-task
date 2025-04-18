import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface
export interface DataTypes {
  id: number;
  name: string;
  skill: number;
}

// Initial state
const initialState = {
  data: [{ id: 1, name: "Player 1", skill: 0 }] as DataTypes[],
};

/**
 * =================================================
 * Redux slice for managing player data state
 * - Manages player data (id, name, skill)
 * - Provides action to set the player list
 * =================================================
 */
const pmSlice = createSlice({
  name: "pmSlice",
  initialState: initialState,
  reducers: {
    setPlayerData: (state, action: PayloadAction<DataTypes[]>) => {
      state.data = action.payload;
    },
    removePlayerData: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((data) => data.id !== action.payload);
    },
  },
});

export const { setPlayerData, removePlayerData } = pmSlice.actions;

export default pmSlice.reducer;
