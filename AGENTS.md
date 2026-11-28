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

## 작업 규칙

### 커밋

- 커밋 메시지는 **한국어**로 쓴다. 제목은 `<type>: <요약>` 한 줄이고 끝에 마침표를 찍지 않는다.
  - `type`은 `feat`(기능), `fix`(버그), `refactor`(동작 그대로 구조 변경), `chore`(설정·의존성·생성물), `docs`(문서), `test`(테스트) 중 하나다.
  - 예: `feat: 프로필에 생성 요청 기록 탭 추가`, `fix: 액세스 토큰 만료 시 쇼케이스 좋아요 상태가 꺼져 보이는 문제 수정`
- 설명이 필요하면 제목 다음 빈 줄 뒤에 본문을 한국어로 쓴다. 무엇을 바꿨는지보다 **왜** 바꿨는지를 남기고, 목록은 `- `로 쓴다.
- 한 커밋에는 한 가지 변경만 담는다. 작업 트리에 사용자가 하던 다른 변경이 있으면 `git add <경로>`로 내 변경만 담는다.
- Prisma 스키마를 바꾼 커밋에는 마이그레이션 폴더와 `lib/generated/prisma`를 함께 넣는다(생성된 클라이언트도 git이 추적한다).
- 이미 푸시한 커밋은 다시 쓰지 않는다. amend·rebase·강제 푸시는 푸시 전 내 커밋에만 쓴다.

### 푸시와 배포

- `main`에 푸시하면 `.github/workflows/deploy.yml`이 곧바로 운영에 배포하고 `prisma migrate deploy`까지 실행한다. 커밋·푸시는 요청받았을 때만 하고, 푸시하면 운영에 나간다는 점을 먼저 알린다.
- `main`에 강제 푸시하지 않는다.
- 운영 DB와 운영 서버에는 직접 손대지 않는다. 스키마 변경은 마이그레이션 파일로만 내보낸다.

## 코드 구조와 관례

- **API 라우트**(`app/api/**/route.ts`)는 얇게 둔다. `export const runtime = "nodejs"`를 두고, 인증은 `authService.getUserIdFromCookie(await cookies())`, 관리자 API는 `checkAdminRole()`(`lib/server-utils.ts`)로 한다. 실패는 `throw new ApiError(메시지, 상태, 코드)`로 던지고 `catch`에서 `errorHandler(error)`를 돌려준다.
- **비즈니스 로직**은 `lib/services/<도메인>/<이름>Service.ts`에 객체 리터럴(`export const xService = { ... }`)로 둔다.
- **클라이언트 데이터**는 `queries/<도메인>/`의 TanStack Query 훅으로 가져온다. 요청은 `FetchUtil`(`lib/Fetch.util.ts`, 401이면 토큰을 갱신해 한 번 재시도)을 쓴다.
- 타입은 `types/*.interfaces.ts`, 상수는 `constants/*.constants.ts`에 둔다. 로컬 모델인지는 `isLocalModel()`·`LOCAL_MODELS`(`constants/model.constants.ts`)로 판별하고, 모델 비교를 여러 곳에 늘어놓지 않는다.
- 사용자에게 보이는 문구·에러 메시지와 코드 주석은 한국어로 쓴다. 주석에는 코드가 왜 그렇게 생겼는지를 적는다.
- `next.config.ts`에서 `reactCompiler: true`다. `react-hooks` 규칙을 `eslint-disable`로 끄지 않는다. 끄면 컴파일러가 그 컴포넌트를 최적화하지 않는다. 의존성 경고는 `useCallback` 등으로 맞춘다.
- 크레딧을 차감할 때는 잔액 확인과 차감을 한 문장으로 한다(`user.updateMany({ where: { id, credits: { gte: cost } }, data: { credits: { decrement: cost } } })`, `count === 0`이면 부족). 먼저 조회하고 나중에 깎으면 동시 요청에서 잔액이 음수가 될 수 있다.

## DB와 마이그레이션

- 스키마를 바꾸면 `prisma/migrations/<YYYYMMDDHHMMSS>_<설명>/migration.sql`을 만든다. SQL은 `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`로 뽑을 수 있다.
- 로컬 Windows MySQL은 테이블명을 소문자(`notification`)로 보고하지만 운영 Linux MySQL은 대소문자를 구분한다. 뽑은 SQL의 테이블명을 Prisma 모델명(`Notification`, `ImageJob` 등)과 똑같이 고친 뒤 커밋한다.
- 로컬 적용은 `npx prisma migrate deploy` 다음 `npx prisma generate`다. Windows에서 `prisma generate`가 엔진 DLL 교체 오류를 내면 개발 서버를 종료한 뒤 다시 실행하고, 마이그레이션 상태와 새 컬럼 조회를 확인한다. 버전이 같으면 엔진은 바뀌지 않으므로 남은 `.tmp` 파일만 지워도 된다.

## 로컬 모델 생성 대기열

- 집 AI 서버(ComfyUI: Z-Image·Qwen, A1111: Stable Diffusion XL)는 늘 켜져 있지 않다. 로컬 모델의 생성(`POST /api/generate-image`)과 Qwen 편집(`POST /api/edit-image`)은 모두 `ImageJob` 테이블에 접수하고(202, `kind`가 `GENERATE`·`EDIT`), 워커가 서버가 켜지면 `id` 순서대로 한 건씩 처리한다. 워커 하나가 직렬로 돌기 때문에 GPU를 동시에 쓰지 않는다.
- 코드는 `lib/services/image/jobs/`에 있다.
  - `imageJobService`: 접수·조회·취소·환불
  - `imageJobWorker`: 처리 루프. `instrumentation.ts`에서 시작한다.
  - `localRunners`: 모델별 실행
  - `comfyClient`: ComfyUI 제출과 결과 대기
  - `localServer`: 에러 분류와 `localFetch`
  - `localHealth`: 서버 상태 캐시
  - `jobInputs`: 편집 입력 이미지 저장·읽기·삭제
