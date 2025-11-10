import { useMemo, useState } from "react";

interface HomePageProps {
  username: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
}

export default function HomePage({ username }: HomePageProps) {
  const albums = useMemo<Album[]>(
    () => [
      {
        id: "abbey-road",
        title: "Abbey Road",
        artist: "The Beatles",
        year: "1969",
        genre: "Rock",
      },
      {
        id: "dark-side",
        title: "Dark Side of the Moon",
        artist: "Pink Floyd",
        year: "1973",
        genre: "Progressive Rock",
      },
      {
        id: "thriller",
        title: "Thriller",
        artist: "Michael Jackson",
        year: "1982",
        genre: "Pop",
      },
      {
        id: "led-zeppelin-iv",
        title: "Led Zeppelin IV",
        artist: "Led Zeppelin",
        year: "1971",
        genre: "Hard Rock",
      },
      {
        id: "rumours",
        title: "Rumours",
        artist: "Fleetwood Mac",
        year: "1977",
        genre: "Rock",
      },
      {
        id: "back-in-black",
        title: "Back in Black",
        artist: "AC/DC",
        year: "1980",
        genre: "Hard Rock",
      },
      {
        id: "the-wall",
        title: "The Wall",
        artist: "Pink Floyd",
        year: "1979",
        genre: "Progressive Rock",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAlbum = albums[currentIndex];
  const totalAlbums = albums.length;

  const moveTo = (direction: number) => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + direction;
      if (nextIndex < 0) return totalAlbums - 1;
      if (nextIndex >= totalAlbums) return 0;
      return nextIndex;
    });
  };

  const jumpTo = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
  };

  const getRelativePosition = (index: number) => {
    let diff = index - currentIndex;
    if (diff > totalAlbums / 2) diff -= totalAlbums;
    if (diff < -totalAlbums / 2) diff += totalAlbums;
    return diff;
  };

  const positionStyles: Record<
    string,
    {
      translateX: number;
      translateY: number;
      scale: number;
      opacity: number;
      zIndex: number;
      blur: number;
    }
  > = {
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-8 py-10">
        <h1 className="text-2xl font-semibold text-white">
          {username ? `Welcome, ${username}!` : "Welcome"}
        </h1>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div className="relative h-[25rem] w-full max-w-4xl">
            {albums.map((album, index) => {
              const relative = getRelativePosition(index);
              if (Math.abs(relative) > 3) return null;

              const style = positionStyles[relative.toString()];

              return (
                <div
                  key={album.id}
                  className="absolute left-1/2 transition-all duration-500 ease-out"
                  style={{
                    transform: `translate(-50%, 50%) translateX(${style.translateX}rem) translateY(${style.translateY}rem) scale(${style.scale})`,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                    filter: `blur(${style.blur}px)`,
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-48 w-48 rounded-full border border-white/10 bg-white/5 shadow-[0_24px_55px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out">
                      <div className="absolute inset-3 rounded-full border border-white/15" />
                      <div className="absolute inset-1/4 rounded-full bg-black/70" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">{album.title}</h3>
                      <p className="text-sm text-white/70">{album.artist}</p>
                      <p className="text-xs text-white/50">
                        {album.year} · {album.genre}
                      </p>
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
              {albums.map((album, index) => (
                <button
                  key={album.id}
                  type="button"
                  onClick={() => jumpTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                  }`}
                  aria-label={`Go to ${album.title}`}
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

          <div className="mt-14 flex w-full max-w-xl justify-center">
            <div className="w-full rounded-3xl border border-white/10 bg-black/20 p-8 text-center backdrop-blur">
              <h2 className="text-xl font-semibold">{currentAlbum.title}</h2>
              <p className="mt-2 text-white/80">{currentAlbum.artist}</p>
              <p className="mt-1 text-sm text-white/60">
                {currentAlbum.year} · {currentAlbum.genre}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
