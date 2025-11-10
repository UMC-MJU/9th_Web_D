import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainPage from './pages/MainPage'
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateLayout from './layouts/privateLayout';
import ErrorPage from './pages/ErrorPage';
import PlayPage from './pages/PlayPage';
import GoogleLoginPage from './pages/GoogleLoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LpDetailPage from './pages/LpDetailPage';

const publicRouter = [{
  path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginPage />},
    ],
  }]

  const privateRouter = [{
  path: "/", 
  element: <PrivateLayout />,
      children: [
      { path: "play", element: <PlayPage /> },
      { path: "lp/:lpid", element: <LpDetailPage />}
    ],
  }]

const router = createBrowserRouter([...publicRouter, ...privateRouter]);

const queryClient = new QueryClient();

function App() {
 return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
 )
}

export default App