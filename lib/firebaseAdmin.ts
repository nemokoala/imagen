import * as admin from "firebase-admin";

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
        privateKey: !!privateKey, // 보안상 값은 출력하지 않고 유무만 확인
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

export default admin;
