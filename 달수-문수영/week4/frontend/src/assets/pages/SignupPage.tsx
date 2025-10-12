import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { validateSignup, type UserSignupInformation } from '../../utils/validate';
import { useState } from 'react';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { values, errors, touched, getInputProps } =
        useForm<UserSignupInformation>({
            initialValues: { email: "", password: "", confirmPassword: "", nickname: "" },
            validate: validateSignup,
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
                setStep(3); // 닉네임 단계로 이동
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else if (step === 3) {
            setStep(2);
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = () => {
        // 최종 회원가입 로직
        if (!errors.nickname && values.nickname) {
            console.log(values);
            alert('회원가입이 완료되었습니다!');
            navigate('/login');
        }
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
        } else if (currentStep === 3) {
            return !values.nickname || !!errors.nickname;
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

                        <div className="relative w-[300px]">
                            <input
                                {...getInputProps("password")}
                                className={`border w-full p-[10px] pr-12 rounded-sm focus:border-[#807bff] ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                                type={showPassword ? "text" : "password"}
                                placeholder={"비밀번호를 입력해주세요!"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}

                        <div className="relative w-[300px]">
                            <input
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={`border w-full p-[10px] pr-12 rounded-sm focus:border-[#807bff] ${confirmPasswordError ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={"비밀번호를 다시 한 번 입력해주세요!"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

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

                {step === 3 && (
                    // 3단계: 닉네임 및 프로필 이미지
                    <>
                        {/* 프로필 이미지 UI */}
                        <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>

                        <input
                            {...getInputProps("nickname")}
                            className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.nickname && touched?.nickname ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            type={"text"}
                            placeholder={"닉네임을 입력해주세요!"}
                        />

                        {errors?.nickname && touched?.nickname && (<div className="text-red-500 text-sm">{errors.nickname}</div>)}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isDisabled(3)}
                            className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors cursor-pointer disabled:bg-pink-300">
                                회원가입 완료
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