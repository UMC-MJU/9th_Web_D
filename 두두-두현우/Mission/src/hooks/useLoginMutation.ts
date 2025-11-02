import { useState } from "react";
import { type LoginResponse } from "../apis/auth";

interface UseLoginMutationReturn {
  mutate: (
    loginFn: () => Promise<LoginResponse["data"]>
  ) => Promise<LoginResponse["data"]>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

/**
 * 로그인 mutation hook
 * @returns mutation 함수와 상태 관리
 */
export const useLoginMutation = (): UseLoginMutationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = async (
    loginFn: () => Promise<LoginResponse["data"]>
  ): Promise<LoginResponse["data"]> => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setIsSuccess(false);

    try {
      const data = await loginFn();
      setIsSuccess(true);
      return data;
    } catch (err) {
      setIsError(true);
      const errorMessage =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
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
