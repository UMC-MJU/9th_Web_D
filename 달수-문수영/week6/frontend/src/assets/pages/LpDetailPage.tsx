import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../apis';
import QueryState from '../../components/QueryState';
import { isLoggedIn, getUserInfo, getCurrentUserEmail } from '../../utils/auth';
import { tokenStorage } from '../../lib/token';

interface LpItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  thumbnail?: string | null;
  authorId?: number;
  author?: { id: number; name: string; email: string } | null;
  tags?: { id: number; name: string }[];
  likes?: { id: number; userId: number; lpId: number }[];
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
  // 사용자 ID: 토큰의 sub 우선, 없으면 userInfo.id
  const accessToken = tokenStorage.getAccess();
  let parsedUserId: number | null = null;
  try {
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1] || '')) as { sub?: number | string };
      const subNum = Number(payload?.sub);
      if (!Number.isNaN(subNum)) parsedUserId = subNum;
    }
  } catch {
    parsedUserId = null;
  }
  const currentUserId = parsedUserId ?? Number(getUserInfo().id || NaN);
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

  // 상대 시간 포맷터
  const formatRelative = (iso: string) => {
    const ts = new Date(iso).getTime();
    const diffSec = Math.floor((Date.now() - ts) / 1000);
    if (diffSec < 60) return `${diffSec}초 전`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}일 전`;
    return new Date(iso).toLocaleDateString();
  };

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

  // 좋아요
  const liked = useMemo(
    () => (data?.likes ?? []).some((l: any) => Number(l?.userId) === currentUserId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, currentUserId]
  );
  const likeCount = (data?.likes?.length ?? 0) as number;

  const { mutate: toggleLike, isPending: togglingLike } = useMutation({
    mutationFn: async (doLike: boolean) => {
      if (doLike) {
        await api.post(`/lps/${lpid}/likes`);
      } else {
        await api.delete(`/lps/${lpid}/likes`);
      }
      return true;
    },
    onMutate: async (doLike) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpid] });
      const previous = queryClient.getQueryData<any>(['lp', lpid]);
      queryClient.setQueryData(['lp', lpid], (old: any) => {
        if (!old) return old;
        const currentLikes = Array.isArray(old.likes) ? [...old.likes] : [];
        if (doLike) {
          // 낙관적 추가
          if (!currentLikes.some((x: any) => Number(x.userId) === currentUserId)) {
            currentLikes.push({ id: Date.now(), userId: currentUserId, lpId: old.id });
          }
        } else {
          // 낙관적 제거
          const idx = currentLikes.findIndex((x: any) => Number(x.userId) === currentUserId);
          if (idx >= 0) currentLikes.splice(idx, 1);
        }
        return { ...old, likes: currentLikes };
      });
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['lp', lpid], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
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
      <article className="rounded-2xl border border-gray-200 bg-white text-gray-900 p-5 md:p-6 shadow">
        <header className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-200">
                <span className="text-emerald-500 text-xs">●</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm text-gray-900 truncate">{data.author?.name ?? '익명'}</div>
                <div className="text-[11px] text-gray-500 truncate">{data.author?.email ?? ''}</div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 text-xs text-gray-500">
              <span>{formatRelative(data.createdAt)}</span>
              {mine && (
                <div className="flex items-center gap-1">
                  {editingLp ? (
                    <>
                      <button
                        type="button"
                        aria-label="썸네일 변경"
                        title="썸네일 변경"
                        className="p-1.5 rounded border border-gray-300 hover:bg-gray-100"
                        onClick={() => fileRef.current?.click()}
                      >
                        🖼️
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
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
                        className="px-2 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
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
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
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
                        className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60"
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
            </div>
          </div>

          <div className="mt-3 min-w-0">
            {editingLp ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-2xl font-semibold rounded px-2 py-1 bg-white text-gray-900 border border-gray-300"
                placeholder="제목"
              />
            ) : (
              <h1 className="text-2xl font-semibold break-words">{data.title}</h1>
            )}
          </div>
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
        {/* 썸네일 / 디스크 영역 */}
        {data.thumbnail && !editingLp && (
          <div className="mt-2">
            <div className="mx-auto max-w-xl">
              {/* LP 디스크 스타일 썸네일 */}
              <div
                className="relative aspect-square rounded-2xl bg-gray-600 ring-1 ring-black/40"
                style={{
                  boxShadow:
                    '0 14px 28px rgba(0,0,0,0.35), 0 10px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -12px 24px rgba(0,0,0,0.45)',
                }}
              >
                {/* 회전 컨테이너: 디스크+라벨 함께 회전 */}
                <div className="absolute inset-6 animate-[spin_8s_linear_infinite] will-change-transform">
                  {/* 디스크(이미지) + 블랙 링 */}
                  <div className="absolute inset-0 rounded-full overflow-hidden ring-8 ring-gray-800 shadow-xl">
                    <div
                      className="w-full h-full bg-center bg-cover"
                      style={{ backgroundImage: `url(${thumbPreview || editThumbnail || data.thumbnail})` }}
                      aria-label="LP Thumbnail"
                    />
                  </div>
                  {/* 중앙 라벨 */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white ring-4 ring-gray-200 shadow-inner" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="mt-4">
          {editingLp ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-32 rounded p-2 bg-white text-gray-900 border border-gray-300"
              placeholder="내용"
            />
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
              “{data.content}”
            </div>
          )}
        </div>

        {/* 태그 */}
        <div className="mt-4">
          {editingLp ? (
            <div>
              <label className="block text-xs text-gray-600 mb-1">태그</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 rounded px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300"
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
                  className="px-3 py-2 text-sm rounded bg-black text-white hover:bg-gray-800"
                >
                  추가
                </button>
              </div>
              {editTags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {editTags.map((t, idx) => (
                    <li key={`${t}-${idx}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300 flex items-center gap-1">
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
                <li key={t.id} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300">#{t.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 좋아요 */}
        {!editingLp && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              aria-pressed={liked}
              disabled={togglingLike}
              onClick={() => {
                if (!isLoggedIn()) {
                  window.location.href = '/login';
                  return;
                }
                toggleLike(!liked);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${liked ? 'border-pink-500 bg-pink-50 text-pink-500' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
              title={liked ? '좋아요 취소' : '좋아요'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <span className="text-pink-600 text-sm">{likeCount}</span>
          </div>
        )}
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


