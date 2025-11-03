import axios, { type InternalAxiosRequestConfig } from "axios";
import { Local_STORAGE_KEYS } from "../constants/key";

// RequestConfig에 retry 추가
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 요청 재시도를 나타낼 플래그
}

// Axios 인스턴스 생성 (API 서버의 기본 URL 설정)
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// refresh 요청의 promise를 저장해 중복 방지
let refreshPromise: Promise<string | void> | null = null;

/*
 1. 요청 인터셉터 : API 요청이 서버로 전송되기 직전에 실행
*/
axiosInstance.interceptors.request.use((config) => {
    // localStorage API 직접 사용
    const accessTokenString = localStorage.getItem(Local_STORAGE_KEYS.accessToken);

    if (accessTokenString) {
        // localStorage에서 가져온 값 파싱
        const accessToken = JSON.parse(accessTokenString);

        config.headers = config.headers || {};
        // 'Authorization' 헤더에 'Bearer' 토큰을 추가
        config.headers.Authorization = `Bearer ${accessToken}`; 
    }

    // 헤더가 추가된 config로 요청을 계속 진행
    return config;
}, (error) => Promise.reject(error));

/*
 2. 응답 인터셉터 : API 응답을 받은 직후에 실행
*/
axiosInstance.interceptors.response.use(
    (response) => {
        // 2-1. 성공적인 응답은 그대로 반환
        return response;
    },
    async (error) => {
        // 2-2 : 에러 응답 처리
        const originalRequest: CustomInternalAxiosRequestConfig = error.config!;

        // 401 에러(토큰 만료)이고, 아직 재시도되지 않은 요청인지 확인
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            
            // 2-2-1 : 무한 루프 방지 (Refresh Token 만료 시)
            if (originalRequest.url === "/v1/auth/refresh") {
                // localStorage API 직접 사용
                localStorage.removeItem(Local_STORAGE_KEYS.accessToken);
                localStorage.removeItem(Local_STORAGE_KEYS.refreshToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }
            
            // 무한 재시도 방지
            originalRequest._retry = true;

            // 2-2-2 : 토큰 갱신 중복 실행 방지
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    // localStorage API 직접 사용
                    const refreshTokenString = localStorage.getItem(
                        Local_STORAGE_KEYS.refreshToken,
                    );
                    // localStorage에서 가져온 값 파싱
                    const refreshToken = refreshTokenString ? JSON.parse(refreshTokenString) : null;

                    // 토큰 갱신 API 호출
                    const { data } = await axiosInstance.post("/v1/auth/refresh", {
                        refresh: refreshToken,
                    });

                    const newAccessToken = data.data.accessToken;
                    const newRefreshToken = data.data.refreshToken;

                    // localStorage API 직접 사용
                    // localStorage에 저장 시 JSON.stringify 사용
                    localStorage.setItem(
                        Local_STORAGE_KEYS.accessToken,
                        JSON.stringify(newAccessToken)
                    );
                    localStorage.setItem(
                        Local_STORAGE_KEYS.refreshToken,
                        JSON.stringify(newRefreshToken)
                    );

                    return newAccessToken;
                })().catch((error) => {
                    // localStorage API 직접 사용
                    localStorage.removeItem(Local_STORAGE_KEYS.accessToken);
                    localStorage.removeItem(Local_STORAGE_KEYS.refreshToken);
                    window.location.href = "/login";
                    return Promise.reject(error); // 에러 전파
                }).finally(() => {
                    refreshPromise = null;
                });
            }

            // 2-2-3 : 후속 요청 처리
            return refreshPromise.then((newAccessToken) => {
                // 띄어쓰기 수정!
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                // 갱신된 새 토큰으로 원래 요청을 다시 시도
                return axiosInstance(originalRequest);
            }).catch(error => {
                return Promise.reject(error);
            });
        }
        
        // 401 에러가 아니거나 이미 재시도된 요청은 그대로 에러 반환
        return Promise.reject(error);
    }
);