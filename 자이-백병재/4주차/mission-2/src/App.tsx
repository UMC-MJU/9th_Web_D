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
    ],
  }]

const router = createBrowserRouter([...publicRouter, ...privateRouter]);

function App() {
 return (
   <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
 )
}

export default App