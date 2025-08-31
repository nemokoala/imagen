# Menu Moa - AI 이미지 생성 서비스

Next.js와 OpenAI API를 사용한 AI 이미지 생성 웹 애플리케이션입니다.

## 주요 기능

- AI 이미지 생성 (DALL-E 2, DALL-E 3, GPT-4 Vision)
- 사용자별 이미지 관리
- 파일시스템 기반 이미지 저장
- 데이터베이스에 이미지 메타데이터 저장

## 프로젝트 구조

```
menu-moa/
├── app/                          # Next.js App Router
│   ├── api/                     # API 엔드포인트
│   │   ├── auth/               # 인증 관련 API
│   │   ├── generate-image/     # 이미지 생성 API
│   │   └── images/             # 이미지 관리 API
│   ├── (page)/                 # 페이지 컴포넌트
│   │   ├── auth/               # 인증 페이지
│   │   └── image-gen/          # 이미지 생성 페이지
│   └── layout.tsx              # 루트 레이아웃
├── components/                  # 재사용 가능한 컴포넌트
│   ├── ui/                     # UI 컴포넌트 (shadcn/ui)
│   └── layout.tsx              # 레이아웃 컴포넌트
├── lib/                        # 라이브러리 및 유틸리티
│   ├── controllers/            # 컨트롤러 레이어
│   │   ├── authController.ts   # 인증 컨트롤러
│   │   └── imageController.ts  # 이미지 컨트롤러
│   ├── services/               # 서비스 레이어
│   │   ├── auth/               # 인증 서비스
│   │   └── image/              # 이미지 서비스
│   ├── prisma.ts               # Prisma 클라이언트
│   └── utils.ts                # 유틸리티 함수
├── queries/                    # API 쿼리 및 뮤테이션
│   ├── auth/                   # 인증 관련 쿼리
│   └── image/                  # 이미지 관련 쿼리
├── types/                      # TypeScript 타입 정의
│   ├── common.interfaces.ts    # 공통 인터페이스
│   └── image.interfaces.ts     # 이미지 관련 인터페이스
├── prisma/                     # 데이터베이스 스키마
│   └── schema.prisma          # Prisma 스키마
└── public/                     # 정적 파일
    └── uploads/                # 업로드된 이미지
        └── images/             # 사용자별 이미지 저장소
```

## 이미지 생성 아키텍처

### 1. 서비스 레이어 (`lib/services/image/imageService.ts`)

- OpenAI API 호출
- 이미지 파일시스템 저장
- 데이터베이스에 메타데이터 저장

### 2. 컨트롤러 레이어 (`lib/controllers/imageController.ts`)

- HTTP 요청 처리
- 입력 검증
- 서비스 호출 및 응답 처리

### 3. API 엔드포인트

- `POST /api/generate-image`: 이미지 생성
- `GET /api/images/user?userId={id}`: 사용자별 이미지 목록
- `GET /api/images/[id]`: 개별 이미지 조회

### 4. 데이터베이스 스키마

```prisma
model GeneratedImage {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  prompt    String   @db.Text
  imageUrl  String
  model     String
  size      String   @default("1024x1024")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([createdAt])
  @@index([model])
}
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="your_database_connection_string"
OPENAI_API_KEY="your_openai_api_key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. 데이터베이스 마이그레이션

```bash
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## 사용법

### 이미지 생성

```typescript
import { imageMutations } from "@/queries/image/mutations";

const result = await imageMutations.generateImage({
  prompt: "아름다운 풍경화",
  model: "dall-e-3",
  userId: 1,
});
```

### 사용자 이미지 조회

```typescript
import { imageQueries } from "@/queries/image/queries";

const images = await imageQueries.getUserImages(userId);
```

### 개별 이미지 조회

```typescript
const image = await imageQueries.getImageById(imageId);
```

## 주요 특징

1. **계층화된 아키텍처**: 서비스, 컨트롤러, API 레이어로 분리
2. **파일시스템 저장**: 생성된 이미지를 로컬 파일시스템에 저장
3. **메타데이터 관리**: 프롬프트, 모델, 생성 시간 등 상세 정보 저장
4. **사용자별 분리**: 각 사용자의 이미지를 별도 디렉토리에 저장
5. **타입 안전성**: TypeScript를 통한 완전한 타입 정의

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MySQL (Prisma ORM)
- **AI Service**: OpenAI API
- **Authentication**: JWT, bcryptjs
- **State Management**: TanStack Query

## 라이선스

MIT License
