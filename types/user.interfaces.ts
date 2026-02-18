import { CommentWithUser } from "@/lib/services/image/commentService";

export interface UserCommentsResponse {
  success: boolean;
  comments: CommentWithUser[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  credits: number;
  role: "user" | "admin";
  provider: "local" | "kakao";
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
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
