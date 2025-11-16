import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    const queryClient = useQueryClient();

    // 로컬 스토리지 훅 사용
    const [userInfo, setUserInfo] = useLocalStorage<UserInfo>('userInfo', defaultUserInfo);
    const [, setAuthToken] = useLocalStorage<AuthToken>('authToken', defaultAuthToken);

    const { mutate: loginMutate, isPending } = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const res = await api.post('/auth/signin', {
                email: data.email,
                password: data.password,
            });
            return res.data?.data ?? res.data;
        },
        onError: (e: any) => {
            const msg = e?.response?.data?.message ?? '로그인에 실패했습니다.';
            alert(Array.isArray(msg) ? msg[0] : msg);
        },
        onSuccess: (payload: { accessToken: string; refreshToken: string }) => {
            const { accessToken, refreshToken } = payload;
            // 토큰 저장
            tokenStorage.set(accessToken, refreshToken);
            // 만료 시간 파싱
            const jwt = JSON.parse(atob(accessToken.split('.')[1])) as { exp: number };
            const expiresAtMs = jwt.exp * 1000;
            // 사용자 정보/토큰 로컬 저장
            const updatedUserInfo: UserInfo = {
                ...userInfo,
                email: watchedValues.email,
                token: accessToken,
                loginTime: Date.now(),
            };
            const newAuthToken: AuthToken = {
                accessToken,
                refreshToken,
                expiresAt: expiresAtMs,
            };
            setUserInfo(updatedUserInfo);
            setAuthToken(newAuthToken);
            // 내 정보/보호 페이지 최신화
            queryClient.invalidateQueries({ queryKey: ['me'] });
            alert('로그인이 완료되었습니다!');
            navigate('/', { replace: true });
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutate(data);
    };
    
    // 간단한 비활성 조건: 값 비어있음 또는 유효성 에러 존재
    const isDisabled: boolean =
        !watchedValues.email || !watchedValues.password || Object.keys(errors || {}).length > 0;

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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 items-center">
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
                    type="submit"
                    disabled={isDisabled || isPending}
                    className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-400">
                        {isPending ? '로그인 중...' : '로그인'}
                </button>
            </form>
            
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