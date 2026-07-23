const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public issues?: Array<{ path: string; message: string }>,
  ) {
    super(message);
  }
}

// The refresh token lives in localStorage for this MVP (simplest thing that
// works locally). Before real users' data is on this, move it to an
// httpOnly, Secure, SameSite=strict cookie set by the API instead — that
// closes off the XSS-can-steal-the-refresh-token risk. Track this as a
// Phase 7 hardening item.
const REFRESH_KEY = "pingwatch.refreshToken";

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setStoredRefreshToken(token: string | null) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
  else localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  // De-dupe concurrent refresh attempts (e.g. several requests hitting a
  // 401 at once) into a single in-flight call.
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          setStoredRefreshToken(null);
          setAccessToken(null);
          return null;
        }
        const data = await res.json();
        setAccessToken(data.accessToken);
        setStoredRefreshToken(data.refreshToken);
        return data.accessToken as string;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const doFetch = async (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && !options.skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

  let res = await doFetch(accessToken);

  // Access token expired mid-session: refresh once, then retry the original
  // request transparently. Callers never see the 401.
  if (res.status === 401 && !options.skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? res.statusText, body.issues);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
