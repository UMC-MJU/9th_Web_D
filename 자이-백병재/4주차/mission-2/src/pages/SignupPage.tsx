import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be 8 characters or longer" })
    .max(20, { message: "Password cannot exceed 20 characters" }),
    confirmPassword: z.string().min(8).max(20),
    name: z.string().min(1, { message: "Please enter your name" })
})  .refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UserSignupInformation = z.infer<typeof schema>;

const SignupPage = () => {

    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<UserSignupInformation>({
        defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const onSubmit = (data: UserSignupInformation) => {
        const { confirmPassword, ...rest } = data;
    }

return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-10 gap-5 w-full max-w-sm">
            <h2 className="text-white font-bold text-3xl mb-2">Sign Up</h2>

            <div className="flex flex-col w-full">
                <input 
                    className={`border-3 focus:border-[#FFA900] focus:outline-none text-white
                    rounded-lg h-12 px-4 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                    type="email" 
                    {...register("email")}
                    placeholder="Enter your e-mail"
                />
                {errors.email && (
                    <div className="text-red-500 text-sm mt-1.5">
                        {errors.email.message}
                    </div>
                )}
            </div>

            <div className="flex flex-col w-full">
                <input 
                    className={`border-3 focus:border-[#FFA900] focus:outline-none text-white
                    rounded-lg h-12 px-4 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                    type="password" 
                    {...register("password")}
                    placeholder="Enter your password"
                />
                {errors.password && (
                    <div className="text-red-500 text-sm mt-1.5">
                        {errors.password.message}
                    </div>
                )}
            </div>

            <div className="flex flex-col w-full">
                <input 
                    className={`border-3 focus:border-[#FFA900] focus:outline-none text-white
                    rounded-lg h-12 px-4 ${errors.confirmPassword ? "border-red-500" : "border-gray-200"}`}
                    type="password" 
                    {...register("confirmPassword")}
                    placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1.5">
                        {errors.confirmPassword.message}
                    </div>
                )}
            </div>

            <div className="flex flex-col w-full">
                <input 
                    className={`border-3 focus:border-[#FFA900] focus:outline-none text-white
                    rounded-lg h-12 px-4 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                    type="text"
                    {...register("name")}
                    placeholder="Enter your name"
                />
                {errors.name && (
                    <div className="text-red-500 text-sm mt-1.5">
                        {errors.name.message}
                    </div>
                )}
            </div>

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