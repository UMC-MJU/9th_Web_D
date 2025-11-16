import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef, useEffect, useState } from 'react';
import { api } from '../apis';
import { Link } from 'react-router-dom';
import QueryState from './QueryState';
import CreateLpModal from './CreateLpModal';
import { isLoggedIn } from '../utils/auth';

type Order = 'asc' | 'desc';

interface LpItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  thumbnail?: string | null;
}

interface LpListPayload {
  data: LpItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export default function InfiniteLpsList() {
  const [order, setOrder] = useState<Order>('desc');
  const [openCreate, setOpenCreate] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', order],
    queryFn: async ({ pageParam }): Promise<LpListPayload> => {
      const res = await api.get('/lps', {
        params: {
          order,
          limit: 10,
          cursor: pageParam ?? undefined,
        },
      });
      // 공통 래핑 가정: { status, statusCode, message, data: { data, nextCursor, hasNext } }
      const payload: LpListPayload = res.data?.data;
      return payload;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext ? lastPage.nextCursor : undefined;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // 플랫 리스트
  const items: LpItem[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p?.data ?? []),
    [data]
  );

  // 하단 센티널 자동 로드
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">LP 목록</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">정렬</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as Order)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="정렬 선택"
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </div>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        errorMessage={(error as any)?.message}
        skeleton={
          <ul className="divide-y border rounded animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-gray-200" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        }
      >
        <>
          <ul className="divide-y border rounded">
            {items.map((lp) => (
              <li key={lp.id} className="p-0">
                <Link
                  to={`/lp/${lp.id}`}
                  className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  aria-label={`${lp.title} 상세 보기`}
                >
                  {lp.thumbnail && (
                    <img
                      src={lp.thumbnail}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{lp.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(lp.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {items.length === 0 && (
              <li className="p-4 text-sm text-gray-500">표시할 항목이 없습니다.</li>
            )}
          </ul>

          {/* 더 보기 버튼 */}
          <div className="mt-3 flex items-center justify-center">
            {hasNextPage ? (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </button>
            ) : (
              <span className="text-xs text-gray-500">마지막 페이지입니다.</span>
            )}
          </div>
          <div ref={sentinelRef} className="h-px" />
        </>
      </QueryState>

      {/* 플로팅 생성 버튼 */}
      <button
        type="button"
        aria-label="LP 글 작성"
        className="fixed z-50 bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition-colors"
        onClick={() => {
          if (!isLoggedIn()) {
            window.location.href = '/login';
            return;
          }
          setOpenCreate(true);
        }}
      >
        +
      </button>

      <CreateLpModal open={openCreate} onClose={() => setOpenCreate(false)} />
    </div>
  );
}


