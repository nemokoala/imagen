// ~/.env.next에서 환경 변수 로드
const fs = require("fs");
const path = require("path");
const os = require("os");

// 환경 변수 객체 초기화
const envProduction = {
  NODE_ENV: "production",
  PORT: "3000",
  HOSTNAME: "0.0.0.0",
  UPLOAD_PATH: process.env.UPLOAD_PATH || `${process.env.HOME}/uploads`,
};

// 환경 변수 값 처리 함수 (따옴표 제거 및 이스케이프 시퀀스 처리)
function processEnvValue(value) {
  if (!value) return value;

  // 시작과 끝의 따옴표 제거 (단일 또는 이중 따옴표)
  let cleaned = value.replace(/^["']|["']$/g, "");

  // 이스케이프 시퀀스 처리 (\n을 실제 줄바꿈으로 변환)
  cleaned = cleaned.replace(/\\n/g, "\n");
  cleaned = cleaned.replace(/\\t/g, "\t");
  cleaned = cleaned.replace(/\\r/g, "\r");

  return cleaned;
}

// 환경 변수 포함 여부 확인 함수
function shouldIncludeEnvVar(key) {
  return (
    key.startsWith("FIREBASE_") ||
    key.startsWith("DISCORD_") ||
    key.startsWith("DATABASE_URL") ||
    key === "UPLOAD_PATH" ||
    key.startsWith("OPENAI_") ||
    key.startsWith("GOOGLE_") ||
    key.startsWith("GEMINI_") ||
    key.startsWith("KAKAO_") ||
    key.startsWith("STABLE_DIFFUSION_") ||
    key.startsWith("OLLAMA_") ||
    key.startsWith("COMFYUI_") ||
    key === "JWT_SECRET"
  );
}

// ~/.env.next 파일에서 환경 변수 읽기
const envNextPath = path.join(os.homedir(), ".env.next");
try {
  if (fs.existsSync(envNextPath)) {
    const envContent = fs.readFileSync(envNextPath, "utf8");
    const lines = envContent.split("\n");

    lines.forEach((line) => {
      // 주석과 빈 줄 제외
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const equalIndex = trimmedLine.indexOf("=");
        if (equalIndex > 0) {
          const key = trimmedLine.substring(0, equalIndex).trim();
          const value = trimmedLine.substring(equalIndex + 1).trim();

          // 서버측에서 필요한 환경 변수만 추가
          if (shouldIncludeEnvVar(key)) {
            const cleanValue = processEnvValue(value);
            envProduction[key] = cleanValue;
          }
        }
      }
    });

    // 디버깅: Firebase 환경 변수 로드 확인
    if (envProduction.FIREBASE_PROJECT_ID) {
      console.log("✅ Firebase 환경 변수 로드됨:", {
        projectId: envProduction.FIREBASE_PROJECT_ID,
        clientEmail: envProduction.FIREBASE_CLIENT_EMAIL
          ? "설정됨"
          : "누락",
        privateKey: envProduction.FIREBASE_PRIVATE_KEY
          ? "설정됨"
          : "누락",
      });
    }
  }
} catch (error) {
  console.warn("⚠️  ~/.env.next 파일을 읽는 중 오류 발생:", error.message);
}

module.exports = {
  apps: [
    {
      name: "imagen-app",
      cwd: process.env.APP_CWD || "/home/koala/imagen", // ← 기본값은 유지 (fallback)
      script: "node",
      instances: "max",
      exec_mode: "cluster",
      kill_timeout: 3000,
      wait_ready: true,
      args: ".next/standalone/server.js",
      env_production: envProduction,
    },
  ],
};
