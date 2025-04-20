import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Player {
  id: number;
  name: string;
  skill: number;
}

export interface GeneratedTeamSet {
  id: string;
  title: string;
  teams: Record<string, Player[]>;
}

interface State {
  data: Record<string, GeneratedTeamSet>;
}

const initialState: State = {
  data: {},
};

const generatedTeamsSlice = createSlice({
  name: "generatedTeams",
  initialState,
  reducers: {
    setGeneratedTeam: (state, action: PayloadAction<GeneratedTeamSet>) => {
      const teamSet = action.payload;
      state.data[teamSet.id] = teamSet;
    },
  },
});

export const { setGeneratedTeam } = generatedTeamsSlice.actions;
export default generatedTeamsSlice.reducer;
