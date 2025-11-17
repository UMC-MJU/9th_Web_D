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
  USER: {
    ME: "/v1/users/me",
    UPDATE: "/v1/users",
  },
  LP: {
    LIST: "/v1/lps",
    DETAIL: (id: number | string) => `/v1/lps/${id}`,
    COMMENTS: (id: number | string) => `/v1/lps/${id}/comments`,
    LIKES: (id: number | string) => `/v1/lps/${id}/likes`,
  },
  UPLOAD: {
    FILE: "/v1/uploads", // 인증 필요
    PUBLIC_FILE: "/v1/uploads/public", // 비인증
  },
} as const;
