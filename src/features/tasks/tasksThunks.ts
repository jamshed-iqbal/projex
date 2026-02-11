import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Task } from "@/types";
import { mockTasks } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      await delay(800);
      return mockTasks;
    } catch {
      return rejectWithValue("Failed to fetch tasks");
    }
  },
);

export const createTask = createAsyncThunk<Task, Partial<Task>>(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      await delay(600);
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title || "Untitled Task",
        description: taskData.description || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        projectId: taskData.projectId || "proj-001",
        projectName: taskData.projectName || "Website Redesign",
        assigneeId: taskData.assigneeId || "usr-001",
        assigneeName: taskData.assigneeName || "Jamshed Iqbal",
        assigneeAvatar:
          taskData.assigneeAvatar ||
          "https://api.dicebear.com/9.x/avataaars/svg?seed=Jamshed",
        tags: taskData.tags || [],
        dueDate:
          taskData.dueDate ||
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      return newTask;
    } catch {
      return rejectWithValue("Failed to create task");
    }
  },
);
