import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";

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

const initialState: CartState = {
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 수량 증가
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
        const totals = calculateCartTotals(state.cartItems);
        state.amount = totals.amount;
        state.total = totals.total;
      }
    },
    // 수량 감소
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount -= 1;
        // 수량이 1보다 작아지면 제거
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter(
            (item) => item.id !== action.payload
          );
        }
        const totals = calculateCartTotals(state.cartItems);
        state.amount = totals.amount;
        state.total = totals.total;
      }
    },
    // 아이템 제거
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      const totals = calculateCartTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
    // 전체 삭제
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    // 전체 합계 계산 (명시적 호출용)
    calculateTotals: (state) => {
      const totals = calculateCartTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
