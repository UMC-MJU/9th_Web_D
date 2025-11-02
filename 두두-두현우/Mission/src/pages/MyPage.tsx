import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MyPageProps {
  isLoggedIn: boolean;
}

const MyPage = ({ isLoggedIn }: MyPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인하지 않은 상태에서 접근 시 404로 리다이렉트
    if (!isLoggedIn) {
      navigate("/404", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // 로그인 상태가 아니면 빈 화면 (useEffect에서 리다이렉트 처리)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <h1 className="mt-4 text-white">MyPage</h1>
    </div>
  );
};

export default MyPage;
