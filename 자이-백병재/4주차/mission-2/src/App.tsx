import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainPage from './pages/MainPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <>Error</>,
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App