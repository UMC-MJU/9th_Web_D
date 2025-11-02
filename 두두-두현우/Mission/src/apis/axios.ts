import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../constants";

// 커스텀 요청 설정 타입
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  skipAuthRefresh?: boolean;
}

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 최대 재시도 횟수
const MAX_RETRY_COUNT = 1;

// 토큰 갱신 중복 요청 방지를 위한 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor - 모든 요청에 Access Token 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Access Token 만료 시 Refresh Token으로 재발급
axiosInstance.interceptors.response.use(
  <T>(response: T) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 재시도 횟수 초기화
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    // skipAuthRefresh 플래그가 있는 요청은 재시도하지 않음 (무한 루프 방지)
    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    // 401 Unauthorized 에러이고, 재시도 횟수가 최대치를 넘지 않은 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest._retryCount < MAX_RETRY_COUNT
    ) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // Refresh Token이 없으면 로그아웃
        isRefreshing = false;
        processQueue(new Error("Refresh Token이 없습니다."), null);
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Refresh Token으로 새로운 Access Token 발급 요청
        // skipAuthRefresh 플래그를 추가하여 이 요청은 인터셉터를 거치지 않도록 함
        const response = await axios.post(
          `${API_BASE_URL}/v1/auth/refresh`,
          { refresh: refreshToken },
          {
            skipAuthRefresh: true,
          } as CustomAxiosRequestConfig
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // 새로운 토큰 저장
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        // 대기 중인 요청들에 새 토큰 전달
        processQueue(null, newAccessToken);

        // 원래 요청에 새 토큰 적용 후 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료되었거나 오류 발생 시
        isRefreshing = false;
        processQueue(refreshError as Error, null);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // 401이 아니거나, 이미 재시도했거나, 재시도 횟수를 초과한 경우
    return Promise.reject(error);
  }
);

// 로그아웃 처리 함수
const handleLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USERNAME);

  // 로그인 페이지로 리다이렉트
  window.location.href = "/";
};

export default axiosInstance;
