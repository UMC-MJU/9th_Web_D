import { useRef, useCallback, useEffect } from "react";

/**
 * 함수를 throttle하는 훅
 * @param callback - throttle할 함수
 * @param delay - 제한 시간 (밀리초, 0 이상의 숫자여야 함)
 * @returns throttle된 함수
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  // delay 유효성 검사 및 정규화
  const normalizedDelay = Math.max(0, Number.isFinite(delay) ? delay : 0);

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      // callback이 유효하지 않으면 실행하지 않음
      if (typeof callback !== "function") {
        console.warn("useThrottle: callback must be a function");
        return;
      }

      // delay가 0이면 즉시 실행 (throttling 없음)
      if (normalizedDelay === 0) {
        callback(...args);
        return;
      }

      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      // 마지막 실행으로부터 delay 시간이 지났으면 즉시 실행
      if (timeSinceLastRun >= normalizedDelay) {
        lastRun.current = now;
        callback(...args);
      } else {
        // 아직 delay 시간이 지나지 않았으면, 남은 시간 후에 실행하도록 예약
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        const remainingTime = normalizedDelay - timeSinceLastRun;
        timeoutRef.current = window.setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
          timeoutRef.current = null;
        }, remainingTime);
      }
    }) as T,
    [callback, normalizedDelay]
  );
}
