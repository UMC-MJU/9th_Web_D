import { Navigate } from "react-router-dom";

interface MyPageProps {
  isLoggedIn: boolean;
}

const MyPage = ({ isLoggedIn }: MyPageProps) => {
  if (!isLoggedIn) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div>
      <h1 className="mt-4 text-white">MyPage</h1>
    </div>
  );
};

export default MyPage;
