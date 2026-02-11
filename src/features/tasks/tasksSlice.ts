import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TasksState, TaskStatus, TaskPriority } from "@/types";
import { fetchTasks, createTask } from "./tasksThunks";

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
  filterStatus: "all",
  filterPriority: "all",
  searchQuery: "",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<TaskStatus | "all">) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<TaskPriority | "all">) => {
      state.filterPriority = action.payload;
    },
    setTaskSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: string; status: TaskStatus }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      });
  },
});

export const {
  setFilterStatus,
  setFilterPriority,
  setTaskSearchQuery,
  updateTaskStatus,
  reorderTasks,
} = tasksSlice.actions;
export default tasksSlice.reducer;
