import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../apis';

interface LpItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  thumbnail?: string | null;
}

interface LpDetailPayload {
  data: LpItem;
}

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    enabled: Boolean(lpid),
    queryKey: ['lp', lpid],
    queryFn: async () => {
      const res = await api.get(`/lps/${lpid}`);
      const payload: LpDetailPayload = res.data?.data ? res.data : { data: res.data?.data };
      return payload.data as LpItem;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="p-4 border rounded bg-red-50 text-red-700 flex items-center justify-between gap-4">
          <div>상세를 불러오지 못했습니다.</div>
          <button onClick={() => refetch()} className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors">
            재시도
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="h-40 bg-gray-200 rounded-xl animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-24 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/lps" className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
          목록으로
        </Link>
      </div>
      <article className="border rounded p-4">
        <header className="flex items-start gap-4 mb-4">
          {data.thumbnail && (
            <img src={data.thumbnail} alt="" className="w-24 h-24 object-cover rounded" />
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold break-words">{data.title}</h1>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(data.createdAt).toLocaleString()}
            </div>
          </div>
        </header>
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {data.content}
        </div>
      </article>
    </div>
  );
}


