import ErrorAppear from "./ErrorAppear";
import LoadingSpinner from "./LoadingSpinner";

interface RenderProps<T> {
  isLoading: boolean;
  isError: boolean;
  movie: T | null; 
  SuccessComponent: React.ComponentType<{ movie: T }>; 
}

const Render = <T,>({ 
  isLoading, 
  isError, 
  movie, 
  SuccessComponent 
}: RenderProps<T>) => {

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorAppear />;
  }

  if (movie) {
    return <SuccessComponent movie={movie} />;
  }

  return null;
};

export default Render;