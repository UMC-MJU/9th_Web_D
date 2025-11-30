import { useCartStore } from "../hooks/useCartStore";


const Modal = () => {
  const { clearCart, closeModal } = useCartStore();

  return (
    <aside className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white w-80 p-6 rounded shadow-lg text-center'>
        <h4 className='font-bold text-lg mb-4'>
          장바구니의 모든 상품을 <br /> 삭제하시겠습니까?
        </h4>
        <div className='flex justify-center gap-4 mt-6'>
          {/* 네 버튼 */}
          <button
            type='button'
            className='px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition'
            onClick={() => {
              clearCart();  // 장바구니 비움
              closeModal(); // 모달 닫음
            }}
          >
            네
          </button>
          
          {/* 아니요 버튼 */}
          <button
            type='button'
            className='px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 transition'
            onClick={closeModal} // 모달만 닫음
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;