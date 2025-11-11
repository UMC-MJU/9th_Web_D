import { Outlet, Link } from 'react-router-dom';

const HomeLayout = () => {
    return(
        <div className='h-dvh flex flex-col'>
            <nav className='h-14 flex items-center justify-between px-4 border-b border-gray-200'>
                <div className='flex items-center gap-4'>
                    <Link to='/' className='font-medium'>Home</Link>
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