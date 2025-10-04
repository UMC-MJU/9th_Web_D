import { useState } from "react";
import useAPI from "../hooks/useAPI";
import MovieList from "../components/movieList";

const MoviePage = () => {
  const [pageNum, setPageNum] = useState(1);
  const { movie, isLoading, isError }  = useAPI(pageNum);

  if(isLoading) {
    return (<p>로딩중!</p>);
  }
  else if(isError) {
    return (<p>에러 발생!!</p>);
  }
  else {
  return(<MovieList movie={movie}/>);
  }  
};

export default MoviePage;