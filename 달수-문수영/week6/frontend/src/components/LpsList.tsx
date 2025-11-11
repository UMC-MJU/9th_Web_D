import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../apis';
import { Link } from 'react-router-dom';

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

export default function LpsList() {
  const [sort, setSort] = useState<Order>('desc'); // 최신순 기본

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['lps', sort],
    queryFn: async () => {
      const res = await api.get('/lps', { params: { order: sort, limit: 10 } });
      // 백엔드 공통 래핑: { status, statusCode, message, data: { data, nextCursor, hasNext } }
      const payload: LpListPayload = res.data?.data;
      return payload;
    },
    // 캐시 정책: 30초 동안은 fresh, 5분 후 가비지 컬렉션
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const list = data?.data ?? [];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">LP 목록</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">정렬</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Order)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="정렬 선택"
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </div>
      </div>

      {isLoading ? (
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
      ) : error ? (
        <div className="p-4 border rounded bg-red-50 text-red-700 flex items-center justify-between gap-4">
          <div>
            목록을 불러오지 못했습니다.
            <span className="ml-1 text-red-500 text-xs">
              {(error as any)?.message ? `(${(error as any).message})` : ''}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors"
          >
            재시도
          </button>
        </div>
      ) : (
        <ul className="divide-y border rounded">
          {list.map((lp) => (
            <li key={lp.id} className="p-0">
              <Link
                to={`/lp/${lp.id}`}
                className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors block"
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
          {list.length === 0 && (
            <li className="p-4 text-sm text-gray-500">표시할 항목이 없습니다.</li>
          )}
        </ul>
      )}

      <div className="mt-3 text-xs text-gray-500">
        {isFetching ? '갱신 중...' : ''}
      </div>
    </div>
  );
}


