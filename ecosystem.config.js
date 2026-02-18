module.exports = {
  apps: [
    {
      name: "imagen-app",
      // 🔸 심볼릭 링크 경로: 빌드 디렉토리와 분리하여 배포 중 다운타임 제거
      // $HOME/imagen-app → $HOME/imagen-builds/<timestamp> (최신 빌드)
      cwd: "/home/koala/imagen-app",
      script: "server.js",
      instances: 2,
      exec_mode: "cluster",
      env_file: "/home/koala/.env.next",
      kill_timeout: 3000,
      wait_ready: true,
    },
  ],
};
