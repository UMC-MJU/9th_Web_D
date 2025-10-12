import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../../schemas/auth';
import { useLocalStorage, type UserInfo, type AuthToken, defaultUserInfo, defaultAuthToken } from '../../hooks/useLocalStorage';

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const watchedValues = watch();
    const navigate = useNavigate();

    // 로컬 스토리지 훅 사용
    const [userInfo, setUserInfo] = useLocalStorage<UserInfo>('userInfo', defaultUserInfo);
    const [, setAuthToken] = useLocalStorage<AuthToken>('authToken', defaultAuthToken);

    const onSubmit = (data: LoginFormData) => {
        console.log('로그인 데이터:', data);
        
        // 임시 토큰 생성 (실제로는 서버에서 받아야 함)
        const mockToken = `mock_login_token_${Date.now()}`;
        const mockRefreshToken = `mock_login_refresh_token_${Date.now()}`;
        
        // 사용자 정보 저장 (로그인 시에는 기존 정보를 업데이트)
        const updatedUserInfo: UserInfo = {
            ...userInfo,
            email: data.email,
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
        setUserInfo(updatedUserInfo);
        setAuthToken(newAuthToken);
        
        console.log('로그인 정보 저장됨:', updatedUserInfo);
        console.log('토큰 정보 저장됨:', newAuthToken);
        
        alert('로그인이 완료되었습니다!');
        navigate('/');
    };
    
    //오류가 하나라도 있거나 입력값이 비어있으면 버튼을 비활성화
    const isDisabled: boolean =
        Object.values(errors || {}).some((error: any) => error?.message?.length > 0) || //오류가 있으면 true
        Object.values(watchedValues).some((value: string) => value === ""); //입력값이 비어있으면 true

    return (
        <div className="relative flex flex-col items-center justify-center h-full gap-4">
            <div className="w-full max-w-[300px] flex items-center justify-start mb-4">
                <button
                    type="button"
                    aria-label="뒤로가기"
                    onClick={() => navigate(-1)}
                    className="text-xl mr-4"
                >
                    ←
                </button>
                <h1 className="text-base font-semibold">로그인</h1>
            </div>
            <div className="flex flex-col gap-3 items-center">
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
                    {...register("email")}
                    className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}
                />

                {errors?.email && (<div className="text-red-500 text-sm">{errors.email.message}</div>)}

                <input
                    {...register("password")}
                    className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />

                {errors?.password && (<div className="text-red-500 text-sm">{errors.password.message}</div>)}

                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300">
                        로그인
                </button>
            </div>
            
            <div className="text-center text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <a 
                    href="/signup" 
                    className="text-blue-600 hover:text-blue-700 underline"
                >
                    회원가입하기
                </a>
            </div>
        </div>
    );
};

export default LoginPage;