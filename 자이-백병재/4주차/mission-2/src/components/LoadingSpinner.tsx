
const LoadingSpinner = () => {
    return (
    <div className="flex h-screen items-center justify-center animate-pulse">
        <div className="size-12 animate-spin rounded-full border-8 border-t-transparent border-amber-300"></div>
    </div>
    );
};

export default LoadingSpinner;