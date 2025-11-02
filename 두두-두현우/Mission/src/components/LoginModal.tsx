import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../hooks/useLoginMutation";
import {
  TIMING,
  ERROR_MESSAGES,
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
} from "../constants";
import { type LoginResponse, type ApiError } from "../apis/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
  onGoogleLogin: () => void;
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onGoogleLogin,
}: LoginModalProps) {
  const [loginState, setLoginState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loginError, setLoginError] = useState("");

  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse["data"]> => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: false,
        statusCode: response.status,
        message: data.message || ERROR_MESSAGES.LOGIN.FAILED,
        error: data.error,
      } as ApiError;
    }

    // 로그인 성공 시 토큰을 localStorage에 저장
    if (data.data?.accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
    }
    if (data.data?.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
    }

    return data.data;
  };

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setLoginError("");
    setLoginState("loading");

    try {
      const userData = await loginMutation.mutate(() => login(email, password));

      setLoginState("success");
      onLoginSuccess(userData.name);

      // 성공 애니메이션 후 모달 닫기
      setTimeout(() => {
        handleClose();
      }, TIMING.MODAL_CLOSE_DELAY);
    } catch {
      setLoginState("error");
      setLoginError(loginMutation.error || ERROR_MESSAGES.LOGIN.FAILED);

      // 에러 상태 초기화
      setTimeout(() => {
        setLoginState("idle");
      }, TIMING.ERROR_RESET_DELAY);
    }
  };

  const handleClose = () => {
    reset();
    setLoginError("");
    setLoginState("idle");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={handleClose}
      />
      <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        {/* 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">로그인</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 아이디 입력 */}
          <div>
            <input
              type="text"
              {...register("email")}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="아이디를 입력하세요"
              disabled={loginState === "loading"}
            />
            {errors.email && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.email.message as string}</span>
              </div>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="비밀번호를 입력하세요"
              disabled={loginState === "loading"}
            />
            {errors.password && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.password.message as string}</span>
              </div>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={
              !isValid || loginState === "loading" || loginState === "success"
            }
            className={`w-full py-3 font-semibold rounded-2xl whitespace-nowrap transition-all duration-300 flex items-center justify-center space-x-2 ${
              !isValid
                ? "bg-white/30 text-white/50 cursor-not-allowed"
                : loginState === "loading"
                ? "bg-white text-black opacity-80 cursor-not-allowed"
                : loginState === "success"
                ? "bg-green-400 text-white cursor-pointer"
                : loginState === "error"
                ? "bg-white text-black animate-shake hover:bg-white/90 cursor-pointer"
                : "bg-white text-black hover:bg-white/90 cursor-pointer"
            }`}
          >
            {loginState === "loading" && (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>로그인 중...</span>
              </>
            )}
            {loginState === "success" && (
              <>
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-check-line text-lg animate-bounce"></i>
                </div>
                <span>로그인 성공!</span>
              </>
            )}
            {(loginState === "idle" || loginState === "error") && (
              <span>로그인</span>
            )}
          </button>

          {/* 로그인 오류 메시지 */}
          {loginError && (
            <div className="text-red-300 text-sm flex items-center justify-center space-x-1">
              <i className="ri-error-warning-line text-xs"></i>
              <span>{loginError}</span>
            </div>
          )}

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60">또는</span>
            </div>
          </div>

          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            className="w-full py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl text-white font-medium cursor-pointer whitespace-nowrap hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={onGoogleLogin}
            disabled={loginState === "loading" || loginState === "success"}
          >
            <i className="ri-google-fill text-red-400"></i>
            <span>구글로 로그인</span>
          </button>
        </form>
      </div>
    </div>
  );
}
