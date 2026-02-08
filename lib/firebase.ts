// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG0kM8PWS3M--sAIUzsMPh5ErRpuK3A7Q",
  authDomain: "imagegen-36630.firebaseapp.com",
  projectId: "imagegen-36630",
  storageBucket: "imagegen-36630.firebasestorage.app",
  messagingSenderId: "166592458002",
  appId: "1:166592458002:web:45e7ff88b9d39a2a7bd7cb",
  measurementId: "G-JMT31V6FB1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export { app, analytics, messaging };
