import { useDispatch, useSelector } from "react-redux";
import { increase, decrease, removeItem, clearCart } from "../store/cartSlice";
import { openModal, closeModal } from "../store/modalSlice";
import type { RootState } from "../store/store";

const PlaylistPage = () => {
  // useSelector로 Redux의 cartItems, amount, total 불러오기
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const amount = useSelector((state: RootState) => state.cart.amount);
  const total = useSelector((state: RootState) => state.cart.total);
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const dispatch = useDispatch();

  // useDispatch로 increase, decrease, removeItem, clearCart, calculateTotals 호출
  const handleIncrease = (id: string) => {
    dispatch(increase(id));
    // increase reducer 내부에서 자동으로 calculateTotals가 호출됨
  };

  const handleDecrease = (id: string) => {
    dispatch(decrease(id));
    // decrease reducer 내부에서 자동으로 calculateTotals가 호출됨
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
    // removeItem reducer 내부에서 자동으로 calculateTotals가 호출됨
  };

  const handleClearCartClick = () => {
    dispatch(openModal("clearCart"));
  };

  const handleConfirmClearCart = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleCancelClearCart = () => {
    dispatch(closeModal());
  };

  // calculateTotals는 increase, decrease, removeItem reducer 내부에서 자동으로 호출됨
  // 명시적으로 호출하려면: dispatch(calculateTotals());

  const formatPrice = (price: string) => {
    return `$${Number(price).toLocaleString()}`;
  };

  if (!cartItems || cartItems.length === 0) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Playlist</h1>
          <div className="text-right">
            {/* useSelector로 불러온 amount와 total을 UI에 표시 */}
            <p className="text-white/70 text-sm">전체 수량: {amount}</p>
            <p className="text-white font-semibold">
              총 금액: {formatPrice(total.toString())}
            </p>
          </div>
        </div>

        {/* 전체 삭제 버튼 */}
        {cartItems.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleClearCartClick}
              className="px-4 py-2 border border-red-500/50 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm cursor-pointer"
            >
              전체 삭제
            </button>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {isModalOpen && modalType === "clearCart" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-black border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                정말 삭제하시겠습니까?
              </h2>
              <p className="text-white/70 mb-6">
                장바구니의 모든 아이템이 삭제됩니다. 이 작업은 되돌릴 수
                없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancelClearCart}
                  className="px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  아니요
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearCart}
                  className="px-4 py-2 border border-red-500/50 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {cartItems.map((item) => (
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

              {/* 수량 선택기 및 삭제 버튼 */}
              <div className="flex items-center gap-3">
                {/* 수량 버튼 클릭 시 dispatch */}
                <div className="flex items-center gap-2 border border-white/10 rounded bg-black/20 px-3 py-2 ">
                  <button
                    type="button"
                    onClick={() => handleDecrease(item.id)}
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
                    onClick={() => handleIncrease(item.id)}
                    className="text-white/70 hover:text-white transition-colors w-6 h-6 flex items-center justify-center cursor-pointer"
                    aria-label="수량 증가"
                  >
                    +
                  </button>
                </div>

                {/* 아이템 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="px-3 py-2 border border-red-500/50 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm cursor-pointer"
                  aria-label="아이템 삭제"
                >
                  삭제
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
