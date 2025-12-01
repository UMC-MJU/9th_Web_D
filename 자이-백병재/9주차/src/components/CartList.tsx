import { useEffect } from "react";

import CartItem from "./CartItem";
import { useAppDispatch, useSelector } from "../hooks/useCustomRedux";
import { calculateTotals } from "../slices/cartSlice";

const CartList = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <ul className="w-full">
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;