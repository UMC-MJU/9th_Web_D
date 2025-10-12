import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignUpInput = ({ name, type, placeholder, register, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType = showPassword ? "text" : type;

    return (
        <div className="relative flex flex-col w-full"> 
            <input
                className={`border-3 focus:border-[#FFA900] focus:outline-none text-white
                           rounded-lg h-12 px-4 ${error ? "border-red-500" : "border-gray-200"}
                           pr-10`}
                type={inputType}
                {...register(name)}
                placeholder={placeholder}
            />
            {error && (
                <div className="text-red-500 text-sm mt-1.5">
                    {error.message}
                </div>
            )}
            
            {type === 'password' && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-3.5 right-3 text-gray-400 hover:text-white"
                >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    {/* showPassword 상태에 따라 다른 아이콘을 보여주기 */}
                </button>
            )}
        </div>
    );
};

export default SignUpInput;