import { Outlet, redirectDocument } from 'react-router-dom';

const HomeLayout = () => {
    return(
        <div className='h-dvh flex flex-col'>
            <nav>회원가입</nav>
            <main className='flex-1'>
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;