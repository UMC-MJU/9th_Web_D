import { useEffect, useMemo, useRef, useState } from "react";
import {
  createLpComment,
  fetchLpComments,
  type CreateLpCommentRequest,
  type LpComment,
} from "../apis/lp";
import { STORAGE_KEYS } from "../constants";

const COMMENT_PAGE_SIZE = 10;
const COMMENT_ORDER: "asc" | "desc" = "desc";

interface LpCommentsSectionProps {
  lpId: number;
  className?: string;
}

const defaultClassName =
  "mt-14 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur";

export default function LpCommentsSection({
  lpId,
  className,
}: LpCommentsSectionProps) {
  const [comments, setComments] = useState<LpComment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isCommentsLoadingMore, setIsCommentsLoadingMore] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentCursor, setCommentCursor] = useState<number | null>(0);
  const [commentHasNext, setCommentHasNext] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadComments = async () => {
      try {
        setIsCommentsLoading(true);
        setCommentsError(null);
        const response = await fetchLpComments(lpId, {
          cursor: 0,
          limit: COMMENT_PAGE_SIZE,
          order: COMMENT_ORDER,
          signal: controller.signal,
        });

        if (!isMountedRef.current) {
          return;
        }

        setComments(response.data.data);
        setCommentCursor(response.data.nextCursor);
        setCommentHasNext(response.data.hasNext);
      } catch (commentsLoadError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load LP comments:", commentsLoadError);
        if (!isMountedRef.current) {
          return;
        }

        setComments([]);
        setCommentCursor(null);
        setCommentHasNext(false);
        setCommentsError("댓글을 불러오지 못했습니다.");
      } finally {
        if (isMountedRef.current) {
          setIsCommentsLoading(false);
        }
      }
    };

    void loadComments();

    return () => {
      controller.abort();
    };
  }, [lpId]);

  const canSubmitComment = useMemo(
    () => Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)),
    []
  );

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

    const payload: CreateLpCommentRequest = {
      content: trimmed,
    };

    try {
      setIsSubmittingComment(true);
      setCommentError(null);
      const newComment = await createLpComment(lpId, payload);
      setComments((prev) => [newComment, ...prev]);
      setCommentContent("");
    } catch (submitError) {
      console.error("Failed to submit comment:", submitError);
      setCommentError("댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLoadMoreComments = async () => {
    if (commentCursor === null || !commentHasNext) {
      return;
    }

    try {
      setIsCommentsLoadingMore(true);
      const response = await fetchLpComments(lpId, {
        cursor: commentCursor,
        limit: COMMENT_PAGE_SIZE,
        order: COMMENT_ORDER,
      });

      if (!isMountedRef.current) {
        return;
      }

      setComments((prev) => [...prev, ...response.data.data]);
      setCommentCursor(response.data.nextCursor);
      setCommentHasNext(response.data.hasNext);
      setCommentsError(null);
    } catch (loadMoreError) {
      console.error("Failed to load more comments:", loadMoreError);
      if (isMountedRef.current) {
        setCommentsError("추가 댓글을 불러오지 못했습니다.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsCommentsLoadingMore(false);
      }
    }
  };

  return (
    <div className={`${defaultClassName} ${className ?? ""}`.trim()}>
      <h2 className="text-lg font-semibold text-white">댓글</h2>

      <div className="mt-6 space-y-4">
        {isCommentsLoading ? (
          <p className="text-sm text-white/50">댓글을 불러오는 중...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-white/50">
            아직 작성된 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
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
          ))
        )}
      </div>

      {commentsError && !isCommentsLoading && (
        <p className="mt-3 text-xs text-rose-400">{commentsError}</p>
      )}

      {commentHasNext && (
        <button
          type="button"
          onClick={handleLoadMoreComments}
          disabled={isCommentsLoadingMore}
          className="mt-6 w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCommentsLoadingMore ? "불러오는 중..." : "댓글 더 보기"}
        </button>
      )}

      <div className="mt-8 space-y-3">
        <textarea
          value={commentContent}
          onChange={(event) => {
            setCommentContent(event.target.value);
            if (commentError) {
              setCommentError(null);
            }
          }}
          placeholder={
            canSubmitComment
              ? "댓글을 입력해주세요."
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
