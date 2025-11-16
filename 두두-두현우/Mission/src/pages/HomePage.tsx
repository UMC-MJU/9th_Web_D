import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLpList } from "../apis/lp";
import type { Lp } from "../types/lp";

interface HomePageProps {
  username: string;
}

type CarouselStyle = {
  translateX: number;
  translateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
  blur: number;
};

const POSITION_STYLES: Record<string, CarouselStyle> = {
  "-3": {
    translateX: -22,
    translateY: 10,
    scale: 0.55,
    opacity: 0.15,
    zIndex: 1,
    blur: 6,
  },
  "-2": {
    translateX: -16,
    translateY: 6,
    scale: 0.7,
    opacity: 0.35,
    zIndex: 5,
    blur: 3,
  },
  "-1": {
    translateX: -8,
    translateY: 2.5,
    scale: 0.85,
    opacity: 0.7,
    zIndex: 10,
    blur: 1,
  },
  "0": {
    translateX: 0,
    translateY: 0,
    scale: 1,
    opacity: 1,
    zIndex: 20,
    blur: 0,
  },
  "1": {
    translateX: 8,
    translateY: 2.5,
    scale: 0.85,
    opacity: 0.7,
    zIndex: 10,
    blur: 1,
  },
  "2": {
    translateX: 16,
    translateY: 6,
    scale: 0.7,
    opacity: 0.35,
    zIndex: 5,
    blur: 3,
  },
  "3": {
    translateX: 22,
    translateY: 10,
    scale: 0.55,
    opacity: 0.15,
    zIndex: 1,
    blur: 6,
  },
};

const formatDate = (isoString: string) => {
  if (!isoString) {
    return "날짜 정보 없음";
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTagLine = (tags?: Lp["tags"]) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "태그 없음";
  }

  return tags.map((tag) => `#${tag.name}`).join(" ");
};

const formatMetaLine = (lp: Lp) => {
  const dateText = formatDate(lp.createdAt);
  const publishText = lp.published ? "공개" : "비공개";
  return `${dateText} · ${publishText}`;
};

const truncateText = (text: string, maxLength = 80) => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3)}...`;
};

export default function HomePage({ username }: HomePageProps) {
  const navigate = useNavigate();
  const [lps, setLps] = useState<Lp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brokenThumbIds, setBrokenThumbIds] = useState<Set<number>>(
    () => new Set()
  );

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadLps = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchLpList({
          cursor: 0,
          limit: 10,
          order: "asc",
          signal: controller.signal,
        });

        if (!isMounted) {
          return;
        }

        const fetchedLps = response.data.data;
        setLps(fetchedLps);
        setCurrentIndex(0);
      } catch (fetchError) {
        if (!isMounted || controller.signal.aborted) {
          return;
        }

        console.error("Failed to fetch LP list:", fetchError);
        setError("LP 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadLps();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [retryKey]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<Lp>;
      const created = custom.detail;
      if (!created) return;
      setLps((prev) => {
        const without = prev.filter((lp) => lp.id !== created.id);
        return [created, ...without];
      });
      setCurrentIndex(0);
    };
    window.addEventListener("lp:created", handler as EventListener);
    return () => {
      window.removeEventListener("lp:created", handler as EventListener);
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<number>;
      const deletedId = custom.detail;
      setLps((prev) => prev.filter((lp) => lp.id !== deletedId));
      setCurrentIndex(0);
    };
    window.addEventListener("lp:deleted", handler as EventListener);
    return () => {
      window.removeEventListener("lp:deleted", handler as EventListener);
    };
  }, []);

  const totalLps = lps.length;
  const currentLp = totalLps > 0 ? lps[currentIndex] : null;
  const HOME_FALLBACK_THUMB =
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80";

  const moveTo = (direction: number) => {
    if (totalLps === 0) {
      return;
    }

    setCurrentIndex((prev) => {
      const nextIndex = prev + direction;
      if (nextIndex < 0) return totalLps - 1;
      if (nextIndex >= totalLps) return 0;
      return nextIndex;
    });
  };

  const jumpTo = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= totalLps) {
      return;
    }

    setCurrentIndex(targetIndex);
  };

  const getRelativePosition = (index: number) => {
    if (totalLps === 0) {
      return 0;
    }

    let diff = index - currentIndex;
    if (diff > totalLps / 2) diff -= totalLps;
    if (diff < -totalLps / 2) diff += totalLps;
    return diff;
  };

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  const handleLpClick = (lpId: number) => {
    navigate(`/lps/${lpId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-8 py-10">
        <h1 className="text-2xl font-semibold text-white">
          {username ? `Welcome, ${username}!` : "Welcome"}
        </h1>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/60">LP를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-sm text-red-400">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
              >
                다시 시도
              </button>
            </div>
          ) : totalLps === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/60">표시할 LP가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="relative h-[25rem] w-full max-w-4xl">
                {lps.map((lp, index) => {
                  const relative = getRelativePosition(index);
                  if (Math.abs(relative) > 3) return null;

                  const style = POSITION_STYLES[relative.toString()];
                  if (!style) return null;

                  const tagLine = formatTagLine(lp.tags);
                  const metaLine = formatMetaLine(lp);

                  return (
                    <div
                      key={lp.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleLpClick(lp.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleLpClick(lp.id);
                        }
                      }}
                      className="absolute left-1/2 cursor-pointer transition-all duration-500 ease-out focus:outline-none"
                      style={{
                        transform: `translate(-50%, 50%) translateX(${style.translateX}rem) translateY(${style.translateY}rem) scale(${style.scale})`,
                        zIndex: style.zIndex,
                        opacity: style.opacity,
                        filter: `blur(${style.blur}px)`,
                      }}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-48 w-48 rounded-full border border-white/10 bg-white/5 shadow-[0_24px_55px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out overflow-hidden">
                          <img
                            src={
                              lp.thumbnail && !brokenThumbIds.has(lp.id)
                                ? lp.thumbnail
                                : HOME_FALLBACK_THUMB
                            }
                            alt={`${lp.title} thumbnail`}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={() =>
                              setBrokenThumbIds((prev) => {
                                const next = new Set(prev);
                                next.add(lp.id);
                                return next;
                              })
                            }
                          />
                          <div className="absolute inset-3 rounded-full border border-white/15" />
                          <div className="absolute inset-1/4 rounded-full bg-black/70" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold">{lp.title}</h3>
                          <p className="text-sm text-white/70">{tagLine}</p>
                          <p className="text-xs text-white/50">{metaLine}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-between gap-10">
                <button
                  type="button"
                  onClick={() => moveTo(-1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  &#8592;
                </button>
                <div className="flex items-center gap-3">
                  {lps.map((lp, index) => (
                    <button
                      key={lp.id}
                      type="button"
                      onClick={() => jumpTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 bg-white"
                          : "w-2 bg-white/30"
                      }`}
                      aria-label={`Go to ${lp.title}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => moveTo(1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  &#8594;
                </button>
              </div>

              {currentLp && (
                <div className="mt-14 flex w-full max-w-xl justify-center">
                  <div className="w-full rounded-3xl border border-white/10 bg-black/20 p-8 text-center backdrop-blur">
                    <h2 className="text-xl font-semibold">{currentLp.title}</h2>
                    <p className="mt-2 text-white/80">
                      {truncateText(
                        currentLp.content || "내용이 없습니다.",
                        100
                      )}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      {formatMetaLine(currentLp)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
