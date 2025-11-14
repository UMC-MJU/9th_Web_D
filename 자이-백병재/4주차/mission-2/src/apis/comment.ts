import type { CommentParms, CommentResponseDto, CreateCommentParams, CreateCommentRequest, FixCommentRequest, FixCommentParams } from '../types/comment';
import type { CursorBasedResponse } from './../types/lp';
import { axiosInstance } from './axios';


export const getCommentList = async(CommentParms: CommentParms): Promise<CursorBasedResponse<CommentResponseDto[]>> => {
    const { data } = await axiosInstance.get(`/v1/lps/${CommentParms.lpId}/comments`, {
        params: CommentParms,
    })

    return data;
}

export const createComment = async({lpId, content}: CreateCommentParams): Promise<CommentResponseDto> => {
    const requestBody: CreateCommentRequest = { content };

  const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`,
    requestBody
  );

  return response.data;
} ;

export const fixComment = async({lpId, commentId, content}: FixCommentParams): Promise<CommentResponseDto> => {
  const requestBody: CreateCommentRequest = { content };

  const response = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`,
    requestBody
  );

  return response.data.data;
}