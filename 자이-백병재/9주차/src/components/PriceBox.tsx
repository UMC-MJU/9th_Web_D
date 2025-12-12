import { useSelector } from "../hooks/useCustomRedux";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);

  return (
    <div className="p-8 flex justify-end text-xl font-bold text-gray-800">
      총 가격: {total.toLocaleString()}원
    </div>
  );
};

export default PriceBox;