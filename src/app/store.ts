import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import projectsReducer from "@/features/projects/projectsSlice";
import tasksReducer from "@/features/tasks/tasksSlice";
import teamReducer from "@/features/team/teamSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
