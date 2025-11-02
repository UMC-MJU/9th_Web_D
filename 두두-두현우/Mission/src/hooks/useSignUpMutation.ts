import { useState } from "react";
import { type SignUpResponse } from "../apis/auth";

interface UseSignUpMutationReturn {
  mutate: (
    signUpFn: () => Promise<SignUpResponse["data"]>
  ) => Promise<SignUpResponse["data"]>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

/**
 * 회원가입 mutation hook
 * @returns mutation 함수와 상태 관리
 */
export const useSignUpMutation = (): UseSignUpMutationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = async (
    signUpFn: () => Promise<SignUpResponse["data"]>
  ): Promise<SignUpResponse["data"]> => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setIsSuccess(false);

    try {
      const data = await signUpFn();
      setIsSuccess(true);
      return data;
    } catch (err) {
      setIsError(true);
      const errorMessage =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setIsSuccess(false);
  };

  return {
    mutate,
    isLoading,
    isError,
    error,
    isSuccess,
    reset,
  };
};
