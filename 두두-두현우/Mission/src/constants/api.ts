// API 베이스 URL
export const API_BASE_URL = "http://localhost:8000";

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "/v1/auth/signin",
    SIGNUP: "/v1/auth/signup",
    REFRESH: "/v1/auth/refresh",
    GOOGLE_LOGIN: "/v1/auth/google/login",
    GOOGLE_CALLBACK: "/v1/auth/google/callback",
  },
  LP: {
    LIST: "/v1/lps",
  },
} as const;
