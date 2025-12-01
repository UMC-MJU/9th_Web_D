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
	reducers: {}
});

export default cartSlice.reducer;


