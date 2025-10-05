import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
    return(
        <>
            <Navbar />
            <Outlet />
        </>
    ); 
};

export default HomePage;