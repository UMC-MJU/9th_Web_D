import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import MoviePage from './pages/MoviePage';
import MainPage from './pages/MainPage';
import ErrorPage from './pages/ErrorPage';
import DetailPage from './pages/DetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage /> ,
    errorElement: <ErrorPage />,
    children: [{
      path: 'movies/:category',
      element: <MoviePage />
    }, {
      path: "details/:id",
      element: <DetailPage />
    }]
  },
]);


function App() {
  return <RouterProvider router={router} />
}

export default App
