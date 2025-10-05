import { useState } from "react";
import useAPI from "../hooks/useAPI";
import MovieList from "../components/MovieList";
import PageButton from "../components/PageButton";
import Render from "../components/Render";

const MoviePage = () => {
  const [pageNum, setPageNum] = useState(1);
  const { movie, isLoading, isError }  = useAPI(pageNum);

  return (
    <div>
      <PageButton pageNum={pageNum} setPageNum={setPageNum} />
      <div className="content-area">
      <Render isLoading={isLoading} isError={isError} movie={movie}
      SuccessComponent={MovieList} />
      </div>
    </div>
  );
}

export default MoviePage;