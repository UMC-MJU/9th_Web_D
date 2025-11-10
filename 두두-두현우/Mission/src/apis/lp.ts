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
