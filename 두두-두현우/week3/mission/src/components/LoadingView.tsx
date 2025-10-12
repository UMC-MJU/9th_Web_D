interface LoadingViewProps {
  message?: string;
}

const LoadingView = ({ message }: LoadingViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
      {message && <p className="text-lg">{message}</p>}
    </div>
  );
};

export default LoadingView;

