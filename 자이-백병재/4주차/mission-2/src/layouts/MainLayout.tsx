import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const MainLayout = () => {
    return (
        <div>
            <NavBar />
            <div className="h-dvh flex flex-col bg-gray-500 pt-20">
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;