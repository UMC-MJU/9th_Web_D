import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../../schemas/auth';
import { useLocalStorage, type UserInfo, type AuthToken, defaultUserInfo, defaultAuthToken } from '../../hooks/useLocalStorage';
import { tokenStorage } from '../../lib/token';
import { api } from '../../apis';


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
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from || '/';

    // 로컬 스토리지 훅 사용
    const [userInfo, setUserInfo] = useLocalStorage<UserInfo>('userInfo', defaultUserInfo);
    const [, setAuthToken] = useLocalStorage<AuthToken>('authToken', defaultAuthToken);

    const onSubmit = async (data: LoginFormData) => {
        console.log('로그인 데이터:', data);

        // 실제 로그인 API 호출
        const res = await api.post('/auth/signin', {
            email: data.email,
            password: data.password,
        });

        // 토큰 저장 (인터셉터가 사용)
        tokenStorage.set(res.data.accessToken, res.data.refreshToken);

        // 화면 표기를 위해 만료 시간 파싱(JWT exp 사용)
        const payload = JSON.parse(atob(res.data.accessToken.split('.')[1])) as { exp: number };
        const expiresAtMs = payload.exp * 1000;

        // 사용자 정보 저장 (로그인 시 기존 정보 업데이트)
        const updatedUserInfo: UserInfo = {
            ...userInfo,
            email: data.email,
            token: res.data.accessToken,
            loginTime: Date.now(),
        };

        // 토큰 정보 저장(기존 훅 상태도 유지)
        const newAuthToken: AuthToken = {
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            expiresAt: expiresAtMs,
        };

        setUserInfo(updatedUserInfo);
        setAuthToken(newAuthToken);

        alert('로그인이 완료되었습니다!');
        navigate(from, { replace: true });
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
                    className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-400">
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