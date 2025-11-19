import { useEffect, useRef } from 'react';

function useThrottle(
  callback: () => void, 
  delay: number, 
  deps: any[] = []
) {
  const lastRan = useRef(Date.now());
  const timer = useRef<NodeJS.Timeout | null>(null);

  // 가장 최신 콜백
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastRan.current;

    // 1. 쿨타임이 지남 -> 최신 콜백 실행
    if (timeElapsed >= delay) {
      savedCallback.current();
      lastRan.current = now;
    } 
    // 2. 쿨타임 중 -> 남은 시간만큼 대기
    else {
      // 이미 예약된 타이머가 없으면 예약
      if (!timer.current) {
        const remainingTime = delay - timeElapsed;

        timer.current = setTimeout(() => {
          savedCallback.current();
          lastRan.current = Date.now();
          timer.current = null;
        }, remainingTime);
      }
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [delay, ...deps]);
}

export default useThrottle;