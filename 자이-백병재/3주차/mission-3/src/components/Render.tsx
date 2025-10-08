import type { Movie } from "../types/movie";
import ErrorAppear from "./ErrorAppear";
import LoadingSpinner from "./LoadingSpinner";

interface RenderProps {
  isLoading: boolean;
  isError: boolean;
  movie: Movie; 
  SuccessComponent: React.ComponentType<{ movie: Movie }>; 
}

const Render = ({ isLoading, isError, movie, SuccessComponent }: RenderProps) => {
  if (isLoading || !movie) {
    return <LoadingSpinner />;
  }
  
  if (isError) {
    return <ErrorAppear />;
  }

  return <SuccessComponent movie={movie} />;
};

export default Render;