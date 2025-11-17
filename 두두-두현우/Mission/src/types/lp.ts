export interface LpTag {
  id: number;
  name: string;
}

export interface LpLike {
  id: number;
  userId: number;
  lpId: number;
}

export interface LpAuthor {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LpCommentAuthor {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LpComment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: LpCommentAuthor;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: LpTag[];
  likes: LpLike[];
  author?: LpAuthor;
}

export interface LpDetail extends Lp {
  author: LpAuthor;
  comments?: LpComment[];
}

export interface LpListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: Lp[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export interface LpListParams {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
  signal?: AbortSignal;
}

export interface LpDetailResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: LpDetail;
}

export interface LpCommentsParams {
  cursor?: number;
  limit?: number;
  order?: "asc" | "desc";
  signal?: AbortSignal;
}

export interface LpCommentListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: LpComment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export interface CreateLpCommentRequest {
  content: string;
}

export type CreateLpCommentResponse =
  | {
      status: boolean;
      statusCode: number;
      message: string;
      data: LpComment;
    }
  | LpComment;

export interface CreateLpRequest {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export type CreateLpResponse =
  | {
      status: boolean;
      statusCode: number;
      message: string;
      data: Lp;
    }
  | Lp;
