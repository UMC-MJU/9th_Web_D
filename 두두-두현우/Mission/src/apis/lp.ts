import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";

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

export const fetchLpList = async (
  params: LpListParams = {}
): Promise<LpListResponse> => {
  const { cursor = 0, limit = 10, search, order = "asc", signal } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("cursor", cursor.toString());
  searchParams.set("limit", limit.toString());
  searchParams.set("order", order);
  if (search) {
    searchParams.set("search", search);
  }

  const { data } = await axiosInstance.get<LpListResponse>(
    `${API_ENDPOINTS.LP.LIST}?${searchParams.toString()}`,
    {
      signal,
    }
  );

  return data;
};

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

export const fetchLpDetail = async (
  id: number | string,
  options?: { signal?: AbortSignal }
): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.get<LpDetailResponse>(
    API_ENDPOINTS.LP.DETAIL(id),
    {
      signal: options?.signal,
    }
  );

  return data;
};

export const fetchLpComments = async (
  id: number | string,
  params: LpCommentsParams = {}
): Promise<LpCommentListResponse> => {
  const { cursor = 0, limit = 10, order = "asc", signal } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("cursor", cursor.toString());
  searchParams.set("limit", limit.toString());
  searchParams.set("order", order);

  const { data } = await axiosInstance.get<LpCommentListResponse>(
    `${API_ENDPOINTS.LP.COMMENTS(id)}?${searchParams.toString()}`,
    {
      signal,
    }
  );

  return data;
};

export const createLpComment = async (
  id: number | string,
  body: CreateLpCommentRequest
): Promise<LpComment> => {
  const { data } = await axiosInstance.post<CreateLpCommentResponse>(
    API_ENDPOINTS.LP.COMMENTS(id),
    body
  );

  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: LpComment }).data;
  }

  return data as LpComment;
};
