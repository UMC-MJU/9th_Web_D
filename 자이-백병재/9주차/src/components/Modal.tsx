import { useAppDispatch } from '../hooks/useCustomRedux';
import { clearCart } from '../slices/cartSlice';
import { closeModal } from '../slices/modalSlice';

const Modal = () => {
  const dispatch = useAppDispatch();

  return (
    <aside className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white w-80 p-6 rounded shadow-lg text-center'>
        <h4 className='font-bold text-lg mb-4'>
          장바구니의 모든 상품을 <br /> 삭제하시겠습니까?
        </h4>
        <div className='flex justify-center gap-4 mt-6'>
          <button
            type='button'
            className='px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition'
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
          >
            네
          </button>
          
          <button
            type='button'
            className='px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 transition'
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;