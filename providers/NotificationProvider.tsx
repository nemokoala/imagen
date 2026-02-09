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

  // Service Worker를 가져오거나 등록하는 헬퍼 함수
  const getServiceWorkerRegistration = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      return null;
    }

    try {
      // 이미 등록된 Service Worker가 있는지 확인
      const existingRegistration =
        await navigator.serviceWorker.getRegistration(
          "/firebase-messaging-sw.js",
        );

      if (existingRegistration) {
        console.log(
          "Existing Service Worker found with scope:",
          existingRegistration.scope,
        );
        // Service Worker가 활성화될 때까지 대기
        await existingRegistration.update();
        return existingRegistration;
      }

      // 등록된 Service Worker가 없으면 새로 등록
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
      // 등록 직후 즉시 사용 가능한 상태(Active)가 될 때까지 대기
      await navigator.serviceWorker.ready;

      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    } catch (err) {
      console.error("Service Worker registration failed:", err);
      return null;
    }
  }, []);

  // 권한이 granted일 때 토큰을 가져오는 함수
  const getFCMToken = useCallback(async () => {
    if (!messaging) {
      console.error("Messaging is not initialized");
      return;
    }

    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      console.error("Service Worker registration is not available");
      return;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log("FCM Token:", token);

        setFcmToken(token);
        await FetchUtil.post("/api/fcm", {
          token: token,
        });
      } else {
        console.log(
          "No registration token available. Request permission to generate one.",
        );
      }
    } catch (error) {
      console.log("An error occurred while retrieving token. ", error);
    }
  }, [getServiceWorkerRegistration]);

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
        await getFCMToken();
      } else {
        console.log("Notification permission denied");
      }
    } catch (error) {
      console.log("An error occurred while retrieving token. ", error);
    }
  }, [getFCMToken]);

  useEffect(() => {
    // Service Worker 업데이트 확인 (페이지 로드 시)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration("/firebase-messaging-sw.js")
        .then((registration) => {
          if (registration) {
            // 업데이트 확인 (새 버전이 있으면 다운로드)
            registration.update();
          }
        })
        .catch((err) => {
          console.log("Service Worker update check failed:", err);
        });
    }
  }, []);

  useEffect(() => {
    // Initial permission state check
    if (typeof window !== "undefined" && "Notification" in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      // 권한이 이미 granted인 경우 토큰을 가져옴
      if (currentPermission === "granted") {
        console.log("Permission already granted, getting FCM token...");
        getFCMToken();
      } else if (currentPermission === "default") {
        // 권한이 아직 요청되지 않은 경우에만 요청
        requestPermission();
      }
    }
  }, [getFCMToken, requestPermission]);

  useEffect(() => {
    // fcmToken이 생성된 후에만 포그라운드 메시지 리스너 등록
    if (typeof window !== "undefined" && messaging && fcmToken) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground Message received. ", payload);

        const { title, body, icon } = payload.data || {};
        if (title) {
          const notification = new Notification(title, {
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
