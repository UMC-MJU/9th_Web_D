import { NavLink } from "react-router-dom";

const LINKS = [
    { to: '/', label: 'Home' },
    { to: '/movie/popular', label: '인기 영화' },
    { to: '/movie/now_playing', label: '상영 중' },
    { to: '/movie/top_rated', label: '평점 높은 영화' },
    { to: '/movie/upcoming', label: '개봉 예정' },
];

export const Navbar = () => {
    return(
    <div className='flex gap-3 p-4'>
        {LINKS.map(({to, label}) => (
            <NavLink 
                key={to} 
                to={to}
                className={({isActive}):'text-[#646cff] font-bold' | 
                'text-gray-500' => {
                    return isActive ? 'text-[#646cff] font-bold' : 'text-gray-500';
                }}
            >
                {label}
            </NavLink>
        ))}
    </div>
    );
};