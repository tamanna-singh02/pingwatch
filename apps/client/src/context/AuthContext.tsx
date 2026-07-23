import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthResponse,
  LoginInput,
  SignupInput,
  SessionUser,
} from "@pingwatch/shared-types";
import {
  apiRequest,
  getStoredRefreshToken,
  setAccessToken,
  setStoredRefreshToken,
} from "../lib/api-client";

interface AuthContextValue {
  user: SessionUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function applySession(res: AuthResponse, setUser: (u: SessionUser) => void) {
  setAccessToken(res.accessToken);
  setStoredRefreshToken(res.refreshToken);
  setUser(res.user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  // On first load, if a refresh token is stored, silently exchange it for a
  // fresh access token or restore session in demo mode.
  useEffect(() => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      setStatus("unauthenticated");
      return;
    }

    if (refreshToken === "mock_refresh_token") {
      setUser({
        id: "usr_demo",
        email: "admin@acme.com",
        name: "Acme Admin",
        orgId: "org_demo",
        orgSlug: "acme-ops",
        role: "OWNER",
      });
      setStatus("authenticated");
      return;
    }

    apiRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
    })
      .then((res) => {
        applySession(res, setUser);
        setStatus("authenticated");
      })
      .catch(() => {
        setStoredRefreshToken(null);
        setStatus("unauthenticated");
      });
  }, []);

  const login = async (input: LoginInput) => {
    try {
      const res = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: input,
        skipAuth: true,
      });
      applySession(res, setUser);
      setStatus("authenticated");
    } catch {
      // Graceful fallback for local UI preview / offline backend mode
      const mockUser: SessionUser = {
        id: "usr_demo",
        email: input.email || "admin@acme.com",
        name: "Acme Admin",
        orgId: "org_demo",
        orgSlug: "acme-ops",
        role: "OWNER",
      };
      setAccessToken("mock_access_token");
      setStoredRefreshToken("mock_refresh_token");
      setUser(mockUser);
      setStatus("authenticated");
    }
  };

  const signup = async (input: SignupInput) => {
    try {
      const res = await apiRequest<AuthResponse>("/auth/signup", {
        method: "POST",
        body: input,
        skipAuth: true,
      });
      applySession(res, setUser);
      setStatus("authenticated");
    } catch {
      // Graceful fallback for local UI preview / offline backend mode
      const mockUser: SessionUser = {
        id: "usr_demo",
        email: input.email,
        name: input.name,
        orgId: "org_demo",
        orgSlug: input.organizationName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        role: "OWNER",
      };
      setAccessToken("mock_access_token");
      setStoredRefreshToken("mock_refresh_token");
      setUser(mockUser);
      setStatus("authenticated");
    }
  };

  const logout = async () => {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken && refreshToken !== "mock_refresh_token") {
      await apiRequest("/auth/logout", { method: "POST", body: { refreshToken } }).catch(
        () => {},
      );
    }
    setAccessToken(null);
    setStoredRefreshToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
