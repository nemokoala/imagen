module.exports = {
  apps: [
    {
      name: "imagen-app",
      cwd: "/home/koala/imagen",
      script: "node",
      args: ".next/standalone/server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
