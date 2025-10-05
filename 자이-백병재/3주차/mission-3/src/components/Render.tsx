import ErrorAppear from "./ErrorAppear";
import LoadingSpinner from "./LoadingSpinner";

interface RenderProps {
  isLoading: boolean;
  isError: boolean;
  movie: any; 
  SuccessComponent: React.ComponentType<{ movie: any }>; 
}

const Render = ({ isLoading, isError, movie, SuccessComponent }: RenderProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (isError) {
    return <ErrorAppear />;
  }

  return <SuccessComponent movie={movie} />;
};

export default Render;