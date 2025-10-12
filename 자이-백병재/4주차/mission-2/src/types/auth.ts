import type { CommonResponse } from "./common";

export type RequestSignupDto = {
    name: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
}

export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    password: string;
    bio: string | null;
    avatar: string | null;
    createAt: Date;
    updataAt: Date;
}>