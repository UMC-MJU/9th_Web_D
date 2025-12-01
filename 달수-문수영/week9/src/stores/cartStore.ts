import { create } from 'zustand';
import type { CartItem } from '../constants/cartItems';
import { cartItems } from '../constants/cartItems';

type CartState = {
	items: CartItem[];
	amount: number;
	total: number;
	// Redux와 매칭되는 이름을 유지
	incrementAmount: (id: string) => void;
	decrementAmount: (id: string) => void;
	// 동일 의미의 별칭(선택)
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

	incrementAmount: (id: string) =>
		set(state => {
			const next = state.items.map(it =>
				it.id === id ? { ...it, amount: it.amount + 1 } : it
			);
			return { items: next, ...computeTotals(next) };
		}),

	decrementAmount: (id: string) =>
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

	// 별칭(컴포넌트 변경 최소화용)
	increase: (id: string) => get().incrementAmount(id),
	decrease: (id: string) => get().decrementAmount(id),

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


