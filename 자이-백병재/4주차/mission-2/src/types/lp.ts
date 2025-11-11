import type { ResponseMyInfoDto } from "./auth";

export type CursorBasedResponse<T> = { 
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        data: T;
        nextCursor: number;
        hasNext: boolean;
    }
}

export type PaginationDTO = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: "asc" | "desc";
}

export type Tags = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
}

export type ResponseLpDTO = CursorBasedResponse<{
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tags[];
        likes: Likes[];
    };
}>;

export type ResponseLpDetailDTO = CursorBasedResponse<{
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        author?: ResponseMyInfoDto;
    };
    tags: Tags[];
    likes: Likes[];
}>;