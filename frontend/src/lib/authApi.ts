// authApi.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";
const SESSION_ID_KEY = "cart_session_id";
const TOKEN_KEY = "auth_token";

import { clearSessionId } from "./cartApi";

function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

// Build headers shared with cartApi style
function buildHeaders(extra: Record<string, string> = {}): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...extra,
  };

  const sessionId = getSessionId();
  if (sessionId) {
    headers["X-Session-ID"] = sessionId;
  }
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const sessionId = getSessionId();
  const loginData = {
    ...payload,
    ...(sessionId && { sessionId })
  };

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(loginData),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  if (data.token) {
    saveToken(data.token);
  }
  // Nếu đã merge cart thành công, xóa sessionId khỏi localStorage
  if (data.cartMerged && sessionId) {
    clearSessionId();
  }
  return data;
}

export async function getMe() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    clearSessionId();
  }
}
