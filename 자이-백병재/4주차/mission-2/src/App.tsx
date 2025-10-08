import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainPage from './pages/MainPage'
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <>Error</>,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App