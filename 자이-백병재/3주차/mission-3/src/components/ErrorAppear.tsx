import ErrorIcon from "./ErrorIcon";

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


export default ErrorAppear;