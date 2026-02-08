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
import { useUserStore } from "@/stores/userStore";
import { FetchUtil } from "@/lib/Fetch.util";

interface NotificationContextType {
  fcmToken: string | null;
  permission: NotificationPermission;
  requestPermission: () => Promise<void>;
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
  const { user } = useUserStore();

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
            registration = await navigator.serviceWorker.register(
              "/firebase-messaging-sw.js",
            );
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
    }
  }, []);

  useEffect(() => {
    if (user) {
      requestPermission();
    }
  }, [user]);

  useEffect(() => {
    if (fcmToken) {
      FetchUtil.post("/api/fcm", {
        token: fcmToken,
      });
    }
  }, [fcmToken]);

  useEffect(() => {
    if (typeof window !== "undefined" && messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground Message received. ", payload);

        // 탭이 활성화되어 있지 않을 때(다른 탭을 보고 있을 때)는 중복 알림 방지
        // 서비스 워커가 백그라운드 메시지를 처리함
        if (document.visibilityState === "hidden") {
          console.log("App is hidden, skipping foreground notification");
          return;
        }

        const { title, body, icon } = payload.data || {};
        if (title) {
          const notification = new Notification("foreground" + title, {
            body,
            icon: icon || "/icon.png",
          });

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
  }, [router]);

  return (
    <NotificationContext.Provider
      value={{ fcmToken, permission, requestPermission }}
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
