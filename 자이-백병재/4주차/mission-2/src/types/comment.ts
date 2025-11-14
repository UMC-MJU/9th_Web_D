import { DeleteCommentResponse } from './../../../../../달수-문수영/week5/backend/src/comment/dto/comment-response.dto';
import type { ResponseMyInfoDto } from "./auth"

// 댓글 목록 리턴타입
export type CommentResponseDto = { 
    id: number,
    content: string,
    lpId: number,
    authorID: number,
    createdAt: string,
    author: ResponseMyInfoDto,
}

export type CommentParms = {
    lpId: number;
    cursor?: number;
    limit?: number;
    order?: "asc" | "desc";
}

export type CreateCommentParams = {
  lpId: number;
  content: string;
};

export type CreateCommentRequest = {
  content: string;
};

export type FixCommentParams = {
  lpId: number;
  commentId: number;
  content: string;
}

export type DeleteCommentParams = {
  lpId: number;
  commentId: number;
}

export type DeleteCommentResponse = {
  message: string;
}