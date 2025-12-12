import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import cartItemsData from '../constants/cartItems';

import type { Lp } from '../types/cart';

interface CartState {
  cartItems: Lp[];
  amount: number;
  total: number;
  isOpen: boolean;
}

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

// 전체 스토어 타입
type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  immer((set) => ({
    // 초기값
    cartItems: cartItemsData,
    amount: 0,
    total: 0,
    isOpen: false,

    // 액션 구현
    increase: (id) =>
      set((state) => {

        const item = state.cartItems.find((item) => item.id === id);
        if (item) {
          item.amount += 1;
        }
      }),

    decrease: (id) =>
      set((state) => {
        const item = state.cartItems.find((item) => item.id === id);
        if (item) {
          item.amount -= 1;
        }
      }),

    removeItem: (id) =>
      set((state) => {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      }),

    clearCart: () =>
      set((state) => {
        state.cartItems = [];
      }),

    calculateTotals: () =>
      set((state) => {
        let amount = 0;
        let total = 0;

        state.cartItems.forEach((item) => {
          amount += item.amount;
          total += item.amount * Number(item.price);
        });

        state.amount = amount;
        state.total = total;
      }),

    openModal: () =>
      set((state) => {
        state.isOpen = true;
      }),

    closeModal: () =>
      set((state) => {
        state.isOpen = false;
      }),
  }))
);