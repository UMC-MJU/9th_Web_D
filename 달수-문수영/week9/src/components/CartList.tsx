import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import CartItemRow from './CartItemRow';

const CartList = () => {
	const items = useSelector((state: RootState) => state.cart.items);
	return (
		<ul className="list-none divide-y divide-slate-200 p-0">
			{items.map(item => (
				<CartItemRow key={item.id} item={item} />
			))}
		</ul>
	);
};

export default CartList;


