import { useEffect, useState } from 'react';

/**
 * Returns a debounced value that updates after the given delay has elapsed
 * since the last change to the input value.
 */
export function useDebounce<T>(value: T, delay = 300): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timerId = window.setTimeout(() => {
			setDebouncedValue(value);
		}, Math.max(0, delay));

		return () => {
			window.clearTimeout(timerId);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;


