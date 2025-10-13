import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { signupSchema, type SignupFormData } from '../../schemas/auth';
import { useState } from 'react';
import { useLocalStorage, type UserInfo, type AuthToken, defaultUserInfo, defaultAuthToken } from '../../hooks/useLocalStorage';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
    });

    const watchedValues = watch();

    const navigate = useNavigate();

    // 로컬 스토리지 훅 사용
    const [, setUserInfo] = useLocalStorage<UserInfo>('userInfo', defaultUserInfo);
    const [, setAuthToken] = useLocalStorage<AuthToken>('authToken', defaultAuthToken);

    const handleNext = async () => {
        if (step === 1) {
            // 이메일 유효성 검사
            const isEmailValid = await trigger('email');
            if (isEmailValid && watchedValues.email) {
                setStep(2);
            }
        } else if (step === 2) {
            // 비밀번호 유효성 검사
            const isPasswordValid = await trigger(['password', 'confirmPassword']);
            if (isPasswordValid && watchedValues.password && watchedValues.confirmPassword) {
                setStep(3);
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

    const onSubmit = (data: SignupFormData) => {
        console.log('회원가입 데이터:', data);
        
        // 임시 토큰 생성 (실제로는 서버에서 받아야 함)
        const mockToken = `mock_token_${Date.now()}`;
        const mockRefreshToken = `mock_refresh_token_${Date.now()}`;
        
        // 사용자 정보 저장
        const newUserInfo: UserInfo = {
            id: `user_${Date.now()}`,
            email: data.email,
            nickname: data.nickname,
            token: mockToken,
            loginTime: Date.now(),
        };
        
        // 토큰 정보 저장
        const newAuthToken: AuthToken = {
            accessToken: mockToken,
            refreshToken: mockRefreshToken,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24시간 후 만료
        };
        
        // 로컬 스토리지에 저장
        setUserInfo(newUserInfo);
        setAuthToken(newAuthToken);
        
        console.log('사용자 정보 저장됨:', newUserInfo);
        console.log('토큰 정보 저장됨:', newAuthToken);
        
        alert('회원가입이 완료되었습니다!');
        navigate('/');
    };

    // 각 단계별 버튼 비활성화 조건
    const isDisabled = (currentStep: number): boolean => {
        if (currentStep === 1) {
            return !watchedValues.email || !!errors.email;
        } else if (currentStep === 2) {
            return !watchedValues.password || !watchedValues.confirmPassword || !!errors.password || !!errors.confirmPassword;
        } else if (currentStep === 3) {
            return !watchedValues.nickname || !!errors.nickname;
        }
        return true;
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full gap-4">
            <div className="w-full max-w-[300px] flex items-center justify-start mb-4">
                <button
                    type="button"
                    aria-label="뒤로가기"
                    onClick={handleBack}
                    className="text-xl mr-4"
                >
                    ←
                </button>
                <h1 className="text-base font-semibold">회원가입</h1>
            </div>
            <div className="flex flex-col gap-3 items-center">
                
                {step === 1 && (
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
                            {...register("email")}
                            className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            type={"email"}
                            placeholder={"이메일"}
                        />

                        {errors?.email && (<div className="text-red-500 text-sm">{errors.email.message}</div>)}

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isDisabled(1)}
                            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-400">
                                다음
                        </button>
                    </>
                )}

                {step === 2 && (
                    // 2단계: 비밀번호 입력
                    <>
                        {/* 이메일 정보 표시 */}
                        <div className="w-[300px] p-3 bg-gray-100 rounded-md flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{watchedValues.email}</span>
                        </div>

                        <div className="relative w-[300px]">
                            <input
                                {...register("password")}
                                className={`border w-full p-[10px] pr-12 rounded-sm focus:border-[#807bff] ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
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

                        {errors?.password && watchedValues.password && (<div className="text-red-500 text-sm">{errors.password.message}</div>)}

                        <div className="relative w-[300px]">
                            <input
                                {...register("confirmPassword")}
                                className={`border w-full p-[10px] pr-12 rounded-sm focus:border-[#807bff] ${watchedValues.confirmPassword && watchedValues.password !== watchedValues.confirmPassword ? "border-red-500 bg-red-200" : "border-gray-300"}`}
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

                        {watchedValues.confirmPassword && watchedValues.password !== watchedValues.confirmPassword && (
                            <div className="text-red-500 text-sm">비밀번호가 일치하지 않습니다!</div>
                        )}

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
                            {...register("nickname")}
                            className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.nickname ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            type={"text"}
                            placeholder={"닉네임을 입력해주세요!"}
                        />

                        {errors?.nickname && (<div className="text-red-500 text-sm">{errors.nickname.message}</div>)}

                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isDisabled(3)}
                            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-400">
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