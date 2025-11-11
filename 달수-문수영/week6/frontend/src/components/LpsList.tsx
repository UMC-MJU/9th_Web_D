import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../apis';

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
        <div>불러오는 중...</div>
      ) : error ? (
        <div className="text-red-600">목록을 불러오지 못했습니다.</div>
      ) : (
        <ul className="divide-y border rounded">
          {list.map((lp) => (
            <li key={lp.id} className="p-3 flex items-center gap-3">
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


