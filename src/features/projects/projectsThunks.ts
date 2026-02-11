import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Project } from "@/types";
import { mockProjects } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      await delay(800);
      return mockProjects;
    } catch {
      return rejectWithValue("Failed to fetch projects");
    }
  },
);

export const createProject = createAsyncThunk<Project, Partial<Project>>(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      await delay(600);
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: projectData.name || "Untitled Project",
        description: projectData.description || "",
        status: projectData.status || "active",
        priority: projectData.priority || "medium",
        progress: 0,
        startDate: new Date().toISOString().split("T")[0],
        dueDate:
          projectData.dueDate ||
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        teamMembers: projectData.teamMembers || [],
        tasksCount: 0,
        completedTasks: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        color:
          projectData.color ||
          ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"][
            Math.floor(Math.random() * 5)
          ],
      };
      return newProject;
    } catch {
      return rejectWithValue("Failed to create project");
    }
  },
);
