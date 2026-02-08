module.exports = {
  apps: [
    {
      name: "imagen-app",
      cwd: process.env.APP_CWD || "/home/koala/imagen", // ← 기본값은 유지 (fallback)
      script: ".next/standalone/server.js",
      instances: "max",
      exec_mode: "cluster",
      kill_timeout: 3000,
      wait_ready: true,
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
        UPLOAD_PATH: process.env.UPLOAD_PATH || `${process.env.HOME}/uploads`,
      },
    },
  ],
};
