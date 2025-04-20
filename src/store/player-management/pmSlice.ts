import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface
export interface DataTypes {
  id: number;
  name: string;
  skill: number;
}

// Initial state
const initialState = {
  data: [
    { id: 1, name: "Player 1", skill: 3 },
    { id: 2, name: "Player 2", skill: 5 },
    { id: 3, name: "Player 3", skill: 4 },
    { id: 4, name: "Player 4", skill: 5 },
    { id: 5, name: "Player 5", skill: 3 },
    { id: 6, name: "Player 6", skill: 5 },
    { id: 7, name: "Player 7", skill: 3 },
    { id: 8, name: "Player 8", skill: 5 },
    { id: 9, name: "Player 9", skill: 5 },
    { id: 10, name: "Player 10", skill: 4 },
  ] as DataTypes[],
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
