import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";
import {
  type Lp,
  type LpListParams,
  type LpListResponse,
  type LpDetailResponse,
  type LpCommentsParams,
  type LpCommentListResponse,
  type CreateLpCommentRequest,
  type CreateLpCommentResponse,
  type LpComment,
  type CreateLpRequest,
  type CreateLpResponse,
} from "../types/lp";

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

export const createLp = async (body: CreateLpRequest): Promise<Lp> => {
  const { data } = await axiosInstance.post<CreateLpResponse>(
    API_ENDPOINTS.LP.LIST,
    body
  );

  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: Lp }).data;
  }

  return data as Lp;
};

// ---------------- LP 삭제 ----------------
type DeleteLpResponse =
  | { status: boolean; statusCode: number; message: string; data: boolean }
  | boolean;

export const deleteLp = async (id: number | string): Promise<boolean> => {
  const { data } = await axiosInstance.delete<DeleteLpResponse>(
    API_ENDPOINTS.LP.DETAIL(id)
  );

  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: boolean }).data;
  }
  return data as boolean;
};

// ---------------- LP 좋아요 추가/취소 ----------------
type LikeEntity = { id: number; userId: number; lpId: number };
type LikeApiResponse =
  | { status: boolean; statusCode: number; message: string; data: LikeEntity }
  | LikeEntity;

export const addLpLike = async (id: number | string): Promise<LikeEntity> => {
  const { data } = await axiosInstance.post<LikeApiResponse>(
    API_ENDPOINTS.LP.LIKES(id),
    {}
  );
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: LikeEntity }).data;
  }
  return data as LikeEntity;
};

export const removeLpLike = async (
  id: number | string
): Promise<LikeEntity> => {
  const { data } = await axiosInstance.delete<LikeApiResponse>(
    API_ENDPOINTS.LP.LIKES(id)
  );
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: LikeEntity }).data;
  }
  return data as LikeEntity;
};
