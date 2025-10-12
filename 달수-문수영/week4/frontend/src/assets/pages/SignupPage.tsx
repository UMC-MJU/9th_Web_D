import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { validateSignup, type UserSignupInformation } from '../../utils/validate';

const SignupPage = () => {
    const { values, errors, touched, getInputProps } =
        useForm<UserSignupInformation>({
            initialValues: { email: "", password: "", confirmPassword: "" },
            validate: validateSignup,
        });

    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log(values);
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
    };
    
    //오류가 하나라도 있거나 입력값이 비어있으면 버튼을 비활성화
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
                <h1 className="text-center text-base font-semibold">회원가입</h1>
                <button
                    type="button"
                    className="w-[300px] h-10 rounded bg-white text-black border border-gray-300 hover:bg-gray-100"
                    aria-label="구글 회원가입"
                >
                    구글 회원가입
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
                    placeholder={"비밀번호 (8-20자)"}
                />

                {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}

                <input
                    {...getInputProps("confirmPassword")}
                    className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.confirmPassword && touched?.confirmPassword ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호 확인"}
                />

                {errors?.confirmPassword && touched?.confirmPassword && (<div className="text-red-500 text-sm">{errors.confirmPassword}</div>)}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300">
                        회원가입
                </button>

                <div className="text-center text-sm text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:underline"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;