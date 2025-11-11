import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isLoggedIn, getCurrentUserNickname, logout } from '../../utils/auth';

const HomeLayout = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());

    useEffect(() => {
        const onChange = () => setLoggedIn(isLoggedIn());
        window.addEventListener('storage', onChange);
        window.addEventListener('auth-changed', onChange);
        return () => {
            window.removeEventListener('storage', onChange);
            window.removeEventListener('auth-changed', onChange);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
    };

    const nickname = loggedIn ? getCurrentUserNickname() : '';

    return(
        <div className='h-dvh flex flex-col'>
            <nav className='h-14 flex items-center justify-between px-4 border-b border-gray-200'>
                <div className='flex items-center gap-4'>
                    <Link to='/' className='font-medium'>Home</Link>
                </div>
                <div className='flex items-center gap-2'>
                    {loggedIn ? (
                        <div className='flex items-center gap-3 text-sm'>
                            <span className='text-gray-700'>
                                {nickname ? `${nickname}님 반갑습니다.` : '반갑습니다.'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className='px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors'
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                to='/login'
                                className='px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors'
                            >
                                로그인
                            </Link>
                            <Link
                                to='/signup'
                                className='px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 transition-colors'
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <div className='flex flex-1 min-h-0'>
                <aside className='w-56 shrink-0 border-r border-gray-200 bg-white p-4 hidden sm:block'>
                    <div className='text-sm font-semibold text-gray-700 mb-3'>메뉴</div>
                    <ul className='space-y-2 text-sm'>
                        <li>
                            <Link to='/member' className='block px-2 py-1 rounded hover:bg-gray-100'>마이페이지</Link>
                        </li>
                        <li>
                            <Link to='/infinite-posts' className='block px-2 py-1 rounded hover:bg-gray-100'>게시판</Link>
                        </li>
                    </ul>
                </aside>
                <main className='flex-1 min-w-0 overflow-auto'>
                    <Outlet />
                </main>
            </div>
            <Link
                to='/infinite-posts'
                aria-label='플로팅 버튼: 게시판으로 이동'
                className='fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition-colors'
            >
                +
            </Link>
        </div>
    );
};

export default HomeLayout;