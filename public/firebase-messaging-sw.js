// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js",
);

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  // 대기 중인 새 서비스 워커를 즉시 활성화 (기존 것 대체)
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  // 활성화 즉시 모든 클라이언트(탭) 제어권 가져오기
  event.waitUntil(self.clients.claim());
});

const firebaseConfig = {
  apiKey: "AIzaSyAG0kM8PWS3M--sAIUzsMPh5ErRpuK3A7Q",
  authDomain: "imagegen-36630.firebaseapp.com",
  projectId: "imagegen-36630",
  storageBucket: "imagegen-36630.firebasestorage.app",
  messagingSenderId: "166592458002",
  appId: "1:166592458002:web:45e7ff88b9d39a2a7bd7cb",
  measurementId: "G-JMT31V6FB1",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 리스너
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = "background" + payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/icon.png", // public 폴더 내 아이콘 경로
    data: payload.data, // 클릭 이벤트에서 사용할 데이터 전달
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.", event);
  event.notification.close();

  const link = event.notification.data?.link;
  if (link) {
    event.waitUntil(clients.openWindow(link));
  }
});
