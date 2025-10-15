import { NavLink } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignup, type UserSignupInformation } from "../utils/validate";

const LoginPage = () => {
    const { values, errors, touched, getInputProps } = useForm<UserSignupInformation>({
        initValue: { email: "", password: "" },
        validate: validateSignup,
    });

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-10 gap-5">
                <h2 className="text-white font-bold text-3xl mb-2">Login</h2>

                <input className="border border-3 border-gray-200 focus:border-[#FFA900] focus:outline-none 
                rounded-lg w-xs h-10 p-2.5 text-white" 
                type={"email"} {...getInputProps("email")}
                placeholder={"e-mail"}
                />

                <input className="border border-3 border-gray-200 focus:border-[#FFA900] focus:outline-none 
                rounded-lg w-xs h-10 p-2.5 text-white" 
                type={"password"} {...getInputProps("password")}
                placeholder={"password"}
                />

                <button className={`flex bg-[#FFA900] hover:bg-white focus:outline-none disabled:bg-gray-500 
                rounded-lg w-xs h-10 p-2.5 text-black items-center justify-center font-bold text-lg`}
                type={"submit"} disabled={!(touched?.email && touched?.password)}
                onClick={() => { if (errors?.email.length === 0 && errors?.password.length === 0) 
                    {alert(`Welecome ${values.email}!`)}}}
                >Login</button>

                {(errors?.email || errors?.password) && (
                <h2 className="text-[#FFA900] font-bold text-sm">Incorrect Email or Password</h2> )}

                <div className="flex items-center w-full px-5 my-1">
                    <div className="flex-grow h-px bg-white"></div> 
                    <span className="mx-2.5 text-md text-white font-bold">OR</span>
                    <div className="flex-grow h-px bg-white"></div>
                </div>

                <button className="flex bg-white hover:bg-[#FFA900] focus:outline-none 
                rounded-lg w-xs h-10 p-2.5 text-black items-center justify-center font-bold text-lg" 
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