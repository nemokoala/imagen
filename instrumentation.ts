export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  // 같은 DB를 쓰는 프로세스가 여럿이면 하나만 켠다.
  if (process.env.IMAGE_JOB_WORKER_ENABLED === "false") return;

  const { imageJobWorker } = await import(
    "@/lib/services/image/jobs/imageJobWorker"
  );
  imageJobWorker.start();
}
