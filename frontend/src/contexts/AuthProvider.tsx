import { useCallback, useEffect, useState, type ReactNode } from 'react';
import * as authService from '@/services/auth.service';
import { setAccessToken, setOnUnauthorized } from '@/services/tokenStore';
import type { User } from '@/types/auth';
import { AuthContext } from '@/contexts/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Se o interceptor do axios não conseguir renovar o access token (ver
    // services/api.ts), ele avisa aqui para o estado de sessão acompanhar.
    setOnUnauthorized(() => setUser(null));
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      try {
        // O refresh token é um cookie httpOnly, então na primeira carga da
        // página tentamos usá-lo para reobter um access token sem pedir
        // login de novo (o access token em si só existe em memória e some
        // a cada reload).
        const { accessToken } = await authService.refresh();
        setAccessToken(accessToken);
        const me = await authService.fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedUser, accessToken } = await authService.login({ email, password });
    setAccessToken(accessToken);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: newUser, accessToken } = await authService.register({ name, email, password });
    setAccessToken(accessToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
