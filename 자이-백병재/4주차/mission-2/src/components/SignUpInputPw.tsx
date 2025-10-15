import SignUpInput from '../components/SignUpInput';

const SignUpInputPw = ({ register, errors, onNext, watch }) => {
    return (
        <>
            <SignUpInput name="password" type="password" placeholder="Enter your password" register={register} error={errors.password} />
            <SignUpInput name="confirmPassword" type="password" placeholder="Confirm your password" register={register} error={errors.confirmPassword} />
            <button
                type="button"
                onClick={onNext}
                disabled={!watch("password") || !watch("confirmPassword") || !!errors.password || !!errors.confirmPassword}
                className={`flex bg-white hover:bg-[#FFA900] transition-colors focus:outline-none 
                           disabled:bg-gray-500 disabled:cursor-not-allowed
                           rounded-lg w-full h-12 p-2.5 text-black items-center justify-center font-bold text-lg mt-3`}
            >
                Next
            </button>
        </>
    );
};

export default SignUpInputPw;