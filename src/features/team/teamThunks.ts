import { createAsyncThunk } from "@reduxjs/toolkit";
import type { TeamMember } from "@/types";
import { mockTeamMembers } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTeamMembers = createAsyncThunk<TeamMember[]>(
  "team/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      await delay(800);
      return mockTeamMembers;
    } catch {
      return rejectWithValue("Failed to fetch team members");
    }
  },
);
