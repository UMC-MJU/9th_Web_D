import { useParams, Link } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../apis';
import QueryState from '../../components/QueryState';
import { isLoggedIn } from '../../utils/auth';

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

interface LpComment {
  id: number;
  content: string;
  createdAt: string;
  author?: { id: number; nickname: string } | null;
}

interface LpCommentsPayload {
  data: LpComment[];
  nextCursor: number | null;
  hasNext: boolean;
}

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [commentInput, setCommentInput] = useState<string>('');
  const queryClient = useQueryClient();

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

  // 댓글 무한 스크롤
  const {
    data: commentPages,
    isLoading: commentsLoading,
    isError: commentsError,
    error: commentsErrorObj,
    refetch: refetchComments,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingNextComments,
  } = useInfiniteQuery({
    enabled: Boolean(lpid),
    queryKey: ['lpComments', lpid, order],
    queryFn: async ({ pageParam }): Promise<LpCommentsPayload> => {
      const res = await api.get(`/lps/${lpid}/comments`, {
        params: { order, limit: 10, cursor: pageParam ?? undefined },
      });
      const payload: LpCommentsPayload = res.data?.data;
      return payload;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage?.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const comments: LpComment[] = useMemo(
    () => (commentPages?.pages ?? []).flatMap((p) => p?.data ?? []),
    [commentPages]
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMoreComments && !isFetchingNextComments) {
        fetchNextComments();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextComments, hasMoreComments, isFetchingNextComments]);

  // 댓글 작성
  const { mutate: createComment, isPending: creatingComment } = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/lps/${lpid}/comments`, { content });
      return res.data;
    },
    onSuccess: () => {
      // 댓글 목록 무효화(정렬 값이 포함된 모든 목록에 반영)
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
      setCommentInput('');
    },
  });

  const handleSubmitComment = () => {
    const text = commentInput.trim();
    if (!text) return;
    if (!isLoggedIn()) {
      window.location.href = '/login';
      return;
    }
    createComment(text);
  };

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

      {/* 댓글 섹션 */}
      <section className="mt-6">
        {/* 헤더 + 정렬 + 입력이 한 박스 안에 */}
        <div className="mb-4 rounded-lg border bg-white p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">댓글</h2>
            <div className="inline-flex overflow-hidden rounded-md border border-gray-300">
              <button
                type="button"
                className={`px-3 py-1 text-xs ${order === 'asc' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setOrder('asc')}
              >
                오래된순
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-xs ${order === 'desc' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setOrder('desc')}
              >
                최신순
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="lp-comment-input"
              type="text"
              className="flex-1 h-9 border border-gray-300 rounded-md px-3 text-sm bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder={isLoggedIn() ? '댓글을 입력해주세요' : '로그인 후 댓글을 작성할 수 있습니다.'}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <button
              type="button"
              disabled={!commentInput.trim() || creatingComment}
              className="px-3 h-9 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              onClick={handleSubmitComment}
            >
              작성
            </button>
          </div>
        </div>

        <QueryState
          isLoading={commentsLoading}
          isError={commentsError}
          onRetry={() => refetchComments()}
          errorMessage={(commentsErrorObj as any)?.message}
          skeleton={
            <ul className="divide-y border rounded animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </li>
              ))}
            </ul>
          }
        >
          <>
            <ul className="divide-y border rounded">
              {comments.map((c) => (
                <li key={c.id} className="p-3">
                  <div className="text-xs text-gray-500 mb-1">
                    {(c.author?.nickname ?? '익명')} · {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">{c.content}</div>
                </li>
              ))}
              {comments.length === 0 && (
                <li className="p-3 text-sm text-gray-500">첫 댓글을 남겨보세요.</li>
              )}
            </ul>

            {/* 하단 스켈레톤 또는 더보기 */}
            {isFetchingNextComments ? (
              <ul className="mt-3 divide-y border rounded animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 flex items-center justify-center">
                {hasMoreComments ? (
                  <button
                    onClick={() => fetchNextComments()}
                    disabled={isFetchingNextComments}
                    className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    더 보기
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">모든 댓글을 확인했습니다.</span>
                )}
              </div>
            )}
            <div ref={sentinelRef} className="h-px" />
          </>
        </QueryState>
      </section>
    </div>
  );
}


