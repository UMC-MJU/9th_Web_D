import { useEffect, useState } from 'react';

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

    useEffect(() => {
    // 데이터를 가져오는 함수 정의
    const fetchData = async () => {
      try {
        // 초기 설정
        setIsPending(true);
        setIsError(false);
        setError(null);
        
        // queryFn 실행
        const result = await queryFn();
        
        // 성공 시 데이터 저장
        setData(result);

      } catch (err) {
        // 실패 시 에러 저장
        setIsError(true);
        setError(err as Error);
      } finally {
        // 로딩 종료
        setIsPending(false);
      }
    };

    // 함수 실행
    fetchData();

  }, [JSON.stringify(queryKey), queryFn]); // queryKey가 바뀌면 다시 실행

  return { data, isPending, isError, error };
};