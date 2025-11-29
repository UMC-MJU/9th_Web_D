import { create } from "zustand";
import cartItems from "../constants/cartItems";

// 타입 정의
export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

type CartStore = CartState & CartActions;

// 전체 합계 계산 함수
const calculateCartTotals = (items: CartItem[]) => {
  const amount = items.reduce((sum, item) => sum + item.amount, 0);
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.amount,
    0
  );
  return { amount, total };
};

// 초기 상태 설정 및 합계 계산
const initialCartItems =
  Array.isArray(cartItems) && cartItems.length > 0
    ? cartItems.map((item) => ({ ...item, amount: item.amount }))
    : [];

const initialTotals = calculateCartTotals(initialCartItems);

// Zustand store 생성
export const useCartStore = create<CartStore>((set) => ({
  // 초기 상태
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,

  // 액션들
  // 수량 증가 - Redux와 동일한 로직
  increase: (id: string) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        const newCartItems = state.cartItems.map((item) =>
          item.id === id ? { ...item, amount: item.amount + 1 } : item
        );
        const totals = calculateCartTotals(newCartItems);
        return {
          cartItems: newCartItems,
          amount: totals.amount,
          total: totals.total,
        };
      }
      return state;
    }),

  // 수량 감소 - Redux와 동일한 로직
  decrease: (id: string) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        const newAmount = item.amount - 1;
        // 수량이 1보다 작아지면 제거
        const newCartItems =
          newAmount < 1
            ? state.cartItems.filter((item) => item.id !== id)
            : state.cartItems.map((item) =>
                item.id === id ? { ...item, amount: newAmount } : item
              );
        const totals = calculateCartTotals(newCartItems);
        return {
          cartItems: newCartItems,
          amount: totals.amount,
          total: totals.total,
        };
      }
      return state;
    }),

  // 아이템 제거 - Redux와 동일한 로직
  removeItem: (id: string) =>
    set((state) => {
      const newCartItems = state.cartItems.filter((item) => item.id !== id);
      const totals = calculateCartTotals(newCartItems);
      return {
        cartItems: newCartItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),

  // 전체 삭제 - Redux와 동일한 로직
  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  // 전체 합계 계산 - Redux와 동일한 로직 (명시적 호출용)
  calculateTotals: () =>
    set((state) => {
      const totals = calculateCartTotals(state.cartItems);
      return {
        ...state,
        amount: totals.amount,
        total: totals.total,
      };
    }),
}));
