import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpInput from "../components/SignUpInput";
import { signupSchema } from "../schemas/signupSchema";
import type { UserSignupInformation } from "../schemas/signupSchema";

const SignupPage = () => {

    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<UserSignupInformation>({
        defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });

    const onSubmit = (data: UserSignupInformation) => {
        const { confirmPassword, ...rest } = data;
    }

return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-10 gap-5 w-full max-w-sm">
            <h2 className="text-white font-bold text-3xl mb-2">Sign Up</h2>

            <SignUpInput 
                name="email"
                type="email"
                placeholder="Enter your e-mail"
                register={register}
                error={errors.email}
            />

            <SignUpInput
                name="password"
                type="password"
                placeholder="Enter your password"
                register={register}
                error={errors.password}
            />
            <SignUpInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                register={register}
                error={errors.confirmPassword}
            />
            <SignUpInput
                name="name"
                type="text"
                placeholder="Enter your name"
                register={register}
                error={errors.name}
            />

            <button 
                className={`flex bg-white hover:bg-[#FFA900] transition-colors focus:outline-none disabled:bg-gray-500 
                rounded-lg w-full h-12 p-2.5 text-black items-center justify-center font-bold text-lg mt-3`}
                type="submit" 
                onClick={handleSubmit(onSubmit)} 
                disabled={isSubmitting || Object.keys(errors).length > 0}
            >
                Sign Up
            </button>
        </div>
    </div>

    );
};

export default SignupPage;