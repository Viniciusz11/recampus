import { createContext } from 'react';
import type { User } from '@/types/auth';

export interface AuthContextValue {
  user: User | null;
  /** true enquanto tenta restaurar a sessão via refresh silencioso no load. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
