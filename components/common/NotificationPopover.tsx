"use client";

import { useGetNotificationsQuery } from "@/queries/notification/queries";
import {
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "@/queries/notification/mutations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ProfileAvatar } from "../auth/ProfileAvatar";

export function NotificationPopover() {
  const { data } = useGetNotificationsQuery();
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation();
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();
  const { mutate: deleteAllNotifications } =
    useDeleteAllNotificationsMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-0 h-2 w-2 rounded-full bg-primary ring-2 ring-black" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-semibold text-sm">알림</h4>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                title="모두 삭제"
                onClick={() => deleteAllNotifications()}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto py-1 px-2"
                onClick={() => markAllAsRead()}
              >
                모두 읽음
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 h-[300px] text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p>새로운 알림이 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative group border-b last:border-0 transition-all flex items-center hover:bg-accent/50 ${
                    !notification.isRead
                      ? "bg-accent/10"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Link
                    href={`/image/${notification.image?.id}`}
                    className="flex-1 flex items-start gap-3 p-3 transition-colors min-w-0"
                    onClick={() =>
                      !notification.isRead && markAsRead(notification.id)
                    }
                  >
                    <div className="relative h-8 w-8 flex-shrink-0 mr-1">
                      <ProfileAvatar
                        nickname={notification.actor.nickname}
                        profileImageUrl={notification.actor.profileImageUrl}
                        size="small"
                      />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm line-clamp-2 leading-snug">
                        <span className="text-foreground">
                          {notification.message}
                        </span>
                      </p>
                      <span className="text-xs text-muted-foreground block">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                    {notification.image && (
                      <div className="relative h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                        <Image
                          src={notification.image.imageUrl}
                          alt="Target image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 mr-2 flex-shrink-0 text-muted-foreground hover:text-destructive bg-background/50 hover:bg-background"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
