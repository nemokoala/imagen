export interface User {
  id: number;
  email: string;
  credits: number;
  profileImageUrl: string | null;
  nickname: string;
  role?: "user" | "admin";
  provider?: "local" | "kakao";
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: number;
  profileImageUrl: string | null;
  nickname: string;
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
