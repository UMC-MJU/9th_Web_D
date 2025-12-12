import { useCartStore } from "../hooks/useCartStore";


const PriceBox = () => {
  // Redux useSelector 대신 Zustand 사용
  const { total } = useCartStore();

  return (
    <div className="p-8 flex justify-end text-xl font-bold text-gray-800">
      총 가격: {Number(total).toLocaleString()}원
    </div>
  );
};

export default PriceBox;