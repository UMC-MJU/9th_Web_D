import './App.css';
import MoviePage from "./pages/MoviePage" //영화 페이지
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path:'moive/:category',
        element: <MoviePage />,
        index: true,
      },
    ],
  },
]);


//APP 컴포넌트 본문
export default function App() {
    console.log(import.meta.env.VITE_TMDB_KEY);
  return <RouterProvider router={router} />;
}
