import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";

// Simulate API delay
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate a unique user ID
const generateId = () => `usr-${Date.now().toString(36)}`;

export const loginUser = createAsyncThunk<User, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      await delay(1200);

      if (!credentials.email || !credentials.password) {
        return rejectWithValue("Email and password are required");
      }

      // Check registered users in localStorage
      const registeredUsers: User[] = JSON.parse(
        localStorage.getItem("projex-registered-users") || "[]",
      );

      const matchedUser = registeredUsers.find(
        (u) => u.email === credentials.email,
      );

      if (!matchedUser) {
        return rejectWithValue("Invalid email or password");
      }

      // Check password from stored passwords
      const storedPasswords: Record<string, string> = JSON.parse(
        localStorage.getItem("projex-user-passwords") || "{}",
      );

      if (storedPasswords[credentials.email] !== credentials.password) {
        return rejectWithValue("Invalid email or password");
      }

      // Login successful
      localStorage.setItem("projex-user", JSON.stringify(matchedUser));
      return matchedUser;
    } catch {
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const registerUser = createAsyncThunk<
  { user: User; message: string },
  RegisterCredentials
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    await delay(1500);

    if (credentials.password !== credentials.confirmPassword) {
      return rejectWithValue("Passwords do not match");
    }

    // Check if email is already registered
    const registeredUsers: User[] = JSON.parse(
      localStorage.getItem("projex-registered-users") || "[]",
    );

    if (registeredUsers.some((u) => u.email === credentials.email)) {
      return rejectWithValue("An account with this email already exists");
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      name: credentials.name,
      email: credentials.email,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(credentials.name)}`,
      role: "member",
      department: "Engineering",
      joinedAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    // Save user to registered users list
    registeredUsers.push(newUser);
    localStorage.setItem(
      "projex-registered-users",
      JSON.stringify(registeredUsers),
    );

    // Save password separately
    const storedPasswords: Record<string, string> = JSON.parse(
      localStorage.getItem("projex-user-passwords") || "{}",
    );
    storedPasswords[credentials.email] = credentials.password;
    localStorage.setItem(
      "projex-user-passwords",
      JSON.stringify(storedPasswords),
    );

    return { user: newUser, message: "Registration successful! Please sign in." };
  } catch {
    return rejectWithValue("An unexpected error occurred");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await delay(500);
  localStorage.removeItem("projex-user");
});

export const guestLogin = createAsyncThunk<User, void>(
  "auth/guestLogin",
  async (_, { rejectWithValue }) => {
    try {
      await delay(800);

      const user: User = {
        id: "guest",
        name: "Guest User",
        email: "guest@projex.io",
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=Guest`,
        role: "member",
        department: "Engineering",
        joinedAt: new Date().toISOString().split("T")[0],
        status: "active",
      };

      localStorage.setItem("projex-user", JSON.stringify(user));
      return user;
    } catch {
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const socialLogin = createAsyncThunk<User, string>(
  "auth/socialLogin",
  async (provider, { rejectWithValue }) => {
    try {
      await delay(1000);

      const providerName =
        provider === "google"
          ? "Google"
          : provider === "github"
            ? "GitHub"
            : "Apple";

      const user: User = {
        id: generateId(),
        name: `User (${providerName})`,
        email: `user@${provider}.com`,
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${provider}`,
        role: "member",
        department: "Engineering",
        joinedAt: new Date().toISOString().split("T")[0],
        status: "active",
      };

      localStorage.setItem("projex-user", JSON.stringify(user));
      return user;
    } catch {
      return rejectWithValue(`Failed to login with ${provider}`);
    }
  },
);
