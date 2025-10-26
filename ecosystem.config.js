module.exports = {
  apps: [
    {
      name: "imagen-app",
      cwd: process.env.APP_CWD || "/home/koala/imagen", // ← 기본값은 유지 (fallback)
      script: "node",
      args: ".next/standalone/server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
