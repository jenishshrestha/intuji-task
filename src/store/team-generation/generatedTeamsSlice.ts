import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Player {
  id: number;
  name: string;
  skill: number;
}

export interface GeneratedTeamSet {
  title: string;
  teams: Record<string, Player[]>;
  slug: string;
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
      state.data[teamSet.slug] = teamSet;
    },
  },
});

export const { setGeneratedTeam } = generatedTeamsSlice.actions;
export default generatedTeamsSlice.reducer;
