module.exports = {
  apps: [
    {
      name: "imagen-app",
      cwd: process.env.APP_CWD || "/home/koala/imagen", // ← 기본값은 유지 (fallback)
      script: "node",
      instances: "2",
      exec_mode: "cluster",
      kill_timeout: 3000,
      args: ".next/standalone/server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
        UPLOAD_PATH: process.env.UPLOAD_PATH || `${process.env.HOME}/uploads`,
      },
    },
  ],
};
