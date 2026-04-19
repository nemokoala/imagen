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
- **AI 모델**: DALL-E 3, Google Imagen (Gemini), Stable Diffusion XL, Nano Banana, Z-Image
- **Notifications**: Firebase Cloud Messaging (FCM) + Web Push
- **Logging**: Discord Webhook (일반/에러 채널 분리)
