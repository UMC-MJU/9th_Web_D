import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Summary = () => {
	const { amount, total } = useSelector((state: RootState) => state.cart);

	return (
		<section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
			<div className="text-sm">
				<p className="font-medium text-slate-900">
					총 수량: <span className="font-semibold">{amount}</span>
				</p>
				<p className="text-slate-600">
					총 금액:{' '}
					<span className="font-semibold">₩{total.toLocaleString()}</span>
				</p>
			</div>
		</section>
	);
};

export default Summary;


