import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamState } from "@/types";
import { fetchTeamMembers } from "./teamThunks";

const initialState: TeamState = {
  members: [],
  isLoading: false,
  error: null,
  searchQuery: "",
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTeamSearchQuery } = teamSlice.actions;
export default teamSlice.reducer;
