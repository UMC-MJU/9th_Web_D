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