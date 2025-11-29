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
  items: CartItem[];
}

const initialState: CartState = {
  items:
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.map((item) => ({ ...item, amount: item.amount }))
      : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateAmount: (
      state,
      action: PayloadAction<{ id: string; delta: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount = Math.max(1, item.amount + action.payload.delta);
      }
    },
  },
});

export const { updateAmount } = cartSlice.actions;
export default cartSlice.reducer;
