// Local auth service using localStorage
// Simulates backend auth with hashed passwords (btoa-based for demo)

const USERS_KEY = "regumap_users";
const TOKEN_KEY = "regumap_token";
const USER_ID_KEY = "regumap_userId";

interface StoredUser {
  userId: string;
  passwordHash: string;
  createdAt: string;
}

export function hashPassword(password: string): string {
  return btoa(`regumap_salt:${password}`);
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}:${Math.random()}`);
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
}

export function signup(userId: string, password: string): AuthResult {
  const users = getUsers();
  const existing = users.find((u) => u.userId === userId);
  if (existing) {
    return {
      success: false,
      message: "User ID already exists. Please choose another.",
    };
  }
  users.push({
    userId,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  saveUsers(users);
  return { success: true, message: "Account created successfully!" };
}

export function login(userId: string, password: string): AuthResult {
  const users = getUsers();
  const user = users.find((u) => u.userId === userId);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { success: false, message: "Invalid credentials" };
  }
  const token = generateToken(userId);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
  return { success: true, message: "Login successful", token };
}

export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): AuthResult {
  const users = getUsers();
  const idx = users.findIndex((u) => u.userId === userId);
  if (idx === -1 || users[idx].passwordHash !== hashPassword(currentPassword)) {
    return { success: false, message: "Current password is incorrect." };
  }
  users[idx].passwordHash = hashPassword(newPassword);
  saveUsers(users);
  return { success: true, message: "Password changed." };
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
