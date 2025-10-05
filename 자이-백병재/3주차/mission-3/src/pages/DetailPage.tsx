import { useParams } from "react-router-dom";
import useAPI from "../hooks/useAPI";
import Render from "../components/Render";
import MovieList from "../components/MovieList";

const DetailPage = () => {
    const { id } = useParams();

    const { movie, isLoading, isError }  = useAPI(Number(id));
      return (
    <div>
      <Render isLoading={isLoading} isError={isError} movie={movie}
      SuccessComponent={MovieList} />
    </div>
  );
}

export default DetailPage;