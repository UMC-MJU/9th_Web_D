import { useState } from "react";
import useAPI from "../hooks/useAPI";
import MovieList from "../components/movieList";
import LoadingSpinner from "../components/LoadingSpinner";

const MoviePage = () => {
  const [pageNum, setPageNum] = useState(1);
  const { movie, isLoading, isError }  = useAPI(pageNum);

  if(isLoading) {
    return (<LoadingSpinner />);
  }
  else if(isError) {
    return (<p>에러 발생!!</p>);
  }
  else {
  return(<MovieList movie={movie}/>);
  }  
};

export default MoviePage;