import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import NavBar from "../components/NavBar";

const PrivateLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();     // 이동하려고 시도한 주소를 가져온다 (현재 주소)

    if(!accessToken) {
        return <Navigate to={"/login"} state={{from: location}} replace/>
    }
    return <>
    <NavBar />
    <div className="pt-20">
        <Outlet />
    </div>
    </>
}

export default PrivateLayout