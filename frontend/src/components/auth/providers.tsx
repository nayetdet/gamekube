'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  beginLogin,
  clearTokens,
  decodeJwt,
  getStoredTokens,
  getValidAccessToken,
  logout,
  subscribeToTokens,
  type AuthTokens,
} from '@/lib/oidc';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthUser {
  username: string;
  name: string;
  roles: string[];
}

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function userFromTokens(tokens: AuthTokens | null): AuthUser | null {
  if (!tokens) return null;
  const payload = decodeJwt(tokens.accessToken);
  const username = payload.preferred_username ?? 'Jogador';
  return {
    username,
    name: payload.name ?? username,
    roles: payload.realm_access?.roles ?? [],
  };
}

export function Providers({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const synchronize = (nextTokens: AuthTokens | null) => {
      setTokens(nextTokens);
      setStatus(nextTokens ? 'authenticated' : 'anonymous');
    };
    const unsubscribe = subscribeToTokens(synchronize);
    const initialTokens = getStoredTokens();
    synchronize(initialTokens);
    if (initialTokens) {
      void getValidAccessToken().then(() => synchronize(getStoredTokens()));
    }
    return unsubscribe;
  }, []);

  const login = useCallback(() => beginLogin(), []);
  const value = useMemo(() => {
    const user = userFromTokens(tokens);
    return {
      status,
      user,
      isAdmin: user?.roles.includes('admin') ?? false,
      login,
      logout,
    };
  }, [login, status, tokens]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de Providers.');
  return context;
}

export function useSessionExpiredHandler() {
  const { status } = useAuth();
  useEffect(() => {
    if (status === 'anonymous') clearTokens();
  }, [status]);
}
