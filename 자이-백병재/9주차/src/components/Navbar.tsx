import { useCartStore } from "../hooks/useCartStore";

const Navbar = () => {
  const { amount } = useCartStore();

  return (
    <nav className="bg-orange-300 py-4 px-8 mb-10 text-white">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h3 className="text-2xl font-bold">UMC PlayList</h3>
        <div className="relative cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {amount}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;