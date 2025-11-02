import type { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from './../types/auth';
import axios from 'axios';

export const postSignup = async (
    body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
    const { data } = await axios.post("http://localhost:8000/v1/auth/signup", body);

    return data;
};

export const postSignin = async (
    body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
    const { data } = await axios.post("http://localhost:8000/v1/auth/signin", body);

    return data;
};

export const postSignout = async () => {
    const { data } = await axios.post('/v1/auth/sign-out');

    return data
};

export const getMyInfo = async () : Promise<ResponseMyInfoDto> => {
    const tokenString = localStorage.getItem("accessToken");
    let token: string | null = null;

    if (!tokenString) {
        throw new Error("Access token is not found in localStorage.");
    } else {
        token = JSON.parse(tokenString);
    }

    // 요청 헤더(header)에 토큰을 설정하는 config 객체를 만듬.
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const { data } = await axios.get("http://localhost:8000/v1/users/me", config);

    return data;
};