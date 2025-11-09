import type { CommentParms, CommentResponseDto } from '../types/comment';
import type { CursorBasedResponse } from './../types/lp';
import { axiosInstance } from './axios';


export const getCommentList = async(CommentParms: CommentParms): Promise<CursorBasedResponse<CommentResponseDto[]>> => {
    const { data } = await axiosInstance.get(`/v1/lps/${CommentParms.lpId}/comments`, {
        params: CommentParms,
    })

    return data;
}