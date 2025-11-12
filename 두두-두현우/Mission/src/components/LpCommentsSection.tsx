import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  createLpComment,
  fetchLpComments,
  type CreateLpCommentRequest,
  type LpComment,
  type LpCommentListResponse,
} from "../apis/lp";
import { STORAGE_KEYS } from "../constants";

const COMMENT_PAGE_SIZE = 10;
const COMMENT_ORDER: "asc" | "desc" = "desc";
const COMMENT_CHUNK_SIZE = 5;

interface LpCommentsSectionProps {
  lpId: number;
  className?: string;
}

const defaultClassName =
  "mt-14 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur";

const COMMENT_QUERY_KEY = (lpId: number) => ["lpComments", lpId] as const;

const renderSkeletons = (count: number) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`comment-skeleton-${index}`}
        className="animate-pulse rounded-2xl border border-white/5 bg-black/20 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-3 w-16 rounded bg-white/10" />
        </div>
        <div className="mt-4 h-3 w-full rounded bg-white/10" />
        <div className="mt-2 h-3 w-5/6 rounded bg-white/5" />
      </div>
    ))}
  </div>
);

export default function LpCommentsSection({
  lpId,
  className,
}: LpCommentsSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(COMMENT_CHUNK_SIZE);
  const queryClient = useQueryClient();
  const commentListContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: COMMENT_QUERY_KEY(lpId),
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchLpComments(lpId, {
        cursor: pageParam ?? 0,
        limit: COMMENT_PAGE_SIZE,
        order: COMMENT_ORDER,
        signal,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor ?? undefined : undefined,
  });

  const flattenedComments = useMemo(() => {
    if (!data?.pages) {
      return [] as LpComment[];
    }

    return data.pages.flatMap((page) => page.data.data);
  }, [data]);

  const isInitialLoading = status === "pending";
  const loadError = status === "error" ? (error as Error | null) : null;

  useEffect(() => {
    if (flattenedComments.length === 0) {
      setVisibleCount(0);
      return;
    }

    setVisibleCount((prev) => {
      if (prev === 0) {
        return Math.min(COMMENT_CHUNK_SIZE, flattenedComments.length);
      }

      return Math.min(prev, flattenedComments.length);
    });
  }, [flattenedComments.length]);

  const canSubmitComment = useMemo(
    () => Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)),
    []
  );

  const { mutateAsync: submitComment, isPending: isSubmittingComment } =
    useMutation({
      mutationFn: (payload: CreateLpCommentRequest) =>
        createLpComment(lpId, payload),
      onSuccess: (newComment) => {
        queryClient.setQueryData<InfiniteData<LpCommentListResponse>>(
          COMMENT_QUERY_KEY(lpId),
          (oldData) => {
            if (!oldData) {
              return {
                pageParams: [0],
                pages: [
                  {
                    status: true,
                    message: "",
                    statusCode: 200,
                    data: {
                      data: [newComment],
                      nextCursor: null,
                      hasNext: false,
                    },
                  },
                ],
              } satisfies InfiniteData<LpCommentListResponse>;
            }

            const [firstPage, ...restPages] = oldData.pages;
            const updatedFirstPage = {
              ...firstPage,
              data: {
                ...firstPage.data,
                data: [newComment, ...firstPage.data.data],
              },
            };

            return {
              pageParams: oldData.pageParams,
              pages: [updatedFirstPage, ...restPages],
            } satisfies InfiniteData<LpCommentListResponse>;
          }
        );
      },
      onError: () => {
        setCommentError("댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
      },
    });

  const handleCommentSubmit = async () => {
    const trimmed = commentContent.trim();
    if (!trimmed) {
      setCommentError("댓글 내용을 입력해주세요.");
      return;
    }

    if (!canSubmitComment) {
      setCommentError("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    try {
      await submitComment({ content: trimmed });
      setCommentContent("");
      setCommentError(null);

      const container = commentListContainerRef.current;
      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (submitError) {
      if (submitError instanceof Error && !commentError) {
        setCommentError(submitError.message);
      }
    }
  };

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (!canSubmitComment || isSubmittingComment) {
        return;
      }

      event.preventDefault();
      void handleCommentSubmit();
    }
  };

  const handleScroll = () => {
    const container = commentListContainerRef.current;
    if (!container || isInitialLoading) {
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 32;

    if (!isNearBottom) {
      return;
    }

    const hasHiddenComments = visibleCount < flattenedComments.length;
    if (hasHiddenComments) {
      setVisibleCount((prev) =>
        Math.min(prev + COMMENT_CHUNK_SIZE, flattenedComments.length)
      );
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const renderedComments = flattenedComments.slice(0, visibleCount);

  return (
    <div className={`${defaultClassName} ${className ?? ""}`.trim()}>
      <h2 className="text-lg font-semibold text-white">댓글</h2>

      <div
        ref={commentListContainerRef}
        onScroll={handleScroll}
        className="mt-6 max-h-96 w-full space-y-4 overflow-y-auto pr-1"
      >
        {isInitialLoading ? (
          renderSkeletons(3)
        ) : loadError ? (
          <p className="text-sm text-rose-400">
            {loadError.message || "댓글을 불러오지 못했습니다."}
          </p>
        ) : renderedComments.length === 0 ? (
          <p className="text-sm text-white/50">
            아직 작성된 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          <>
            {renderedComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl border border-white/5 bg-black/30 p-4"
              >
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{comment.author?.name ?? "익명"}</span>
                  <span>
                    {new Date(comment.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/80">{comment.content}</p>
              </div>
            ))}
            {isFetchingNextPage && (
              <div className="mt-4">{renderSkeletons(2)}</div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <textarea
          value={commentContent}
          onChange={(event) => {
            setCommentContent(event.target.value);
            if (commentError) {
              setCommentError(null);
            }
          }}
          onKeyDown={handleCommentKeyDown}
          placeholder={
            canSubmitComment
              ? "댓글을 입력해주세요. (Shift+Enter로 줄바꿈)"
              : "로그인 후 댓글을 작성할 수 있습니다."
          }
          className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          disabled={!canSubmitComment || isSubmittingComment}
        />
        {commentError && (
          <p className="text-xs text-rose-400">{commentError}</p>
        )}
        <button
          type="button"
          onClick={handleCommentSubmit}
          disabled={!canSubmitComment || isSubmittingComment}
          className={`w-full rounded-full px-5 py-2 text-sm font-medium transition ${
            !canSubmitComment
              ? "cursor-not-allowed bg-white/10 text-white/40"
              : isSubmittingComment
              ? "bg-white/20 text-white/80"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          {isSubmittingComment ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </div>
  );
}
