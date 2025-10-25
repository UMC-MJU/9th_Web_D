import useAPI from "../hooks/useAPI";
import Render from "../components/Render";
import MovieDetail from "../components/MovieDetail";
import type { Detail } from "../types/detail";

const DetailPage = () => {
    const { movie, isLoading, isError }  = useAPI<Detail>();
    const movies = movie ? movie[0] : null;

      return (
    <div>
      <Render isLoading={isLoading} isError={isError} movie={movies}
      SuccessComponent={MovieDetail} />
    </div>
  );
}

export default DetailPage;