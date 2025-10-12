export type UserSigninInformation = {
    email: string;
    password: string;
};

export type UserSignupInformation = {
    email: string;
    password: string;
    confirmPassword: string;
};

function validate(values: UserSigninInformation) {
    const errors: { email: string; password: string } = {
        email: "", 
        password: "",
    };

    if (
        !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
          values.email,
        )
      ) {
        errors.email = "올바른 이메일 형식이 아닙니다!";
      }

      //비밀번호 8자 20자 사이
      if(!(values.password.length >= 8 && values.password.length <= 20)) {
        errors.password = "비밀번호는 8자 이상 20자 이하여야 합니다!";
      }

      return errors;
}
export function validateSignin(values: UserSigninInformation) {
    return validate(values);
}

function validateSignup(values: UserSignupInformation) {
    const errors: { email: string; password: string; confirmPassword: string } = {
        email: "", 
        password: "",
        confirmPassword: "",
    };

    if (
        !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
          values.email,
        )
      ) {
        errors.email = "올바른 이메일 형식이 아닙니다!";
      }

      //비밀번호 8자 20자 사이
      if(!(values.password.length >= 8 && values.password.length <= 20)) {
        errors.password = "비밀번호는 8자 이상 20자 이하여야 합니다!";
      }

      //비밀번호 확인
      if(values.password !== values.confirmPassword) {
        errors.confirmPassword = "비밀번호가 일치하지 않습니다!";
      }

      return errors;
}

export { validateSignup };
