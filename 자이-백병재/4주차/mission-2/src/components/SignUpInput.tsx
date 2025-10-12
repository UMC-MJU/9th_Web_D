const SignUpInput = ({ name, type, placeholder, register, error }) => {
  return (
    <div className="flex flex-col w-full">
      <input
        className={`border-3 focus:border-[#FFA900] focus:outline-none text-white
        rounded-lg h-12 px-4 ${error ? "border-red-500" : "border-gray-200"}`}
        type={type}
        {...register(name)}
        placeholder={placeholder}
      />
      {error && (
        <div className="text-red-500 text-sm mt-1.5">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default SignUpInput;