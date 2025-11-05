import { useEffect, useRef, useState } from 'react';

const RETRY_TIME = 1000;                // 재시도 초기 대기시간

// 파라매터 타입 정의
interface UseCustomQueryParams<T> {
    queryKey: (string | number)[];      // 캐시 키로 사용될 배열
    queryFn: () => Promise<T>;          // 데이터를 가져오는 비동기 함수
    staleTime?: number;                 // fresh로 간주하기까지 걸리는 시간
    gcTime?: number;                    // 얼마나 지나야 캐시를 정리하는지
    retry?: number;                     // 재시도 횟수
}

// 로컬스토리지 저장할 데이터 구조
interface CacheEntry<T> {
    data: T;
    lastFetchedTime: number;    // staleTime, gcTime과 비교용
}

export const useCustomQuery = <T,>({ 
    queryKey, 
    queryFn,
    staleTime = 30_000,
    gcTime = 5 * 60 * 1000,
    retry = 3
}: UseCustomQueryParams<T>) => {
    const [data, setData] = useState<T | null>(null);             // 데이터
    const [isPending, setIsPending] = useState<boolean>(false);   // 로딩 여부
    const [isError, setIsError] = useState<boolean>(false);       // 에러 여부
    const [error, setError] = useState<Error | null>(null);       // 에러 값

    const retryTimeoutRef = useRef<number | null>(null);          // retry 횟수

    useEffect(() => {
    // 데이터를 가져오는 함수 정의
    const fetchData = async (currentRetry = 0) => {

        const currentTime = new Date().getTime();                           // 현재 시간 가져오기
        const cachedItem = localStorage.getItem(JSON.stringify(queryKey));  // 가지고 있는 아이템 확인

        if(cachedItem) {
            try{
                const cachedData: CacheEntry<T> = JSON.parse(cachedItem);   // 데이터 파싱
                const dataAge = currentTime - cachedData.lastFetchedTime;

                if(dataAge > gcTime) {
                    // gcTime보다 오래됬으면 데이터를 다시 가져옴
                    localStorage.removeItem(JSON.stringify(queryKey));
                } else {
                    // 신선도 체크
                    setData(cachedData.data); // 만료시에도 마지막 데이터를 사용

                    if(currentTime - cachedData.lastFetchedTime < staleTime) {  // 신선할 경우 종료
                        setIsPending(false);
                        return;
                    }
            }
            } catch(err) {
                localStorage.removeItem(JSON.stringify(queryKey));
                setError(err as Error);
            }   
        }

        try {
            // 초기 설정
            setIsPending(true);
            setIsError(false);
            setError(null);
        
            // queryFn 실행
            const result = await queryFn();
        
            // 성공 시 데이터 저장
            setData(result);

            // staleTime을 위한 설정
            const newCacheData: CacheEntry<T> = {
                data: result,
                lastFetchedTime: new Date().getTime(),
            }
            localStorage.setItem(JSON.stringify(queryKey), JSON.stringify(newCacheData));
            setIsPending(false);
        } catch (err) {

            if(currentRetry < retry) {
                const retryDelay = Math.min(RETRY_TIME * Math.pow(2, currentRetry), 10000);  // 제곱으로 늘어남
                retryTimeoutRef.current = setTimeout(() => {
                    fetchData(currentRetry + 1);
                }, retryDelay);
            } else {
            // 실패 시 에러 저장
            setIsError(true);
            setError(err as Error);
            setIsPending(false);
            }
        }
    };

    // 함수 실행
    fetchData();

    // 메모리 청소
    return () => {
        if(retryTimeoutRef.current !== null) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    }
  }, [JSON.stringify(queryKey), queryFn]); // queryKey가 바뀌면 다시 실행

  return { data, isPending, isError, error };
};