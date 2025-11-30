import { useEffect } from "react";
import CartItem from "./CartItem";
import Modal from "./Modal";
import { useAppDispatch, useSelector } from "../hooks/useCustomRedux";
import { calculateTotals } from "../slices/cartSlice";
import { openModal } from "../slices/modalSlice";

const CartList = () => {
  const { cartItems, total } = useSelector((state) => state.cart);
  const { isOpen } = useSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (cartItems.length < 1) {
    return (
      <section className='text-center mt-10'>
        <header>
          <h2 className='text-2xl font-bold'>장바구니</h2>
          <h4 className='text-gray-500 mt-4'>장바구니가 비어있습니다.</h4>
        </header>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center mb-10 relative">
      {isOpen && <Modal />}
      <header className="w-full max-w-2xl flex justify-between items-end mb-8 px-2">
        <h2 className="text-3xl font-bold">장바구니</h2>

        <button 
            className="text-sm px-3 py-1 text-red-500 border border-red-400 rounded-md hover:bg-red-50 transition cursor-pointer font-medium"
            onClick={() => dispatch(openModal())}
        >
            장바구니 비우기
        </button>
      </header>
      
      <ul className="w-full max-w-2xl">
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>

      <footer className="w-full max-w-2xl mt-8 border-t border-gray-300 pt-4">
        <div className="flex justify-between text-xl font-bold mb-6 px-2">
            <h4>총 가격</h4>
            <span>{Number(total).toLocaleString()} 원</span>
        </div>
      </footer>
    </section>
  );
};

export default CartList;