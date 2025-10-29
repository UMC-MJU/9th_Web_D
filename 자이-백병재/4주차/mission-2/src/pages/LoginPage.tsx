import { NavLink } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignup, type UserSignupInformation } from "../utils/validate";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
    const { values, errors, touched, getInputProps } = useForm<UserSignupInformation>({
        initValue: { email: "", password: "" },
        validate: validateSignup,
    });

    const { login } = useAuth();
    
    const loginSubmit = async () => {
        try{
            await login(values);
            window.location.replace("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    const inputStyle = `
    border border-3 border-gray-200 focus:border-[#FFA900] focus:outline-none 
    rounded-lg w-xs h-10 p-2.5 text-white
    `;

    const buttonStyle = `
    flex rounded-lg w-xs h-10 p-2.5 items-center justify-center 
    font-bold text-lg focus:outline-none transition-colors text-black
    `;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-10 gap-5">
                <h2 className="text-white font-bold text-3xl mb-2">Login</h2>

                <input className={`${inputStyle}`}
                type={"email"} {...getInputProps("email")}
                placeholder={"e-mail"}
                />

                <input className={`${inputStyle}`}
                type={"password"} {...getInputProps("password")}
                placeholder={"password"}
                />

                <button 
                className={`${buttonStyle} ${!(touched?.email && touched?.password) 
                ? 'bg-gray-500 pointer-events-none opacity-70' : 'bg-[#FFA900] hover:bg-white'}`}
                onClick={(e) => {
                    if (!(touched?.email && touched?.password)) {
                        e.preventDefault(); 
                        return; 
                    }
                    loginSubmit();
                }}
                aria-disabled={!(touched?.email && touched?.password)} 
                >
                Login
                </button>

                {(errors?.email || errors?.password) && (
                <h2 className="text-[#FFA900] font-bold text-sm">Incorrect Email or Password</h2> )}

                <div className="flex items-center w-full px-5 my-1">
                    <div className="flex-grow h-px bg-white"></div> 
                    <span className="mx-2.5 text-md text-white font-bold">OR</span>
                    <div className="flex-grow h-px bg-white"></div>
                </div>

                <button className={`${buttonStyle} bg-white hover:bg-[#FFA900]`} 
                type={"submit"}>Google</button>

                <div className="flex justify-center items-center">
                    <p className="text-sm text-white">Don't have an account?</p>
                    <NavLink
                        to="/signup"
                        className={({ isActive }) =>
                        `${"ml-2 text-md font-bold"} ${isActive ? "text-orange-600" : "text-[#FFA900] hover:underline"}`
                    }>
                    Sign up
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;