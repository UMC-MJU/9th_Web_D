import { Outlet, Link } from 'react-router-dom';

const HomeLayout = () => {
    return(
        <div className='h-dvh flex flex-col'>
            <nav className='h-14 flex items-center justify-between px-4 border-b border-gray-200'>
                <Link to='/' className='font-medium'>Home</Link>
                <div className='flex items-center gap-3'>
                    <Link to='/login' className='px-3 py-1 rounded bg-black text-white'>로그인</Link>
                    <Link to='/signup' className='px-3 py-1 rounded border border-black'>회원가입</Link>
                </div>
            </nav>
            <main className='flex-1'>
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;