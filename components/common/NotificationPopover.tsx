"use client";

import { useGetNotificationsQuery } from "@/queries/notification/queries";
import {
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/queries/notification/mutations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, BellPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ProfileAvatar } from "../auth/ProfileAvatar";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/providers/NotificationProvider";
import { toast } from "sonner";

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useGetNotificationsQuery();
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation();
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { requestPermission, checkPermission, notificationContent } =
    useNotification();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleRequestPermission = async () => {
    try {
      const permission = checkPermission();
      if (permission === "default") {
        try {
          await requestPermission();
          // 권한 요청 후 다시 확인
          const newPermission = checkPermission();
          if (newPermission === "granted") {
            toast.success("웹 푸시 알림이 활성화되었습니다!");
          } else {
            toast.error("웹 푸시 권한이 거부되었습니다.");
          }
        } catch {
          toast.error("웹 푸시 권한 요청 중 오류가 발생했습니다.");
        }
        return;
      }

      if (permission === "granted") {
        await requestPermission();
        toast.success("이미 웹 푸시 권한이 활성화되었습니다.");
        return;
      }

      if (permission === "denied") {
        toast.error("웹 푸시 권한을 브라우저 설정에서 활성화해주세요.");
        return;
      }
      toast.error("웹 푸시 권한을 확인할 수 없습니다.");
      return;
    } catch {
      toast.error("웹 푸시 권한 확인 중 오류가 발생했습니다.");
      return;
    }
  };

  // fcm 알림 수신 시 알림 목록 갱신
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [notificationContent, queryClient]);

  // 알림 목록 갱신
  useEffect(() => {
    if (open) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  }, [open, queryClient]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold flex items-center justify-center min-w-[1.25rem]">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mt-2 mr-5 md:mr-12">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-semibold text-sm">알림</h4>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="웹 푸시"
                onClick={handleRequestPermission}
              >
                <BellPlus className="h-3.5 w-3.5" />
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
                  className={`relative group border-b last:border-0 transition-all flex items-center hover:bg-accent/80 ${
                    !notification.isRead ? "bg-accent/10" : "opacity-60 "
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
                          <span className="font-semibold">
                            {notification.message.split("님")[0]}
                          </span>
                          님이{" "}
                          {notification.message.split("님").slice(1).join("님")}
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
                  {/* <Button
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
                  </Button> */}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
