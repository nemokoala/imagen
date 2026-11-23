export interface Notification {
  id: number;
  userId: number;
  /** 생성 완료·실패 같은 시스템 알림은 행위자가 없다. */
  actor: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  } | null;
  type: "LIKE" | "COMMENT" | "GENERATION_DONE" | "GENERATION_FAILED";
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
