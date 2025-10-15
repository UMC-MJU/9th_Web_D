import type { RequestSignupDto } from './../types/auth';
import axios from 'axios';

const postSignup = async (
    body: RequestSignupDto,
): Promise<RequestSignupDto> => {
    const { data } = await axios.post("http://localhost:8000/v1/auth/signup", body);

    return data;
};

export default postSignup;