import { useCartStore } from '../stores/cartStore';
import CartItemRow from './CartItemRow';

const CartList = () => {
	const items = useCartStore(state => state.items);
	return (
		<ul className="list-none divide-y divide-slate-200 p-0">
			{items.map(item => (
				<CartItemRow key={item.id} item={item} />
			))}
		</ul>
	);
};

export default CartList;


