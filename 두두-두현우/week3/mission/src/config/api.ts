// TMDB API 관련 상수들
export const TMDB_CONFIG = {
  API_URL: "https://api.themoviedb.org/3/movie/popular",
  TOKEN:
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWU0YTYzNDFlYjkwMjZkMDViY2Y3NWQ3YzMzNTc4YyIsIm5iZiI6MTc0Mzk0Njg4Mi45OTUwMDAxLCJzdWIiOiI2N2YyODQ4MjhiMWYzMmViNzlkOWMxYzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.YwSEt3JbFA5NFDC2dUUKDgEEhYwckF7VZ9s-etsh5uk",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",
  DEFAULT_LANGUAGE: "en-US",
  DEFAULT_PAGE: 1,
} as const;

// API 헤더 설정
export const API_HEADERS = {
  Authorization: `Bearer ${TMDB_CONFIG.TOKEN}`,
  accept: "application/json",
} as const;
