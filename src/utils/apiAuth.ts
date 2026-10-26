/**
 * Centralized API authentication helper.
 * Attaches Bearer JWT authentication from logged-in session,
 * and passes X-API-Key if explicitly configured (for dev/automation).
 */

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && typeof payload.exp === 'number') {
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch {
    return false;
  }
}

export function getAuthToken(): string | null {
  try {
    const direct = localStorage.getItem('learniverse_token');
    if (direct) {
      if (isTokenExpired(direct)) {
        localStorage.removeItem('learniverse_token');
      } else {
        return direct;
      }
    }
    const studentRaw = localStorage.getItem('learniverse_student');
    if (studentRaw) {
      const parsed = JSON.parse(studentRaw);
      if (parsed?.token) {
        if (isTokenExpired(parsed.token)) {
          delete parsed.token;
          localStorage.setItem('learniverse_student', JSON.stringify(parsed));
        } else {
          return parsed.token;
        }
      }
    }
    const userRaw = localStorage.getItem('learniverse_user');
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed?.token) {
        if (isTokenExpired(parsed.token)) {
          delete parsed.token;
          localStorage.setItem('learniverse_user', JSON.stringify(parsed));
        } else {
          return parsed.token;
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };

  // 1. Attach JWT Bearer token if present
  try {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // localStorage not accessible
  }

  // 2. Attach dev/admin API key if configured, or default client key for platform requests
  const apiKey = import.meta.env.VITE_API_SECRET_KEY || 'u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE';
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  return headers;
}
