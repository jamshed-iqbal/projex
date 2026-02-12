// ============================================================
// ProjeX - Type Definitions
// ============================================================

// ---- User / Auth Types ----
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "manager" | "member";
  department: string;
  joinedAt: string;
  status: "active" | "away" | "offline";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ---- Project Types ----
export type ProjectStatus = "active" | "completed" | "on-hold" | "archived";
export type ProjectPriority = "low" | "medium" | "high" | "critical";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: string;
  dueDate: string;
  teamMembers: string[];
  tasksCount: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  filter: ProjectStatus | "all";
  searchQuery: string;
}

// ---- Task Types ----
export type TaskStatus =
  | "backlog"
  | "todo"
  | "in-progress"
  | "in-review"
  | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  tags: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filterStatus: TaskStatus | "all";
  filterPriority: TaskPriority | "all";
  searchQuery: string;
}

// ---- Team Types ----
export interface TeamMember extends User {
  tasksAssigned: number;
  tasksCompleted: number;
  projects: string[];
}

export interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

// ---- Dashboard Types ----
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  teamMembers: number;
  overdueTasks: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
}

// ---- Theme Types ----
export type Theme = "light" | "dark";
