export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: UserProfile;
}

export interface UpdateUserRequest {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}

export type UpdateUserResponse =
  | {
      status: boolean;
      statusCode: number;
      message: string;
      data: UserProfile;
    }
  | UserProfile;
