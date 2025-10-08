import { useParams } from "react-router-dom";
import useAPI from "../hooks/useAPI";
import Render from "../components/Render";
import MovieDetail from "../components/MovieDetail";

const DetailPage = () => {
    const { id } = useParams();

    const { movie, isLoading, isError }  = useAPI(Number(id));
      return (
    <div>
      <Render isLoading={isLoading} isError={isError} movie={movie[0]}
      SuccessComponent={MovieDetail} />
    </div>
  );
}

export default DetailPage;