import NavBar from "../components/NavBar";

const ErrorPage = () => {
  return (
    <>
    <NavBar />
    <div className="min-h-screen flex flex-col justify-center items-center font-sans">
      
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-24 w-24 text-red-700"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
  </svg>
    </div>
    </>
  );
};

export default ErrorPage;