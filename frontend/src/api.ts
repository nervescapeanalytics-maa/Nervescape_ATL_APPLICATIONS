// Lightweight API client with JWT handling.
const TOKEN_KEY = 'lms_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`/api${path}`, { ...opts, headers });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || res.statusText;
    throw new ApiError(res.status, typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return data as T;
}

function safeJson(t: string) {
  try { return JSON.parse(t); } catch { return { raw: t }; }
}

export const apiGet = <T = any>(p: string) => api<T>(p);
export const apiPost = <T = any>(p: string, body?: any) =>
  api<T>(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
export const apiPut = <T = any>(p: string, body?: any) =>
  api<T>(p, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
export const apiDel = <T = any>(p: string) => api<T>(p, { method: 'DELETE' });
