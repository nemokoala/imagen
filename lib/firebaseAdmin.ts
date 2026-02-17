import * as admin from "firebase-admin";

export const initFirebaseAdmin = () => {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.error(
        "❌ Firebase Admin 초기화 실패: 필수 환경 변수가 누락되었습니다.",
        {
          projectId: !!projectId,
          clientEmail: !!clientEmail,
          privateKey: !!privateKey,
        },
      );
    } else {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
        console.log("✅ Firebase Admin initialized successfully");
      } catch (error) {
        console.error("❌ Firebase admin initialization error", error);
      }
    }
  }
  return admin;
};

// 사이드 이펙트로 초기화 시도 (기존 호환성 유지)
initFirebaseAdmin();

export default admin;
