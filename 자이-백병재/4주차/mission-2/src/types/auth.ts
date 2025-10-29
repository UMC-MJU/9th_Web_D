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

export type RequestSigninDto = {
    email: string;
    password: string;
}

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>

export type ResponseMyInfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createAt: Date;
    updataAt: Date;
}>