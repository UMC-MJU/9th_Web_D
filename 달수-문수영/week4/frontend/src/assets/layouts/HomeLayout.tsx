import { Outlet, Link } from 'react-router-dom';

const HomeLayout = () => {
    return(
        <div className='h-dvh flex flex-col'>
            <nav className='h-14 flex items-center justify-between px-4 border-b border-gray-200'>
                <Link to='/' className='font-medium'>Home</Link>
            </nav>
            <main className='flex-1'>
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;