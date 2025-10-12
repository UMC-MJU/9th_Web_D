import { useCallback, useEffect, useRef, useState } from "react";

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

interface UseCustomFetchOptions<T> {
	fetcher: Fetcher<T>;
	deps?: unknown[];
	initialData?: T | null;
	enabled?: boolean;
}

export function useCustomFetch<T>({
	fetcher,
	deps = [],
	initialData = null,
	enabled = true,
}: UseCustomFetchOptions<T>) {
	const [data, setData] = useState<T | null>(initialData);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<unknown>(null);
	const abortRef = useRef<AbortController | null>(null);

	const run = useCallback(async () => {
		if (!enabled) return;

		// 이전 요청이 있다면 취소
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setIsPending(true);
		setError(null);

		try {
			const result = await fetcher(controller.signal);
			setData(result);
		} catch (err: any) {
			// StrictMode 등의 이펙트 중복으로 인한 취소는 에러로 간주하지 않음
			if (
				!(
					(err instanceof DOMException && err.name === "AbortError") ||
					err?.name === "CanceledError" ||
					err?.code === "ERR_CANCELED"
				)
			) {
				setError(err);
			}
		} finally {
			setIsPending(false);
		}
	}, [fetcher, enabled]);

	useEffect(() => {
		run();
		return () => abortRef.current?.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [run, ...deps]);

	const refetch = useCallback(() => {
		run();
	}, [run]);

	return { data, isPending, isError: Boolean(error), error, refetch } as const;
}

export default useCustomFetch;


