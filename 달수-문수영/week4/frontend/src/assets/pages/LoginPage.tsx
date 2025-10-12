import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { validateSignin, type UserSigninInformation } from '../../utils/validate';

const LoginPage = () => {
    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValues: { email: "", password: "" },
            validate: validateSignin,
        });

    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log(values);
    };
    
    //오류가 하나라도 있거나 입력갑이 비어있으면 버튼을 비활성화
    const isDisabled: boolean =
        Object.values(errors || {}).some((error: string) => error.length > 0) || //오류가 있으면 true
        Object.values(values).some((value: string) => value === ""); //입력값이 비어있으면 true

    return (
        <div className="relative flex flex-col items-center justify-center h-full gap-4">
            <button
                type="button"
                aria-label="뒤로가기"
                onClick={() => navigate(-1)}
                className="absolute left-4 top-4 text-xl"
            >
                ←
            </button>
            <div className="flex flex-col gap-3 items-center">
                <h1 className="text-center text-base font-semibold">로그인</h1>
                <button
                    type="button"
                    className="w-[300px] h-10 rounded bg-white text-black border border-gray-300 hover:bg-gray-100"
                    aria-label="구글 로그인"
                >
                    구글 로그인
                </button>
                <div className="my-1 flex items-center gap-2 text-xs text-gray-400 w-[300px]">
                    <span className="flex-1 h-px bg-gray-300" />
                    OR
                    <span className="flex-1 h-px bg-gray-300" />
                </div>
                <input
                    {...getInputProps("email")}
                    name="email"
                    className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}
                />

                {errors?.email && touched?.email && (<div className="text-red-500 text-sm">{errors.email}</div>)}

                <input
                    {...getInputProps("password")}
                    className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />

                {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300">
                        로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;