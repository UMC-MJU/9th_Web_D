// 회원가입 요청 타입
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
}

// 회원가입 응답 타입
export interface SignUpResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
}

// 에러 응답 타입
export interface ApiError {
  status: boolean;
  statusCode: number;
  message: string;
  error?: string;
}

// 회원가입 데이터 타입
export interface SignUpData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
}

// 로그인 Mutation 결과 타입
export interface UseLoginMutationResult {
  mutate: (email: string, password: string) => Promise<LoginResponse["data"]>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
}

// 회원가입 Mutation 결과 타입
export interface UseSignUpMutationResult {
  mutate: (data: SignUpData) => Promise<SignUpResponse["data"]>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
}
