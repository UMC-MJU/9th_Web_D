import { useEffect, useState } from 'react';
import { getUserInfo, getAuthToken, isLoggedIn, logout } from '../../utils/auth';
import type { UserInfo, AuthToken } from '../../hooks/useLocalStorage';

const HomePage = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [authToken, setAuthToken] = useState<AuthToken | null>(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        // 페이지 로드 시 로그인 상태 확인
        const checkLoginStatus = () => {
            const user = getUserInfo();
            const token = getAuthToken();
            const loggedIn = isLoggedIn();

            setUserInfo(user);
            setAuthToken(token);
            setIsUserLoggedIn(loggedIn);
        };

        checkLoginStatus();
    }, []);

    const handleLogout = () => {
        logout();
        setUserInfo(null);
        setAuthToken(null);
        setIsUserLoggedIn(false);
        alert('로그아웃되었습니다.');
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">홈페이지</h1>
            
            {isUserLoggedIn && userInfo && authToken ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">로그인 상태</h2>
                    <div className="space-y-2 text-green-700">
                        <p><strong>이메일:</strong> {userInfo.email}</p>
                        <p><strong>닉네임:</strong> {userInfo.nickname}</p>
                        <p><strong>사용자 ID:</strong> {userInfo.id}</p>
                        <p><strong>로그인 시간:</strong> {new Date(userInfo.loginTime).toLocaleString()}</p>
                        <p><strong>토큰 만료:</strong> {new Date(authToken.expiresAt).toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">로그인이 필요합니다</h2>
                    <p className="text-gray-600 mb-4">
                        로그인하거나 회원가입을 진행해주세요.
                    </p>
                    <div className="space-x-4">
                        <a 
                            href="/login" 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            로그인
                        </a>
                        <a 
                            href="/signup" 
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            회원가입
                        </a>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">로컬 스토리지 관리 기능</h2>
                <div className="text-blue-700 space-y-2">
                    <p>✅ useLocalStorage 커스텀 훅 구현</p>
                    <p>✅ 회원가입 시 사용자 정보 및 토큰 저장</p>
                    <p>✅ 로그인 시 토큰 업데이트 및 저장</p>
                    <p>✅ 로그인 상태 확인 기능</p>
                    <p>✅ 로그아웃 시 데이터 삭제</p>
                    <p>✅ 토큰 만료 시간 관리</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;