- 크레딧은 접수할 때 먼저 차감하고, 실패·취소·만료 때 상태 변경과 같은 트랜잭션에서 돌려준다. 로컬 모델 경로에서 `updateUserCredit`을 다시 부르지 않는다.
- AI 서버 호출은 `localFetch`·`readLocalJson`·`readLocalBuffer`로 한다.
  - 서버에 닿지 않으면 `LocalServerUnavailableError`다. 작업을 대기열로 되돌린다.
  - 서버가 거절하거나 생성에 실패하면 `GenerationFailedError`다. 실패로 끝내고 환불하며, 메시지는 사용자에게 그대로 보인다.
- ComfyUI `prompt_id`는 `externalId`에 저장해 두고, 재시작 뒤에는 다시 제출하지 않고 이어서 기다린다. 작업 완료는 가져갈 때 늘린 `attempts`(펜싱 토큰)가 그대로일 때만 기록된다.
- 워커는 프로세스 하나에서만 돈다는 전제다(PM2 fork 1개). 같은 DB를 보는 프로세스가 더 있으면 하나만 남기고 나머지는 `IMAGE_JOB_WORKER_ENABLED=false`로 끈다.
- 실패·취소·만료 기록은 지우지 않는다. 별도 크레딧 거래 테이블이 없어서 환불했다는 근거가 이 기록뿐이다.
- 편집 입력(원본·참고·마스크)은 접수할 때 `UPLOAD_PATH/job-inputs/<uuid>/`에 저장하고 `ImageJob.inputs`에 파일 이름만 둔다. 배포 때 앱 폴더가 바뀌므로 생성 이미지와 같은 `UPLOAD_PATH` 아래에 둔다.
  - 작업이 끝나면(완성·실패·취소·만료) 입력 파일을 지운다. 대기열로 되돌릴 때는 남긴다. 지우지 못하고 남은 폴더는 워커가 한 시간마다 정리한다.
  - `ImageJob.model`은 `Qwen-Image-2.1` 그대로 둔다. 갤러리에 저장하는 이미지 모델명만 `Qwen-Image-2.1-Edit`다. 작업 모델을 바꾸면 헬스체크·크레딧·모델 켜짐 확인이 모두 빗나간다.
  - 지시문 번역과 ComfyUI 업로드는 AI 서버가 켜져 있어야 하므로 실행할 때 한다. `<imageN>` 슬롯 검증처럼 사용자가 고칠 수 있는 오류는 접수할 때 막는다.
- `/api/uploads/[...path]`는 `images/`·`profiles/` 안의 파일만 내보낸다. 새 공개 폴더가 필요하면 `SERVED_DIRS`에 추가하고, 내부용 파일은 그 밖에 둔다.
- 환경 변수(모두 선택)는 다음과 같다.

| 변수 | 기본값 |
|---|---|
| `IMAGE_JOB_TTL_HOURS` | 72 |
| `IMAGE_JOB_MAX_PER_USER` | 5 |
| `IMAGE_JOB_MAX_TOTAL` | 100 |
| `IMAGE_JOB_MAX_ATTEMPTS` | 3 |
| `COMFY_JOB_MAX_WAIT_MS` | 30분 |
| `IMAGE_JOB_WORKER_ENABLED` | 켜짐(`false`로 끔) |

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

## 환경과 비밀 값

- 로컬은 `.env.local`, 배포 서버는 워크플로가 읽는 `~/.env.next`에 설정한다. TypeSafe 키는 서버 전용 `TYPESAFE_API_KEY`를 쓴다.
- 키·토큰·비밀번호 값을 로그·문서·커밋·응답에 남기지 않는다.

## 테스트와 검증

- 정적 검사(`npx tsc --noEmit`, ESLint, Prisma 스키마/마이그레이션 확인)와 실제 외부 API 호출, 화면·이미지 생성 흐름 검증은 각각 별개의 결과로 보고한다. 돌리지 못한 검증은 돌리지 못했다고 적는다.
- 이 개발 PC는 AI 서버를 겸한다. `npm run local-dev`도 워커를 돌리고 `.env.local`의 `COMFYUI_URL`은 실제 ComfyUI를 가리킨다. 로컬 `imagen` DB에 PENDING 작업을 넣으면 실제 GPU로 생성된다. 대기열 테스트는 별도 DB(예: `imagen_e2e`를 `prisma migrate deploy`로 만들고 끝나면 DROP)와 가짜 ComfyUI로 한다.
- 테스트 데이터로 외부 호출(Discord 웹훅, JEV, Gemini·OpenAI, FCM)이 나가지 않게, 테스트 프로세스에서는 해당 환경 변수를 비운다.
- 브라우저로 확인할 때 `localhost` 쿠키는 포트와 상관없이 개발 서버 세션과 공유된다. 테스트 계정은 `127.0.0.1`처럼 다른 호스트로 로그인한다.
- 테스트로 만든 계정·DB 행·업로드 파일은 끝나면 지운다.
