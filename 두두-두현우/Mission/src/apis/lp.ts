import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";

export interface LpTag {
  id: number;
  name: string;
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
  likes: unknown[];
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
