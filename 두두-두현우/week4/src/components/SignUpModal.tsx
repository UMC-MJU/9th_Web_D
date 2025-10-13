import { useForm } from "react-hook-form";
import { useState } from "react";
import PasswordVisibleButton from "./PasswordVisibleButton";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (email: string, password: string, confirmPassword: string) => void;
}

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "이메일을 입력해주세요." })
      .email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
    confirmPassword: z
      .string()
      .min(1, { message: "비밀번호를 다시 입력해주세요." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpModal({
  isOpen,
  onClose,
  onSignup,
}: SignUpModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SignUpFormValues) => {
    onSignup(data.email, data.password, data.confirmPassword);
    reset();
    navigate("/enter-name");
  };

  const handleClose = () => {
    reset();
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
          <h2 className="text-2xl font-bold text-white mb-2">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                {...register("password")}
                className={`w-full px-4 pr-12 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400/50"
                    : "border-white/20 focus:ring-white/30"
                }`}
                placeholder="비밀번호를 입력하세요 (최소 8자)"
              />
              <PasswordVisibleButton
                isVisible={isPasswordVisible}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
            </div>
            {errors.password && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full px-4 pr-12 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-red-400/50"
                    : "border-white/20 focus:ring-white/30"
                }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              <PasswordVisibleButton
                isVisible={isConfirmPasswordVisible}
                onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
              />
            </div>
            {errors.confirmPassword && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.confirmPassword.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-2xl whitespace-nowrap hover:bg-white/90 transition-all duration-300 cursor-pointer"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
