import { create } from 'zustand';
import type { CartItem } from '../constants/cartItems';
import { cartItems } from '../constants/cartItems';

type CartState = {
	items: CartItem[];
	amount: number;
	total: number;
	increase: (id: string) => void;
	decrease: (id: string) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
	calculateTotals: () => void;
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

export const useCartStore = create<CartState>((set, get) => ({
	items: cartItems,
	...computeTotals(cartItems),

	increase: (id: string) =>
		set(state => {
			const next = state.items.map(it =>
				it.id === id ? { ...it, amount: it.amount + 1 } : it
			);
			return { items: next, ...computeTotals(next) };
		}),

	decrease: (id: string) =>
		set(state => {
			const target = state.items.find(i => i.id === id);
			let next = state.items;
			if (target) {
				if (target.amount > 1) {
					next = state.items.map(it =>
						it.id === id ? { ...it, amount: it.amount - 1 } : it
					);
				} else {
					next = state.items.filter(it => it.id !== id);
				}
			}
			return { items: next, ...computeTotals(next) };
		}),

	removeItem: (id: string) =>
		set(state => {
			const next = state.items.filter(it => it.id !== id);
			return { items: next, ...computeTotals(next) };
		}),

	clearCart: () =>
		set(() => ({
			items: [],
			amount: 0,
			total: 0
		})),

	calculateTotals: () =>
		set(state => {
			const totals = computeTotals(state.items);
			return totals;
		})
}));


