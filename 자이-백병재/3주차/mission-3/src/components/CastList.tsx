import type { Cast } from "../types/cast";

const CastList = ({ castList }: { castList: Cast[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-4 mt-5">
  {castList.map((cast) => (
    <div
      key={cast.id}
      title={cast.name}
      className="w-30 h-30 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md"
    >
      {cast.logo_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w200${cast.logo_path}`}
          alt={cast.name}
          className="w-[75%] h-[75%] object-contain"
        />
      ) : (
        <span className="text-sm text-black text-center p-1">
          {cast.name}
        </span>
      )}
    </div>
  ))}
</div>

  );
};

export default CastList;