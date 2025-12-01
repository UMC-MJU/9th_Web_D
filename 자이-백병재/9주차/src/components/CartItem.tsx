import { useAppDispatch } from '../hooks/useCustomRedux';
import { decrease, increase, removeItem } from '../slices/cartSlice';
import type { Lp } from '../types/cart'; 

interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center p-4 border-b border-gray-200'>
      <img
        src={lp.img}
        alt={`${lp.title}의 LP 이미지`}
        className='w-20 h-20 object-cover rounded mr-4'
      />
      <div className='flex-1'>
        <h3 className='text-xl font-semibold'>{lp.title}</h3>
        <p className='text-sm text-gray-600'>{lp.singer}</p>
        <p className='text-sm font-bold text-gray-600'>{Number(lp.price).toLocaleString()} 원</p>
      </div>
      <div className='flex items-center'>
        <button
          className='px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer'
          onClick={() => {
            if (lp.amount === 1) {
              dispatch(removeItem(lp.id));
              return;
            }
            dispatch(decrease(lp.id));
          }}
        >
          -
        </button>
        <span className='px-4 py-[3px] border-y border-gray-300'>
          {lp.amount}
        </span>
        <button
          className='px-3 py-1 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400 cursor-pointer'
          onClick={() => dispatch(increase(lp.id))}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;