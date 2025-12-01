import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Summary = () => {
	const items = useSelector((state: RootState) => state.cart.items);

	const { totalQuantity, totalPrice } = useMemo(() => {
		const totals = items.reduce(
			(acc, item) => {
				const price = Number(item.price) || 0;
				acc.totalQuantity += item.amount;
				acc.totalPrice += price * item.amount;
				return acc;
			},
			{ totalQuantity: 0, totalPrice: 0 }
		);
		return totals;
	}, [items]);

	return (
		<section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
			<div className="text-sm">
				<p className="font-medium text-slate-900">
					총 수량: <span className="font-semibold">{totalQuantity}</span>
				</p>
				<p className="text-slate-600">
					총 금액:{' '}
					<span className="font-semibold">₩{totalPrice.toLocaleString()}</span>
				</p>
			</div>
		</section>
	);
};

export default Summary;


