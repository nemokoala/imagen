import { User } from "@/types/user.interfaces";

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
  email: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
  email: string;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
}
