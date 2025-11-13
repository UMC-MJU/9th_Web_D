import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [decision, setDecision] = useState<'allow' | 'login' | 'back' | 'pending'>('pending');

  useEffect(() => {
    if (isLoggedIn()) {
      setDecision('allow');
      return;
    }
    // 비로그인 접근 시 안내 모달
    const ok = window.confirm('로그인이 필요한 서비스입니다. 로그인을 진행하시겠습니까?');
    setDecision(ok ? 'login' : 'back');
  }, [location.pathname]);

  if (decision === 'pending') return null;
  if (decision === 'login') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (decision === 'back') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}