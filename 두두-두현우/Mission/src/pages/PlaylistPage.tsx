import { useDispatch, useSelector } from "react-redux";
import { updateAmount } from "../store/cartSlice";
import type { RootState } from "../store/store";

const PlaylistPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleUpdateAmount = (id: string, delta: number) => {
    dispatch(updateAmount({ id, delta }));
  };

  const formatPrice = (price: string) => {
    return `$${Number(price).toLocaleString()}`;
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="text-2xl font-semibold mb-8">Playlist</h1>
          <p className="text-white/70">플레이리스트가 비어있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold mb-8">Playlist</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5  transition-colors"
            >
              {/* 앨범 커버 */}
              <div className="flex-shrink-0">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded border border-white/10"
                />
              </div>

              {/* 제목, 아티스트, 가격 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-white/70 mt-1">{item.singer}</p>
                <p className="text-sm text-white/60 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* 수량 선택기 */}
              <div className="flex items-center gap-2 border border-white/10 rounded bg-black/20 px-3 py-2 ">
                <button
                  type="button"
                  onClick={() => handleUpdateAmount(item.id, -1)}
                  className="text-white/70 hover:text-white transition-colors w-6 h-6 flex items-center justify-center cursor-pointer"
                  aria-label="수량 감소"
                >
                  -
                </button>
                <span className="text-white min-w-[2rem] text-center">
                  {item.amount}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateAmount(item.id, 1)}
                  className="text-white/70 hover:text-white transition-colors w-6 h-6 flex items-center justify-center cursor-pointer"
                  aria-label="수량 증가"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
