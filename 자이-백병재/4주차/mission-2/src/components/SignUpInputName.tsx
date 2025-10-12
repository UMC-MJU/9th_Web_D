import SignUpInput from '../components/SignUpInput';

const SignUpInputName = ({ register, errors, handleSubmit, onSubmit, isSubmitting, isValid }) => {
    return (
        <>
            <SignUpInput name="name" type="text" placeholder="Enter your name" register={register} error={errors.name} />
            <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
                className={`flex bg-white hover:bg-[#FFA900] transition-colors focus:outline-none
                           disabled:bg-gray-500 disabled:cursor-not-allowed
                           rounded-lg w-full h-12 p-2.5 text-black items-center 
                           justify-center font-bold text-lg mt-3`}
            >
                Sign Up
            </button>
        </>
    );
};

export default SignUpInputName;