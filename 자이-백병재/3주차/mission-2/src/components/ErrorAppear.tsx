const ErrorAppear = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-red-700 p-6">
      <div className="flex flex-col items-center">
        <ErrorIcon />
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          ERROR!
        </h1>
      </div>
    </div>
  );
};

const ErrorIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-24 w-24 text-red-700"
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


export default ErrorAppear;