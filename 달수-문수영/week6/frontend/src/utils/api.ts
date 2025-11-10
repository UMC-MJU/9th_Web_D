import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
import { getAuthToken, logout } from './auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = getAuthToken();
  if (accessToken) {
    // AxiosHeaders 타입일 때
    config.headers.set?.('Authorization', `Bearer ${accessToken}`);
    // 일반 객체일 때
    if (!config.headers.set) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r: AxiosResponse) => r,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      logout();
      window.location.replace('/login');
    }
    return Promise.reject(err);
  }
);