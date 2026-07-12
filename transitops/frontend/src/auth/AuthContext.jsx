import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../lib/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiClient
      .get("/auth/me")
      .then((payload) => {
        if (active) {
          setUser(payload.data.user);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleAuthExpired() {
      setUser(null);
    }

    window.addEventListener("transitops:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("transitops:auth-expired", handleAuthExpired);
  }, []);

  async function login(email, password) {
    const payload = await apiClient.post("/auth/login", { email, password });
    setUser(payload.data.user);
    return payload.data.user;
  }

  async function logout() {
    try {
      await apiClient.post("/auth/logout", {});
    } finally {
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      clearSession: () => setUser(null),
      isAuthenticated: Boolean(user)
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
