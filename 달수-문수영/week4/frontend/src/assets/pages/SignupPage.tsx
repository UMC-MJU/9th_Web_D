import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { validateSignin, type UserSigninInformation } from '../../utils/validate';
import { useState } from 'react';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    
    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValues: { email: "", password: "" },
            validate: validateSignin,
        });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 1) {
            // 이메일 유효성 검사
            if (!errors.email && values.email) {
                setStep(2);
            }
        } else if (step === 2) {
            // 비밀번호 유효성 검사
            if (!errors.password && values.password) {
                // 비밀번호 확인 검사
                if (values.password !== confirmPassword) {
                    setConfirmPasswordError('비밀번호가 일치하지 않습니다!');
                    return;
                }
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = () => {
        console.log({ ...values, confirmPassword });
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (values.password && value !== values.password) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다!');
        } else {
            setConfirmPasswordError('');
        }
    };
    
    // 각 단계별 버튼 비활성화 조건
    const isDisabled = (currentStep: number): boolean => {
        if (currentStep === 1) {
            return !values.email || !!errors.email;
        } else if (currentStep === 2) {
            return !values.password || !!errors.password || !confirmPassword || !!confirmPasswordError;
        }
        return true;
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full gap-4">
            <button
                type="button"
                aria-label="뒤로가기"
                onClick={handleBack}
                className="absolute left-4 top-4 text-xl"
            >
                ←
            </button>
            <div className="flex flex-col gap-3 items-center">
                <h1 className="text-center text-base font-semibold">회원가입</h1>
                
                {step === 1 ? (
                    // 1단계: 이메일 입력
                    <>
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

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isDisabled(1)}
                            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300">
                                다음
                        </button>
                    </>
                ) : (
                    // 2단계: 비밀번호 입력
                    <>
                        {/* 이메일 정보 표시 */}
                        <div className="w-[300px] p-3 bg-gray-100 rounded-md flex items-center gap-2">
                            <span className="text-gray-600">📧</span>
                            <span className="text-sm text-gray-700">{values.email}</span>
                        </div>

                        <input
                            {...getInputProps("password")}
                            className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            type={"password"}
                            placeholder={"비밀번호를 입력해주세요!"}
                        />

                        {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}

                        <input
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${confirmPasswordError ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            type={"password"}
                            placeholder={"비밀번호를 다시 한 번 입력해주세요!"}
                        />

                        {confirmPasswordError && (<div className="text-red-500 text-sm">{confirmPasswordError}</div>)}

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isDisabled(2)}
                            className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-medium hover:bg-gray-900 transition-colors cursor-pointer disabled:bg-gray-400">
                                다음
                        </button>
                    </>
                )}

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