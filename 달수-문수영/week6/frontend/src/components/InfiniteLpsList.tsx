import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef, useEffect, useState } from 'react';
import { api } from '../apis';
import { Link } from 'react-router-dom';
import QueryState from './QueryState';
import CreateLpModal from './CreateLpModal';
import { isLoggedIn } from '../utils/auth';
import useDebounce from '../hooks/useDebounce';

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

  // 하단 센티널 자동 로드 (사용자 스크롤 이후에만 작동)
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [intersectionSignal, setIntersectionSignal] = useState(0);
  const [userScrolled, setUserScrolled] = useState(false);
  useEffect(() => {
    const onWheel = () => setUserScrolled(true);
    const onTouchMove = () => setUserScrolled(true);
    const onKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowDown', 'PageDown', 'Space', 'End'];
      if (keys.includes(e.key)) setUserScrolled(true);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  // Demo: 스크롤(센티넬 감지) 후 3초 동안 추가 감지가 없을 때만 요청
  const debouncedSignal = useDebounce(intersectionSignal, 3000);
  const lastHandledSignalRef = useRef(0);
  useEffect(() => {
    if (debouncedSignal === 0) return;
    // 같은 신호값으로는 한 번만 처리
    if (debouncedSignal === lastHandledSignalRef.current) return;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      lastHandledSignalRef.current = debouncedSignal;
      // 한 번 로드 후에는 다시 사용자 스크롤이 있을 때만 다음 로드가 가능하도록 잠금
      setUserScrolled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSignal, hasNextPage, isFetchingNextPage]);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && userScrolled && hasNextPage && !isFetchingNextPage) {
        setIntersectionSignal((v) => v + 1);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, userScrolled]);

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

          {/* 자동 로드 상태 */}
          {isFetchingNextPage ? (
            <div className="mt-3 text-xs text-gray-500 text-center">불러오는 중...</div>
          ) : hasNextPage ? (
            <div className="mt-3 text-xs text-gray-500 text-center">하단으로 스크롤하면 3초 뒤 다음 페이지가 로드됩니다.</div>
          ) : (
            <div className="mt-3 text-xs text-gray-500 text-center">마지막 페이지입니다.</div>
          )}
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


