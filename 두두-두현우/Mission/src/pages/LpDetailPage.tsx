import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchLpDetail, deleteLp } from "../apis/lp";
import type { LpDetail } from "../types/lp";
import LpCommentsSection from "../components/LpCommentsSection";

const fallbackThumbnail =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80";

type DetailStatus = "idle" | "loading" | "success" | "error";

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackFromState =
    (location.state as { fallbackThumbnail?: string } | null)
      ?.fallbackThumbnail ?? "";
  const isMountedRef = useRef(true);
  const [lp, setLp] = useState<LpDetail | null>(null);
  const [status, setStatus] = useState<DetailStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!lpId) {
      setStatus("error");
      setError("잘못된 LP 정보입니다.");
      return;
    }

    const controller = new AbortController();

    const loadDetail = async () => {
      try {
        setStatus("loading");
        setError(null);
        const response = await fetchLpDetail(lpId, {
          signal: controller.signal,
        });

        if (!isMountedRef.current) {
          return;
        }

        setLp(response.data);
        setStatus("success");
      } catch (detailError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to fetch LP detail:", detailError);
        if (!isMountedRef.current) {
          return;
        }

        setError("LP 상세 정보를 불러오지 못했습니다.");
        setStatus("error");
      }
    };

    void loadDetail();

    return () => {
      controller.abort();
    };
  }, [lpId]);

  const likeCount = useMemo(() => {
    if (!lp) {
      return 0;
    }

    const baseCount = Array.isArray(lp.likes) ? lp.likes.length : 0;
    return isLiked ? baseCount + 1 : baseCount;
  }, [lp, isLiked]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!lp) return;
    const ok = window.confirm("정말 이 LP를 삭제하시겠습니까?");
    if (!ok) return;
    try {
      await deleteLp(lp.id);
      // 홈/목록에서 제거되도록 이벤트 발송
      window.dispatchEvent(new CustomEvent("lp:deleted", { detail: lp.id }));
      navigate("/", { replace: true });
    } catch {
      alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-[#010102] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
          {fallbackFromState ? (
            <div className="flex flex-col items-center">
              <div
                className="relative h-72 w-72 rounded-full border border-white/5 bg-black/60 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
                style={{
                  backgroundImage: `url(${fallbackFromState})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 rounded-full border border-white/10" />
              </div>
              <p className="mt-6 text-white/70">LP 정보를 불러오는 중...</p>
            </div>
          ) : (
            <p className="text-white/70">LP 정보를 불러오는 중...</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "error" || !lp) {
    return (
      <div className="min-h-screen bg-[#010102] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="text-red-400">
            {error ?? "LP 정보를 찾을 수 없습니다."}
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-6 rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/20"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  const thumbnail =
    (!thumbError && (lp.thumbnail || fallbackFromState)) || fallbackThumbnail;

  return (
    <div className="min-h-screen bg-[#010102] text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-white/70 transition hover:text-white"
          >
            ← 목록으로
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full bg-rose-500/90 px-4 py-2 text-xs font-medium text-white hover:bg-rose-500 transition cursor-pointer"
          >
            삭제
          </button>
        </div>

        <div className="mt-10 flex flex-1 flex-col items-center">
          <h1 className="text-3xl font-semibold text-white">{lp.title}</h1>
          <p className="mt-2 text-sm text-white/60">
            {lp.author?.name ? `by ${lp.author.name}` : "작성자 정보 없음"}
          </p>

          <div className="relative mt-10 flex w-full flex-col items-center">
            <div
              className={`relative h-72 w-72 rounded-full border border-white/5 bg-black/60 shadow-[0_30px_90px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-out ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{
                animationDuration: "6s",
              }}
            >
              <img
                src={thumbnail}
                alt={`${lp.title} thumbnail`}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
                onError={() => setThumbError(true)}
              />
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "일시정지" : "재생"}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-semibold text-black shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-white/70">
            {lp.content || "LP 설명이 제공되지 않았습니다."}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(lp.tags ?? []).length === 0 ? (
              <span className="rounded-full bg-white/10 px-4 py-1 text-xs text-white/80">
                태그 없음
              </span>
            ) : (
              lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-white/10 px-4 py-1 text-xs text-white/80"
                >
                  #{tag.name}
                </span>
              ))
            )}
          </div>

          <div className="mt-10 flex items-center gap-3 text-white/70">
            <button
              type="button"
              onClick={toggleLike}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                isLiked
                  ? "bg-rose-500 text-white"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <span aria-hidden>❤️</span>
              <span>{likeCount}</span>
            </button>
            <span className="text-xs text-white/50">
              {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>

          <LpCommentsSection lpId={lp.id} />
        </div>
      </div>
    </div>
  );
}
