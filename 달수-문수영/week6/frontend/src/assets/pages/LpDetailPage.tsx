import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../apis';
import QueryState from '../../components/QueryState';
import { isLoggedIn, getUserInfo, getCurrentUserEmail } from '../../utils/auth';

interface LpItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  thumbnail?: string | null;
  authorId?: number;
  author?: { id: number; name: string; email: string } | null;
  tags?: { id: number; name: string }[];
}

interface LpDetailPayload {
  data: LpItem;
}

interface LpComment {
  id: number;
  content: string;
  createdAt: string;
  authorId?: number;
  author?: { id: number; name: string; email: string } | null;
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
  const currentUserId = Number(getUserInfo().id || NaN);
  const currentEmail = getCurrentUserEmail();
  const navigate = useNavigate();

  // LP 수정 상태
  const [editingLp, setEditingLp] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [editThumbnail, setEditThumbnail] = useState<string>('');
  const [thumbPreview, setThumbPreview] = useState<string>('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

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

  const mine =
    (typeof currentUserId === 'number' && !Number.isNaN(currentUserId) && (data.authorId === currentUserId || Number(data.author?.id) === currentUserId)) ||
    (!!currentEmail && data.author?.email === currentEmail);

  // LP 수정
  const { mutate: updateLp, isPending: updatingLp } = useMutation({
    mutationFn: async (payload: { title?: string; content?: string; thumbnail?: string; tags?: string[] }) => {
      const res = await api.patch(`/lps/${lpid}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      setEditingLp(false);
      setThumbPreview('');
    },
  });

  // LP 삭제
  const { mutate: deleteLp, isPending: deletingLp } = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/lps/${lpid}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/lps', { replace: true });
    },
  });

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

  // 댓글 수정
  const { mutate: updateComment, isPending: updatingComment } = useMutation({
    mutationFn: async (payload: { commentId: number; content: string }) => {
      const res = await api.patch(`/lps/${lpid}/comments/${payload.commentId}`, {
        content: payload.content,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
      setEditingId(null);
      setEditingText('');
      setMenuOpenId(null);
    },
  });

  const startEdit = (commentId: number, content: string) => {
    setEditingId(commentId);
    setEditingText(content);
    setMenuOpenId(null);
  };

  const saveEdit = (commentId: number) => {
    const text = editingText.trim();
    if (!text) return;
    updateComment({ commentId, content: text });
  };

  // 댓글 삭제
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await api.delete(`/lps/${lpid}/comments/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
      setMenuOpenId(null);
    },
  });

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
            <img src={editingLp ? (thumbPreview || editThumbnail || data.thumbnail) : data.thumbnail} alt="" className="w-24 h-24 object-cover rounded" />
          )}
          <div className="min-w-0">
            {editingLp ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-semibold border rounded px-2 py-1"
                placeholder="제목"
              />
            ) : (
              <h1 className="text-xl font-semibold break-words">{data.title}</h1>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(data.createdAt).toLocaleString()}
            </div>
          </div>

