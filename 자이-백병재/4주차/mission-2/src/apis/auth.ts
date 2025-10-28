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
    const { data } = await axios.get("http://localhost:8000/v1/users/me");

    return data;
};