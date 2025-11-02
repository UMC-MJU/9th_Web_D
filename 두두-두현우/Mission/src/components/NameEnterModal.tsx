import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../hooks/useSignUpMutation";
import { ERROR_MESSAGES, API_BASE_URL, API_ENDPOINTS } from "../constants";
import { type SignUpResponse, type ApiError } from "../apis/auth";

interface NameEnterModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password: string;
  onSignUpSuccess: (username: string) => void;
}

type NameFormValues = {
  name: string;
};

export default function NameEnterModal({
  isOpen,
  onClose,
  email,
  password,
  onSignUpSuccess,
}: NameEnterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const signUpMutation = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NameFormValues>();
  const navigate = useNavigate();

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<SignUpResponse["data"]> => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: false,
        statusCode: response.status,
        message: responseData.message || ERROR_MESSAGES.SIGNUP.FAILED,
        error: responseData.error,
      } as ApiError;
    }

    return responseData.data;
  };

  const onSubmit = async (data: NameFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      await signUpMutation.mutate(() => signUp(data.name, email, password));

      onSignUpSuccess(data.name);
      handleClose();
    } catch {
      setError(signUpMutation.error || ERROR_MESSAGES.SIGNUP.FAILED);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError("");
    setIsLoading(false);
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={handleClose}
      />
      <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            이름을 입력해주세요
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              {...register("name", {
                required: "이름을 입력해주세요.",
              })}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.name
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="이름"
              disabled={isLoading}
            />
            {errors.name && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.name.message}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-300 text-sm flex items-center justify-center space-x-1">
              <i className="ri-error-warning-line text-xs"></i>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-2xl whitespace-nowrap transition-all duration-300 ${
              isLoading
                ? "bg-white/50 text-black/50 cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90 cursor-pointer"
            }`}
          >
            {isLoading ? "가입 중..." : "환영합니다!"}
          </button>
        </form>
      </div>
    </div>
  );
}