          {mine && (
            <div className="ml-auto flex items-center gap-2">
              {editingLp ? (
                <>
                  <button
                    type="button"
                    aria-label="썸네일 변경"
                    title="썸네일 변경"
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
                    onClick={() => fileRef.current?.click()}
                  >
                    <span role="img" aria-hidden="true">🖼️</span>
                  </button>
                  <button
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    onClick={() => {
                      setEditingLp(false);
                      setEditTitle('');
                      setEditContent('');
                      setEditThumbnail('');
                      setThumbPreview('');
                      setEditTags([]);
                      setTagInput('');
                    }}
                    disabled={updatingLp}
                  >
                    취소
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                    onClick={() => {
                      const payload: { title?: string; content?: string; thumbnail?: string; tags?: string[] } = {
                        title: editTitle || undefined,
                        content: editContent || undefined,
                        thumbnail: (editThumbnail || thumbPreview) || undefined,
                      };
                      if (editTags.length > 0) payload.tags = editTags;
                      updateLp(payload);
                    }}
                    disabled={updatingLp}
                  >
                    저장
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    onClick={() => {
                      setEditingLp(true);
                      setEditTitle(data.title);
                      setEditContent(data.content);
                      setEditThumbnail(data.thumbnail ?? '');
                      setEditTags((data.tags ?? []).map((t) => t.name));
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:bg-red-200"
                    onClick={() => {
                      if (confirm('정말 삭제하시겠습니까?')) deleteLp();
                    }}
                    disabled={deletingLp}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
        </header>
        {/* 파일 입력 (숨김) */}
        {editingLp && (
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const local = URL.createObjectURL(f);
              if (thumbPreview) URL.revokeObjectURL(thumbPreview);
              setThumbPreview(local);
              try {
                const form = new FormData();
                form.append('file', f);
                const { data: up } = await api.post('/uploads', form, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                const url = up?.data?.imageUrl ?? up?.imageUrl ?? '';
                if (url) setEditThumbnail(url);
              } finally {
                e.currentTarget.value = '';
              }
            }}
          />
        )}
        {editingLp ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-32 border rounded p-2"
            placeholder="내용"
          />
        ) : (
          <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
            {data.content}
          </div>
        )}

        {/* 태그 */}
        <div className="mt-3">
          {editingLp ? (
            <div>
              <label className="block text-xs text-gray-600 mb-1">태그</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  placeholder="태그 입력 후 추가"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const t = tagInput.trim();
                      if (!t) return;
                      if (editTags.includes(t)) {
                        setTagInput('');
                        return;
                      }
                      setEditTags((prev) => [...prev, t]);
                      setTagInput('');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const t = tagInput.trim();
                    if (!t) return;
                    if (editTags.includes(t)) {
                      setTagInput('');
                      return;
                    }
                    setEditTags((prev) => [...prev, t]);
                    setTagInput('');
                  }}
                  className="px-3 py-2 text-sm rounded bg-gray-500 text-white hover:bg-gray-400"
                >
                  추가
                </button>
              </div>
              {editTags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {editTags.map((t, idx) => (
                    <li key={`${t}-${idx}`} className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 border flex items-center gap-1">
                      <span className="font-medium">#{t}</span>
                      <button
                        type="button"
                        className="hover:text-red-600"
                        onClick={() => setEditTags((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {(data.tags ?? []).map((t) => (
                <li key={t.id} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">#{t.name}</li>
              ))}
            </ul>
          )}
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
              {comments.map((c) => {
                const mine =
                  (typeof currentUserId === 'number' && !Number.isNaN(currentUserId) && (c.authorId === currentUserId || Number(c.author?.id) === currentUserId)) ||
                  (!!currentEmail && c.author?.email === currentEmail);
                const isEditing = editingId === c.id;
                return (
                  <li key={c.id} className="p-3 relative">
                    <div className="flex items-start justify-between mb-1">
                      <div className="text-xs text-gray-500">
                        {(c.author?.name ?? '익명')} · {new Date(c.createdAt).toLocaleString()}
                      </div>
                      {mine && (
                        <div className="relative">
                          <button
                            type="button"
                            aria-label="댓글 메뉴 열기"
                            className="px-2 py-1 text-gray-500 hover:text-gray-800"
                            onClick={() => setMenuOpenId((prev) => (prev === c.id ? null : c.id))}
                          >
                            ⋯
                          </button>
                          {menuOpenId === c.id && (
                            <div className="absolute right-0 mt-1 w-28 rounded border bg-white shadow z-10">
                              <button
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={() => startEdit(c.id, c.content)}
                              >
                                수정
                              </button>
                              <button
                                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={() => deleteComment(c.id)}
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          className="w-full min-h-20 border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                            onClick={() => {
                              setEditingId(null);
                              setEditingText('');
                            }}
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            disabled={!editingText.trim() || updatingComment}
                            className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                            onClick={() => saveEdit(c.id)}
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">{c.content}</div>
                    )}
                  </li>
                );
              })}
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
                ) : null}
              </div>
            )}
            <div ref={sentinelRef} className="h-px" />
          </>
        </QueryState>
      </section>
    </div>
  );
}


