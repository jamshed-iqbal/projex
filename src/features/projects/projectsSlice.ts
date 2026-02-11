import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, ProjectsState, ProjectStatus } from "@/types";
import { fetchProjects, createProject } from "./projectsThunks";

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  filter: "all",
  searchQuery: "",
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<ProjectStatus | "all">) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      });
  },
});

export const { setFilter, setSearchQuery, selectProject } =
  projectsSlice.actions;
export default projectsSlice.reducer;
