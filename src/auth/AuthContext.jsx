import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, loginUser, registerUser, setToken } from "../api/client.js";

const USER_KEY = "dsa-admin-user";
const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* private browsing or storage disabled: session just won't persist */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      persistUser(null);
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const nextUser = {
      id: res.userId,
      email: res.email,
      displayName: res.displayName,
      permissions: res.permissions ?? [],
    };
    setToken(res.token);
    persistUser(nextUser);
    setUser(nextUser);
    return nextUser;
  };

  /** A freshly registered account has no role yet (permissions: []) until a Super Admin
   *  assigns one -- still logs them in immediately, same as the backend's one register
   *  endpoint always has, just with nothing to do in the admin UI until that happens. */
  const register = async (email, password, displayName) => {
    const res = await registerUser(email, password, displayName);
    const nextUser = {
      id: res.userId,
      email: res.email,
      displayName: res.displayName,
      permissions: res.permissions ?? [],
    };
    setToken(res.token);
    persistUser(nextUser);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setToken(null);
    persistUser(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
