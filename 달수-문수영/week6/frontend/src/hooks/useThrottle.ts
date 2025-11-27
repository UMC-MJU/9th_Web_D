import { useEffect, useRef, useState } from 'react';

/**
 * Throttle a value so that it updates at most once per given interval.
 * Leading + trailing: first change applies immediately, the last change
 * within the window is applied after the interval.
 */
export function useThrottle<T>(value: T, interval = 300): T {
	const [throttled, setThrottled] = useState<T>(value);
	const lastExecutedAtRef = useRef<number>(0);
	const trailingTimerRef = useRef<number | null>(null);
	const lastQueuedValueRef = useRef<T | null>(null);

	useEffect(() => {
		const now = Date.now();
		const elapsed = now - lastExecutedAtRef.current;
		const remaining = interval - elapsed;

		if (remaining <= 0) {
			// Execute immediately (leading)
			if (trailingTimerRef.current != null) {
				window.clearTimeout(trailingTimerRef.current);
				trailingTimerRef.current = null;
			}
			lastQueuedValueRef.current = null;
			lastExecutedAtRef.current = now;
			setThrottled(value);
		} else {
			// Queue trailing update
			lastQueuedValueRef.current = value as T;
			if (trailingTimerRef.current == null) {
				trailingTimerRef.current = window.setTimeout(() => {
					lastExecutedAtRef.current = Date.now();
					trailingTimerRef.current = null;
					if (lastQueuedValueRef.current !== null) {
						setThrottled(lastQueuedValueRef.current);
						lastQueuedValueRef.current = null;
					}
				}, remaining);
			}
		}

		return () => {
			// Cleanup if dependencies change rapidly
			// keep scheduled trailing timer unless unmount
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, interval]);

	useEffect(() => {
		return () => {
			if (trailingTimerRef.current != null) {
				window.clearTimeout(trailingTimerRef.current);
				trailingTimerRef.current = null;
			}
		};
	}, []);

	return throttled;
}

export default useThrottle;


