import type { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from './../types/auth';
import { axiosInstance } from './axios';

export const postSignup = async (
    body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
    // baseURL이 적용되도록 수정
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

export const postSignin = async (
    body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
    // baseURL이 적용되도록 수정
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const postSignout = async () => {
    // baseURL이 적용되도록 수정
    const { data } = await axiosInstance.post('/v1/auth/sign-out');
    return data
};

export const getMyInfo = async () : Promise<ResponseMyInfoDto> => {
    // baseURL이 적용되도록 수정
    const { data } = await axiosInstance.get("/v1/users/me");

    return data;
};