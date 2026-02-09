"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { FetchUtil } from "@/lib/Fetch.util";

interface NotificationContextType {
  fcmToken: string | null;
  permission: NotificationPermission;
  requestPermission: () => Promise<void>;
  checkPermission: () => NotificationPermission | null;
  notificationContent: { title: string; body: string } | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [notificationContent, setNotificationContent] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const checkPermission = useCallback((): NotificationPermission | null => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return null;
    }

    const currentPermission = Notification.permission;
    setPermission(currentPermission);
    console.log("checkPermission", currentPermission);
    return currentPermission;
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
      }

      console.log("requestPermission");

      const permissionStatus = await Notification.requestPermission();
      console.log("permissionStatus", permissionStatus);
      setPermission(permissionStatus);

      if (permissionStatus === "granted") {
        if (!messaging) {
          console.error("Messaging is not initialized");
          return;
        }

        // Register service worker if not already registered
        let registration;
        if ("serviceWorker" in navigator) {
          try {
            await navigator.serviceWorker.register("/firebase-messaging-sw.js");
            // 등록 직후 즉시 사용 가능한 상태(Active)가 될 때까지 대기
            registration = await navigator.serviceWorker.ready;

            console.log(
              "Service Worker registered with scope:",
              registration.scope,
            );
          } catch (err) {
            console.error("Service Worker registration failed:", err);
            return;
          }
        }

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log("FCM Token:", token);
          setFcmToken(token);
          // TODO: Send token to server to save it (e.g. via API)
        } else {
          console.log(
            "No registration token available. Request permission to generate one.",
          );
        }
      } else {
        console.log("Notification permission denied");
      }
    } catch (error) {
      console.log("An error occurred while retrieving token. ", error);
    }
  }, []);

  useEffect(() => {
    // Initial permission state check
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      requestPermission();
    }
  }, []);

  useEffect(() => {
    if (fcmToken) {
      FetchUtil.post("/api/fcm", {
        token: fcmToken,
      });
    }
  }, [fcmToken]);

  useEffect(() => {
    // fcmToken이 생성된 후에만 포그라운드 메시지 리스너 등록
    if (typeof window !== "undefined" && messaging && fcmToken) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground Message received. ", payload);

        const { title, body, icon } = payload.data || {};
        if (title) {
          const notification = new Notification("foreground" + title, {
            body,
            icon: icon || "/icon.png",
          });
          setNotificationContent({ title, body });
          notification.onclick = (event) => {
            event.preventDefault(); // 브라우저가 알림 탭을 포커스하는 기본 동작 방지
            const link = payload.data?.link;
            if (link) {
              router.push(link);
            }
          };
        }
      });
      return () => unsubscribe();
    }
  }, [router, fcmToken]);

  return (
    <NotificationContext.Provider
      value={{
        fcmToken,
        permission,
        requestPermission,
        checkPermission,
        notificationContent,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
