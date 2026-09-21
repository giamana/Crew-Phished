import { createContext, useContext, useEffect, useState } from "react";
import { apiPost } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "crewPhished.auth";

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.token && saved?.user) {
          setToken(saved.token);
          setAuthUser(saved.user);
        }
      }
    } catch {
      // Ignore corrupted storage
    } finally {
      setInitializing(false);
    }
  }, []);

  function persist(nextToken, nextUser) {
    setToken(nextToken);
    setAuthUser(nextUser);
    try {
      if (nextToken && nextUser) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ token: nextToken, user: nextUser })
        );
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage may be unavailable in some embedded contexts; the in-memory
      // auth state above still works for this render.
    }
  }

  async function login(email, password) {
    const data = await apiPost("/api/login", { email, password });
    persist(data.token, data.user);
    return data.user;
  }

  async function signup({ email, password, firstName, lastName, role, companyName }) {
    const data = await apiPost("/api/signup", {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role,
      companyName,
    });
    persist(data.token, data.user);
    return data.user;
  }

  async function logout() {
    try {
      if (token) {
        await apiPost("/api/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch {
      // Even if the server call fails, still clear the local session
    } finally {
      persist(null, null);
    }
  }

  const value = { authUser, token, initializing, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
