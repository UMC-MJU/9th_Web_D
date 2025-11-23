import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './assets/pages/HomePage';
import NotFoundPage from './assets/pages/NotFoundPage';
import LoginPage from './assets/pages/LoginPage';
import HomeLayout from './assets/layouts/HomeLayout';
import SignupPage from './assets/pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import MemberPage from './assets/pages/MemberPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LpsList from './components/LpsList';
import MovieDetailPage from './assets/pages/MovieDetailPage';
import LpDetailPage from './assets/pages/LpDetailPage';
import InfinitePostsAutoJsonPlaceholder from './components/InfinitePostsAutoJsonPlaceholder';
import InfiniteLpsList from './components/InfiniteLpsList';
import MovieSearchPage from './assets/pages/MovieSearchPage';

const queryClient = new QueryClient();

//1.홈페이지
//2. 로그인 페이지
//3. 회원가입 페이지

// 1) 라우터 정의
const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
	  { path: 'member', element: (
		<ProtectedRoute>
		  <MemberPage />
		</ProtectedRoute>
	  )},
      {path: 'infinite-posts', element: <LpsList />},
      {path: 'lps', element: <InfiniteLpsList />},
      { path: 'lp/:lpid', element: (
        <ProtectedRoute>
          <LpDetailPage />
        </ProtectedRoute>
      )},
      {path: 'movies/:id', element: <MovieDetailPage />},
      {path: 'search', element: <MovieSearchPage />},
    ],
	},
]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
			{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}

export default App;
