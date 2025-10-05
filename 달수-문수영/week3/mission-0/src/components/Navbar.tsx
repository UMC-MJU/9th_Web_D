import { NavLink } from "react-router-dom";

const LINKS = [
    { to: '/', label: 'Home' },
    { to: '/movie/popular', label: '인기 영화' },
    { to: '/movie/now_playing', label: '상영 중인 영화' },
    { to: '/movie/top_rated', label: '평점 높은 영화' },
    { to: '/movie/upcoming', label: '개봉 예정' },
];

export const Navbar = () => {
    return(
    <nav className='sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-black-500 border-b border-gray-800'>
        <div className='max-w-5xl mx-auto px-4'>
            <div className='flex items-center gap-6 h-12'>
                {LINKS.map(({to, label}) => (
                    <NavLink 
                        key={to} 
                        to={to}
                        className={({isActive}): string => (
                            isActive 
                                ? '!text-white font-semibold' 
                                : '!text-gray-200 hover:!text-white'
                        )}
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        </div>
    </nav>
    );
};