export type UserSigninInformation = {
    email: string;
    password: string;
};

export type UserSignupInformation = {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
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
    const errors: { email: string; password: string; confirmPassword: string; nickname: string } = {
        email: "", 
        password: "",
        confirmPassword: "",
        nickname: "",
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

      //닉네임 유효성 검사
      if (!values.nickname.trim()) {
        errors.nickname = "닉네임을 입력해주세요!";
      } else if (values.nickname.length < 2 || values.nickname.length > 10) {
        errors.nickname = "닉네임은 2자 이상 10자 이하여야 합니다!";
      }

      return errors;
}

export { validateSignup };
