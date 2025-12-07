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

export interface AdminUser {
  id: number;
  email: string;
  nickname: string;
  credits: number;
  role: "user" | "admin";
  provider: "local" | "kakao";
  createdAt: string;
  updatedAt: string;
  profileImageUrl: string | null;
}

export interface UsersListResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
