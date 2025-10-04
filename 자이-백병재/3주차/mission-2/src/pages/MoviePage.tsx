import { useState } from "react";
import useAPI from "../hooks/useAPI";
import MovieList from "../components/movieList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAppear from "../components/ErrorAppear";

const MoviePage = () => {
  const [pageNum, setPageNum] = useState(1);
  const { movie, isLoading, isError }  = useAPI(pageNum);

  if(isLoading) {
    return (<LoadingSpinner />);
  }
  else if(isError) {
    return (<ErrorAppear />);
  }
  else {
  return(<MovieList movie={movie}/>);
  }  
};

export default MoviePage;