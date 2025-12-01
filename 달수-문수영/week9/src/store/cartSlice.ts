import { createSlice } from '@reduxjs/toolkit';
import type { CartItem } from '../constants/cartItems';
import { cartItems } from '../constants/cartItems';

export type CartState = {
	items: CartItem[];
	amount: number; // 전체 수량
	total: number; // 전체 금액
};

const computeTotals = (items: CartItem[]) => {
	return items.reduce(
		(acc, item) => {
			const price = Number(item.price) || 0;
			acc.amount += item.amount;
			acc.total += price * item.amount;
			return acc;
		},
		{ amount: 0, total: 0 }
	);
};

const initialState: CartState = {
	// 과제 요구사항: constants의 cartItems를 Redux 초기값으로 사용
	items: cartItems,
	...computeTotals(cartItems)
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
			const { amount, total } = computeTotals(state.items);
			state.amount = amount;
			state.total = total;
		},
		decrementAmount: (state, action: { payload: string }) => {
			const item = state.items.find(i => i.id === action.payload);
			if (item) {
				if (item.amount > 1) {
					item.amount -= 1;
				} else {
					state.items = state.items.filter(i => i.id !== item.id);
				}
			}
			const { amount, total } = computeTotals(state.items);
			state.amount = amount;
			state.total = total;
		},
		removeItem: (state, action: { payload: string }) => {
			state.items = state.items.filter(i => i.id !== action.payload);
			const { amount, total } = computeTotals(state.items);
			state.amount = amount;
			state.total = total;
		},
		clearCart: state => {
			state.items = [];
			state.amount = 0;
			state.total = 0;
		},
		calculateTotals: state => {
			const { amount, total } = computeTotals(state.items);
			state.amount = amount;
			state.total = total;
		}
	}
});

export const {
	incrementAmount,
	decrementAmount,
	removeItem,
	clearCart,
	calculateTotals
} = cartSlice.actions;
export default cartSlice.reducer;


