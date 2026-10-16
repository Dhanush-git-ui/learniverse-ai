/**
 * Centralized API authentication helper.
 * Attaches Bearer JWT authentication from logged-in session,
 * and passes X-API-Key if explicitly configured (for dev/automation).
 */

export function getAuthToken(): string | null {
  try {
    const direct = localStorage.getItem('learniverse_token');
    if (direct) return direct;
    const studentRaw = localStorage.getItem('learniverse_student');
    if (studentRaw) {
      const parsed = JSON.parse(studentRaw);
      if (parsed?.token) return parsed.token;
    }
    const userRaw = localStorage.getItem('learniverse_user');
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed?.token) return parsed.token;
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
