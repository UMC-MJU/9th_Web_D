import SignUpInput from '../components/SignUpInput';

const SignUpInputEmail = ({ register, errors, onNext }) => {
    return (
        <>
            <SignUpInput name="email" type="email" placeholder="Enter your e-mail" register={register} error={errors.email} />
            <button
                type="button"
                onClick={onNext}
                className={`flex bg-white hover:bg-[#FFA900] transition-colors focus:outline-none 
                           rounded-lg w-full h-12 p-2.5 text-black items-center justify-center font-bold text-lg mt-3`}
            >
                Next
            </button>
        </>
    );
};

export default SignUpInputEmail;