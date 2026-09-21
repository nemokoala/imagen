# AGENTS.md — ImageGen Project

AI 이미지 생성 플랫폼. 다중 AI 모델 지원, 소셜 기능(좋아요/댓글), 크레딧 기반 사용량 관리, 실시간 알림, 관리자 대시보드를 포함한다.

---

## 기술 스택

- **Framework**: Next.js (App Router), React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion
- **DB**: MySQL + Prisma ORM (client at `lib/generated/prisma`)
- **State**: Zustand (클라이언트), TanStack Query v5 (서버 상태)
- **Auth**: JWT (HTTP-only 쿠키) + Kakao OAuth2
- **AI 모델**: DALL-E 3, Google Imagen (Gemini), Stable Diffusion XL, Nano Banana, Z-Image, Qwen Image 2.1
- **Notifications**: Firebase Cloud Messaging (FCM) + Web Push
- **Logging**: Discord Webhook (일반/에러 채널 분리)

## JEV 카테고리 추천

- `app/api/categories/suggest/route.ts` → `lib/services/category/categoryService.ts` → `lib/services/category/jevCategoryService.ts` 순서로 처리한다.
- 카테고리는 DB에서 동적으로 읽는다. JEV의 `noul` 질문으로 각 카테고리를 독립적으로 평가하고, `MATCH_THRESHOLD = 0.5` 이상 중 점수가 높은 최대 3개를 추천한다. 따라서 결과는 0~3개일 수 있다.
- 관리자 `categoryEnabled`가 꺼져 있으면 추천하지 않는다. `TYPESAFE_API_KEY`가 없거나 JEV 호출이 실패하면 기존 Gemini/Ollama 추천으로 전환한다. 이미지 생성용 프롬프트 변환은 기존 LLM 설정을 사용한다.
- 선정성 필터 스위치와 카테고리 추천은 독립적이다. 필터가 꺼져 있어도 카테고리 추천이 켜져 있으면 JEV 카테고리 호출이 발생할 수 있다.

## 선정성 프롬프트 필터

- 관리자 **LLM 모델 설정 → 선정성 프롬프트 필터**가 `LlmSettings.sexualContentFilterEnabled`를 변경한다. Prisma 기본값은 `false`다.
- `lib/services/image/promptSafetyService.ts`에서 생성·편집 요청의 원문 프롬프트를 검사한다. `noul` 값이 `SEXUAL_CONTENT_THRESHOLD = 0.7` 이상이면 생성 전에 차단한다. JEV 키 누락·타임아웃·오류가 발생하면 대상 모델의 요청을 503으로 중단한다.
- 검사 대상은 `constants/model.constants.ts`의 `NSFW_CAPABLE_MODELS`에만 둔다. 현재는 `Model.QWEN_IMAGE_21` 하나이며 Qwen 생성과 Qwen 편집에서 검사한다. 다른 모델은 필터 설정 DB 조회와 선정성 JEV 호출을 모두 생략한다. NSFW 생성 가능 모델이 추가되면 이 목록을 함께 갱신한다.
- 필터는 입력 텍스트 검사다. 생성 이미지 자체의 내용까지 검증했다고 간주하지 않는다.

## 환경 및 검증

- TypeSafe 키는 서버 전용 `TYPESAFE_API_KEY`를 사용한다. 로컬은 `.env.local`, 배포 서버는 워크플로가 읽는 `~/.env.next`에 설정하며 키 값을 로그·문서·응답에 남기지 않는다.
- Prisma 스키마를 바꾸면 마이그레이션과 `lib/generated/prisma` 클라이언트를 함께 갱신한다. Windows에서 `prisma generate`가 엔진 DLL 교체 오류를 내면 개발 서버를 종료한 뒤 재실행하고, 마이그레이션 상태와 새 컬럼 조회를 확인한다.
- 정적 검사(`npx tsc --noEmit`, ESLint, Prisma 스키마/마이그레이션 확인)와 실제 JEV API 호출, 관리자 화면·이미지 생성 흐름 검증은 각각 별개의 결과로 보고한다.
