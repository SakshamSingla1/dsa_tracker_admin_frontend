const API_BASE = `${import.meta.env.VITE_API_BASE ?? "http://localhost:8081"}/api`;
// Distinct keys from the student frontend's "dsa-auth-token"/"dsa-auth-user" so one browser
// logged into both apps on localhost doesn't cross-contaminate sessions.
const TOKEN_KEY = "dsa-admin-token";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private browsing or storage disabled: session just won't persist */
  }
}

export async function request(path, options) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options?.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401 && path !== "/auth/login") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    let message = `${options?.method ?? "GET"} ${path} failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* no JSON body to read */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
