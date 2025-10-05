import { NavLink } from "react-router-dom";

const Category = [
    {to: '/', label: '메인'},
    {to: '/movies/popular', label: '인기순'},
    {to: '/movies/top_rated', label: '평점순'},
    {to: '/movies/now_playing', label: '상영 중'},    
    {to: '/movies/upcoming', label: '개봉 예정'},
];

const CategoryNav = () => {
const baseCss = "px-4 py-2 mx-1 rounded-md transition-colors duration-200"; // 미리 만들어두기
const activeCss = "bg-white text-black font-bold";
const inactiveCss = "text-gray-300 hover:bg-amber-100 hover:text-black";

return (
  <div className="flex p-4 bg-gray-800">
    {Category.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `${baseCss} ${isActive ? activeCss : inactiveCss}`
        }>
        {label}
      </NavLink>
    ))}
  </div>
);
}

export default CategoryNav