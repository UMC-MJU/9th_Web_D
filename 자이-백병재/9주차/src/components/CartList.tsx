import { useEffect } from "react";
import CartItem from "./CartItem";
import Modal from "./Modal";
import { useCartStore } from "../hooks/useCartStore";


const CartList = () => {
  // Zustand 스토어에서 필요한 값과 함수 가져오기
  const { 
    cartItems, 
    total, 
    isOpen, 
    calculateTotals, 
    openModal 
  } = useCartStore();

  // 장바구니 아이템이 변경될 때마다 합계 다시 계산
  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  // 장바구니가 비었을 때 화면
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
      {/* 모달이 열려있으면(isOpen === true) 렌더링 */}
      {isOpen && <Modal />}

      <header className="w-full max-w-2xl flex justify-between items-end mb-8 px-2">
        <h2 className="text-3xl font-bold">당신의 장바구니</h2>
        
        {/* 장바구니 비우기 버튼 */}
        <button 
            className="text-sm px-3 py-1 text-red-500 border border-red-400 rounded-md hover:bg-red-50 transition cursor-pointer font-medium"
            onClick={openModal}
        >
            장바구니 비우기
        </button>
      </header>
      
      {/* 아이템 리스트 */}
      <ul className="w-full max-w-2xl">
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </section>
  );
};

export default CartList;