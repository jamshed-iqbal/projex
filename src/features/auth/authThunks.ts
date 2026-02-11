import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";
import { mockCurrentUser } from "@/lib/mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = createAsyncThunk<User, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      await delay(1200); // Simulate network delay

      // Mock validation
      if (!credentials.email || !credentials.password) {
        return rejectWithValue("Email and password are required");
      }

      // Mock successful login - return user data
      const user: User = {
        ...mockCurrentUser,
        email: credentials.email,
      };

      localStorage.setItem("projex-user", JSON.stringify(user));
      return user;
    } catch {
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const registerUser = createAsyncThunk<User, RegisterCredentials>(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      await delay(1500); // Simulate network delay

      // Mock validation
      if (credentials.password !== credentials.confirmPassword) {
        return rejectWithValue("Passwords do not match");
      }

      // Mock successful registration
      const user: User = {
        ...mockCurrentUser,
        name: credentials.name,
        email: credentials.email,
      };

      localStorage.setItem("projex-user", JSON.stringify(user));
      return user;
    } catch {
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await delay(500);
  localStorage.removeItem("projex-user");
});

export const socialLogin = createAsyncThunk<User, string>(
  "auth/socialLogin",
  async (provider, { rejectWithValue }) => {
    try {
      await delay(1000);

      const user: User = {
        ...mockCurrentUser,
        name:
          provider === "google"
            ? "Jamshed (Google)"
            : provider === "github"
              ? "Jamshed (GitHub)"
              : "Jamshed (Apple)",
      };

      localStorage.setItem("projex-user", JSON.stringify(user));
      return user;
    } catch {
      return rejectWithValue(`Failed to login with ${provider}`);
    }
  },
);
