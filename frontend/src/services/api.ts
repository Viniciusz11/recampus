import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, notifyUnauthorized, setAccessToken } from '@/services/tokenStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Envia o cookie httpOnly do refresh token nas chamadas de /auth/*.
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

async function refreshAccessToken(): Promise<string> {
  const response = await axios.post<{ accessToken: string }>(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  return response.data.accessToken;
}

// Evita disparar vários /auth/refresh em paralelo quando múltiplas
// requisições falham com 401 ao mesmo tempo (ex: a página dispara 3 queries
// de uma vez com o access token expirado) - todas esperam a mesma promise.
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const isAuthRoute = originalRequest?.url?.includes('/auth/') ?? false;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken();
      const newAccessToken = await refreshPromise;
      setAccessToken(newAccessToken);
      originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
      return await api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      notifyUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);
