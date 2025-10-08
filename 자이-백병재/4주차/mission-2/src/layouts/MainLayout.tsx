import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="h-dvh flex flex-col bg-gray-500">
            <Outlet />
        </div>
    );
}

export default MainLayout;