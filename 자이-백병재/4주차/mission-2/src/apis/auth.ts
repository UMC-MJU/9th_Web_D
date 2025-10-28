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

export const getMyInfo = async () : Promise<ResponseMyInfoDto> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Access token is not found in localStorage.");
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