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
    <nav className='sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-blue-500'>
        <div className='max-w-5xl mx-auto px-4'>
            <div className='flex items-center gap-6 h-12'>
                {LINKS.map(({to, label}) => (
                    <NavLink 
                        key={to} 
                        to={to}
                        className={({isActive}): string => (
                            isActive 
                                ? '!text-black font-semibold' 
                                : '!text-black hover:!text-black'
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