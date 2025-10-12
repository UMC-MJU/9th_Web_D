export type UserSignupInformation = {
    email: string;
    password: string
};

function validateUser(values: UserSignupInformation) {
    const errors = {
        email: "",
        password: "",
    };
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)) {
        errors.email = "올바르지 못한 이메일 형식"
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(values.password)) {
        errors.password = "올바른 비밀번호 형식이 아님"
    }
    return errors;
}

function validateSignup(values: UserSignupInformation) {
    return validateUser(values);
}

export { validateSignup }