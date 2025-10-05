import './App.css';
import MoviePage from "./pages/MoviePage" //영화 페이지
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage";
import { MovieDetailPage } from './pages/MovieDetailPage';
import NotFoundPage from './pages/NotFoundPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path:'movie/:category',
        element: <MoviePage />,
      },
      {
        path:'movies/:movieId',
        element: <MovieDetailPage />
      }
      ,
      {
        path:'movie/:category/movies/:movieId',
        element: <MovieDetailPage />
      }
    ],
  },
]);


//APP 컴포넌트 본문
export default function App() {
    console.log(import.meta.env.VITE_TMDB_KEY);
  return <RouterProvider router={router} />;
}
