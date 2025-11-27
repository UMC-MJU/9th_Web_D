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
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
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


export type ResponseLikes = {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
      id: number;
      userId: number;
      lpId: number;
    };
  }

  export type CreateLpParams = {
    title: string,
    content: string,
    thumbnail: string | null,
    tags: string[],
}  
  
export type FixLpParams = {
    lpId: number,
    title: string,
    content: string,
    thumbnail: string | null,
    tags: string[],
}  

export type CreateLpBody = {
    title: string,
    content: string,
    thumbnail: string | null,
    tags: string[],
    published: true
}  

export type CreateLpResponse = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
}

export type DeleteLpResponse = {
    status: boolean,
    statusCode: number,
    message: string,
    data: boolean
  }