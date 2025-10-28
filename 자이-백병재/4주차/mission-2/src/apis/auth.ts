import type { RequestSignupDto } from './../types/auth';
import axios from 'axios';

export const postSignup = async (
    body: RequestSignupDto,
): Promise<RequestSignupDto> => {
    const { data } = await axios.post("http://localhost:8000/v1/auth/signup", body);

    return data;
};

export const postSignin = async (
    body: RequestSignupDto,
): Promise<RequestSignupDto> => {
    const { data } = await axios.post("http://localhost:8000/v1/auth/signin", body);

    return data;
};

export const getMyInfo = async () : Promise<RequestSignupDto> => {
    const { data } = await axios.get("http://localhost:8000/v1/users/me");
    return data;
};