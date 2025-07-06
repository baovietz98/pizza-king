// cartApi.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";
const SESSION_ID_KEY = 'cart_session_id';

// Get session ID from localStorage
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

// Save session ID to localStorage
function saveSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  console.log('💾 Lưu sessionId vào localStorage:', sessionId);
  localStorage.setItem(SESSION_ID_KEY, sessionId);
}

// Clear session ID (for logout)
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  console.log('🧹 Xóa sessionId khỏi localStorage');
  localStorage.removeItem(SESSION_ID_KEY);
}

import { getToken } from "./authApi";

// Helper to build headers with session ID
function buildHeaders(extra: Record<string, string> = {}): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...extra,
  };

  const sessionId = getSessionId();
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }

  // Attach auth token if available
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Handle API response and extract session ID if present
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  // Save session ID from response if present
  if (data.sessionId) {
    saveSessionId(data.sessionId);
  }
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

// Get cart with session handling
export async function getCart() {
  const response = await fetch(`${BASE_URL}/cart`, {
    headers: buildHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

// Add product to cart with session handling
export async function addProduct(payload: any) {
  const response = await fetch(`${BASE_URL}/cart/add-product`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(response);
}

// Update cart item with session handling
export async function updateItem(itemId: string, payload: any) {
  const response = await fetch(`${BASE_URL}/cart/update-item/${itemId}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(response);
}

// Remove item from cart with session handling
export async function removeItem(itemId: string) {
  const response = await fetch(`${BASE_URL}/cart/remove-item/${itemId}`, {
    method: 'DELETE',
    headers: buildHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

// Clear cart with session handling
export async function clearCart() {
  const response = await fetch(`${BASE_URL}/cart/clear`, {
    method: 'DELETE',
    headers: buildHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}