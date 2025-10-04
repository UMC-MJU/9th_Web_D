// TMDB API 관련 상수들
export const TMDB_CONFIG = {
  API_URL: "https://api.themoviedb.org/3/movie/popular",
  TOKEN: import.meta.env.VITE_TMDB_TOKEN,
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",
  DEFAULT_LANGUAGE: "en-US",
  DEFAULT_PAGE: 1,
} as const;

// API 헤더 설정
export const API_HEADERS = {
  Authorization: `Bearer ${TMDB_CONFIG.TOKEN}`,
  accept: "application/json",
} as const;
