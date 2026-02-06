export interface Notification {
  id: number;
  userId: number;
  actor: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  type: "LIKE" | "COMMENT";
  message: string;
  isRead: boolean;
  image?: {
    id: number;
    imageUrl: string;
  };
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
