import { useEffect, useMemo, useState } from "react";
import { API_HEADERS } from "../config/api";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  query?: QueryParams;
  body?: BodyInit | null;
  enabled?: boolean;
};

function buildUrlWithQuery(url: string, query?: QueryParams): string {
  if (!query) return url;
  const urlObj = new URL(url);
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    urlObj.searchParams.set(key, String(value));
  });
  return urlObj.toString();
}

export function useTMDBRequest<T>(
  url: string,
  deps: unknown[] = [],
  options: RequestOptions = {}
) {
  const {
    method = "GET",
    headers,
    query,
    body = null,
    enabled = true,
  } = options;

  const requestUrl = useMemo(() => buildUrlWithQuery(url, query), [url, query]);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const execute = async () => {
      if (!enabled) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(requestUrl, {
          method,
          headers: { ...API_HEADERS, ...headers },
          body,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: T = await response.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    execute();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestUrl, method, body, enabled, ...deps]);

  return { data, loading, error } as const;
}

export type { RequestOptions };
