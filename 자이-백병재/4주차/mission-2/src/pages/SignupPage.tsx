import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import type { UserSignupInformation } from "../schemas/signupSchema";
import postSignup from "../apis/auth";
import { useNavigate } from 'react-router-dom';
import SignUpInputEmail from '../components/SignUpInputEmail';
import SignUpInputPw from '../components/SignUpInputPw';
import SignUpInputName from '../components/SignUpInputName';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, trigger } = useForm<UserSignupInformation>({
        defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });

    const handleNextStep = async () => {
        let fieldsToValidate: (keyof UserSignupInformation)[] = [];
        if (step === 1) {
            fieldsToValidate = ['email'];
        } else if (step === 2) {
            fieldsToValidate = ['password', 'confirmPassword'];
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setStep(prev => prev + 1);
        }
    };

    const onSubmit = async (data: UserSignupInformation) => {
        const { confirmPassword, ...rest } = data;
        try {
            await postSignup(rest);
            navigate('/');
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <SignUpInputEmail register={register} errors={errors} onNext={handleNextStep} />;
            case 2:
                return <SignUpInputPw register={register} errors={errors} onNext={handleNextStep} />;
            case 3:
                return <SignUpInputName register={register} errors={errors} handleSubmit={handleSubmit}
                 onSubmit={onSubmit} isSubmitting={isSubmitting} isValid={isValid} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-10 gap-5 w-full max-w-sm">
                <h2 className="text-white font-bold text-3xl mb-2">Sign Up</h2>
                {renderStep()}
            </div>
        </div>
    );
};

export default SignupPage;