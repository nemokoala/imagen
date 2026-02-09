module.exports = {
  apps: [
    {
      name: "imagen-app",
      cwd: "/home/koala/actions-runner/_work/imagen/imagen",
      script: ".next/standalone/server.js",
      instances: 2,
      exec_mode: "cluster",
      env_file: "/home/koala/.env.next",
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
