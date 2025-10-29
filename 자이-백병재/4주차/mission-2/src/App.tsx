import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainPage from './pages/MainPage'
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateLayout from './layouts/privateLayout';

const publicRouter = [{
  path: "/",
    element: <MainLayout />,
    errorElement: <>Error</>,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  }]

  const privateRouter = [{
  path: "/", 
  element: <PrivateLayout />
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