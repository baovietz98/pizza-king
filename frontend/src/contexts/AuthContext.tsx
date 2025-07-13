"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, logout as apiLogout } from "@/lib/authApi";
import { getMe } from "@/lib/authApi";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUserFromLogin: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const me = await getMe();
        setUser({
          id: me.id || me._id,
          name: me.name || me.fullName || me.email,
          email: me.email,
          phone: me.phone,
          role: me.role,
        });
      } catch {
        // invalid token - clear it
        apiLogout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const setUserFromLogin = (u: User) => setUser(u);

  const logout = () => {
    apiLogout();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUserFromLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
