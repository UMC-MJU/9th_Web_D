import { Outlet } from "react-router-dom";
import CategoryNav from "../components/CategoryNav";

const MainPage = () => {

    return (
    <div>
        <CategoryNav />
        <Outlet />
    </div>);
}

export default MainPage