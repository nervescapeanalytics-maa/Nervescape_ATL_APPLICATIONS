import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiGet, apiPost, setToken, getToken } from './api';

export type Role = 'admin' | 'teacher' | 'student';
export interface User {
  id: string;
  role: Role;
  full_name: string;
  email: string;
  grade_id?: number | null;
  grade_name?: string | null;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null as any);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    apiGet<{ user: User }>('/auth/me')
      .then((r) => setUser(r.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(identifier: string, password: string, role: Role) {
    const r = await apiPost<{ token: string; user: User }>('/auth/login', { identifier, password, role });
    setToken(r.token);
    setUser(r.user);
    return r.user;
  }
  function logout() {
    setToken(null);
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}
