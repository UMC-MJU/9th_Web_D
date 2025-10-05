import { useState } from "react";
import useAPI from "../hooks/useAPI";
import MovieList from "../components/MovieList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAppear from "../components/ErrorAppear";
import PageButton from "../components/PageButton";

const MoviePage = () => {
  const [pageNum, setPageNum] = useState(1);
  const { movie, isLoading, isError }  = useAPI(pageNum);


  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    else if (isError) {
      return <ErrorAppear />;
    }
    return <MovieList movie={movie} />;
  };

  return (
    <div>
      <PageButton pageNum={pageNum} setPageNum={setPageNum} />
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

export default MoviePage;