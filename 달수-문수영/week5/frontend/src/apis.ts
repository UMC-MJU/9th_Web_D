import axios from 'axios';
import { tokenStorage } from './lib/token';

export const api = axios.create({
  baseURL: 'http://localhost:8000/v1',
});

let isRefreshing = false;
let queue: Array<(t: string | null) => void> = [];
const flushQueue = (t: string | null) => { queue.forEach(fn => fn(t)); queue = []; };

api.interceptors.request.use((config) => {
  const at = tokenStorage.getAccess();
  if (at) config.headers.Authorization = `Bearer ${at}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    const status = error.response?.status;

    if (status !== 401 || original?._retry) throw error;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((newAccess) => {
          if (!newAccess) return reject(error);
          original.headers.Authorization = `Bearer ${newAccess}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refresh = tokenStorage.getRefresh();
      if (!refresh) throw error;
      const { data } = await api.post('/auth/refresh', { refresh });
      tokenStorage.set(data.accessToken, data.refreshToken);
      flushQueue(data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (e) {
      flushQueue(null);
      tokenStorage.clear();
      window.location.href = '/login';
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
);