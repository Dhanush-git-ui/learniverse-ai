/**
 * Centralized API authentication helper.
 * Attaches Bearer JWT authentication from logged-in session,
 * and passes X-API-Key if explicitly configured (for dev/automation).
 */

export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };

  // 1. Attach JWT Bearer token if present
  try {
    const token = localStorage.getItem('learniverse_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // localStorage not accessible
  }

  // 2. Attach dev/admin API key if configured
  const apiKey = import.meta.env.VITE_API_SECRET_KEY;
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  return headers;
}
