import { createSlice } from '@reduxjs/toolkit';
import type { CartItem } from '../constants/cartItems';
import { cartItems } from '../constants/cartItems';

export type CartState = {
	items: CartItem[];
};

const initialState: CartState = {
	// 과제 요구사항: constants의 cartItems를 Redux 초기값으로 사용
	items: cartItems
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		incrementAmount: (state, action: { payload: string }) => {
			const item = state.items.find(i => i.id === action.payload);
			if (item) {
				item.amount += 1;
			}
		},
		decrementAmount: (state, action: { payload: string }) => {
			const item = state.items.find(i => i.id === action.payload);
			if (item && item.amount > 1) {
				item.amount -= 1;
			}
		},
		removeItem: (state, action: { payload: string }) => {
			state.items = state.items.filter(i => i.id !== action.payload);
		},
		clearCart: state => {
			state.items = [];
		}
	}
});

export const { incrementAmount, decrementAmount, removeItem, clearCart } =
	cartSlice.actions;
export default cartSlice.reducer;


