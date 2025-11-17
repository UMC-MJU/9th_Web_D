import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";

type UploadApiResponse =
  | {
      status: boolean;
      statusCode: number;
      message: string;
      data: { imageUrl: string };
    }
  | { imageUrl: string };

export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  // Swagger 상 필드명: file
  form.append("file", file);

  try {
    const { data } = await axiosInstance.post<UploadApiResponse>(
      API_ENDPOINTS.UPLOAD.FILE,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (typeof data === "object" && data !== null && "data" in data) {
      return (data as { data: { imageUrl: string } }).data.imageUrl;
    }
    return (data as { imageUrl: string }).imageUrl;
  } catch {
    // 인증 문제가 있을 수 있어 public 엔드포인트로 재시도
    const { data } = await axiosInstance.post<UploadApiResponse>(
      API_ENDPOINTS.UPLOAD.PUBLIC_FILE,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (typeof data === "object" && data !== null && "data" in data) {
      return (data as { data: { imageUrl: string } }).data.imageUrl;
    }
    return (data as { imageUrl: string }).imageUrl;
  }
};
