import { useDispatch } from 'react-redux';
import type { CartItem } from '../constants/cartItems';
import { decrementAmount, incrementAmount, removeItem } from '../store/cartSlice';

type Props = {
	item: CartItem;
};

const CartItemRow = ({ item }: Props) => {
	const dispatch = useDispatch();

	return (
		<li className="flex items-center gap-4 py-4">
			<img
				src={item.img}
				alt={item.title}
				className="h-16 w-16 flex-none rounded object-cover"
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-semibold text-slate-900">
					{item.title}
				</p>
				<p className="truncate text-xs text-slate-500">{item.singer}</p>
			</div>
			<div className="flex items-center gap-2">
				<button
					aria-label="decrement"
					className="h-7 w-7 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
					onClick={() => dispatch(decrementAmount(item.id))}
				>
					-
				</button>
				<span className="w-6 text-center text-sm">{item.amount}</span>
				<button
					aria-label="increment"
					className="h-7 w-7 rounded bg-slate-800 text-white hover:bg-slate-700"
					onClick={() => dispatch(incrementAmount(item.id))}
				>
					+
				</button>
			</div>
			<button
				aria-label="remove item"
				className="ml-2 h-7 rounded bg-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-300"
				onClick={() => dispatch(removeItem(item.id))}
			>
				삭제
			</button>
			<p className="w-20 text-right text-sm font-medium text-slate-900">
				₩{Number(item.price).toLocaleString()}
			</p>
		</li>
	);
};

export default CartItemRow;


