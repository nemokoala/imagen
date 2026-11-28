import { NextResponse } from "next/server";
import { LOCAL_MODELS, type LocalModel } from "@/constants/model.constants";
import { checkLocalModelHealth } from "@/lib/services/image/jobs/localHealth";
import type { LocalModelHealthResponse } from "@/types/common.interfaces";

export const runtime = "nodejs";

// 생성 화면을 연 사용자마다 AI 서버를 두드리지 않도록, 워커와 같은 캐시를 짧게 재사용한다.
const HEALTH_CACHE_MS = 10_000;

// 공개 API - 로컬 모델(집 AI 서버)의 켜짐 여부를 한 번에 돌려준다 (인증 불필요).
// 서버가 꺼져 있는 것은 정상 상태이므로 항상 200으로 응답한다.
export async function GET() {
  const entries = await Promise.all(
    LOCAL_MODELS.map(
      async (model) =>
        [model, await checkLocalModelHealth(model, HEALTH_CACHE_MS)] as const,
    ),
  );

  const body: LocalModelHealthResponse = {
    models: Object.fromEntries(entries) as Record<LocalModel, boolean>,
  };
  return NextResponse.json(body);
}
