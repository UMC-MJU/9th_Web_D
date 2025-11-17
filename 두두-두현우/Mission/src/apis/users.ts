import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";
import type {
  MeResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "../types/user";

export const fetchMe = async (): Promise<MeResponse["data"]> => {
  const { data } = await axiosInstance.get<MeResponse>(API_ENDPOINTS.USER.ME);
  return data.data ?? (data as unknown as MeResponse["data"]);
};

export const updateUser = async (
  body: UpdateUserRequest
): Promise<MeResponse["data"]> => {
  const { data } = await axiosInstance.patch<UpdateUserResponse>(
    API_ENDPOINTS.USER.UPDATE,
    body
  );
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: MeResponse["data"] }).data;
  }
  return data as MeResponse["data"];
};
