import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isLoggedIn, getCurrentUserNickname, logout } from '../../utils/auth';

const HomeLayout = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { pathname } = useLocation();

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
                <div className='flex items-center gap-3'>
                    <button
                        type='button'
                        aria-label='메뉴 열기'
                        className='p-1 rounded hover:bg-gray-100 sm:hidden'
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                        </svg>
                    </button>
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
                                <Link to='/lps' className='block px-2 py-1 rounded hover:bg-gray-100'>영화 노래 게시판</Link>
                        </li>
                    </ul>
                </aside>
                <main className='flex-1 min-w-0 overflow-auto'>
                    <Outlet />
                </main>
            </div>

            {/* 모바일 사이드바 (버거 버튼으로 열기) */}
            {sidebarOpen && (
                <div className='fixed inset-0 z-40 sm:hidden'>
                    <div className='absolute inset-0 bg-black/30' onClick={() => setSidebarOpen(false)} />
                    <aside className='absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-4'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='text-sm font-semibold text-gray-700'>메뉴</div>
                            <button
                                type='button'
                                aria-label='메뉴 닫기'
                                className='p-1 rounded hover:bg-gray-100'
                                onClick={() => setSidebarOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <ul className='space-y-2 text-sm'>
                            <li>
                                <Link to='/member' className='block px-2 py-2 rounded hover:bg-gray-100' onClick={() => setSidebarOpen(false)}>마이페이지</Link>
                            </li>
                            <li>
                                <Link to='/lps' className='block px-2 py-2 rounded hover:bg-gray-100' onClick={() => setSidebarOpen(false)}>영화 노래 게시판</Link>
                            </li>
                        </ul>
                    </aside>
                </div>
            )}

            {pathname !== '/lps' && (
                <Link
                    to='/lps'
                    aria-label='플로팅 버튼: 영화 노래 게시판으로 이동'
                    className='fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition-colors'
                >
                    +
                </Link>
            )}
        </div>
    );
};

export default HomeLayout;