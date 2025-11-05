import { useState } from 'react';

// 파라매터 타입 정의
interface UseCustomQueryParams<T> {
  queryKey: (string | number)[];    // 캐시 키로 사용될 배열
  queryFn: () => Promise<T>;        // 데이터를 가져오는 비동기 함수
}

export const useCustomQuery = <T,>({ 
    queryKey, 
    queryFn 
}: UseCustomQueryParams<T>) => {
  const [data, setData] = useState<T | null>(null);             // 데이터
  const [isPending, setIsPending] = useState<boolean>(false);   // 로딩 여부
  const [isError, setIsError] = useState<boolean>(false);       // 에러 여부
  const [error, setError] = useState<Error | null>(null);       // 에러 값

  return { data, isPending, isError, error };
};