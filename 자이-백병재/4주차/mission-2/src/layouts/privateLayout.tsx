import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import NavBar from "../components/NavBar";

const PrivateLayout = () => {
    const { accessToken } = useAuth();
    if(!accessToken) {
        return <Navigate to={"/login"} replace/>
    }
    return <>
    <NavBar />
    <Outlet />
    </>
}

export default PrivateLayout