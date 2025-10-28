# 운영 DB 마이그레이션 가이드

## 📋 목차

1. [마이그레이션 개요](#마이그레이션-개요)
2. [사전 준비](#사전-준비)
3. [로컬 환경에서 마이그레이션 생성](#로컬-환경에서-마이그레이션-생성)
4. [운영 환경 배포](#운영-환경-배포)
5. [롤백 방법](#롤백-방법)
6. [체크리스트](#체크리스트)

---

## 마이그레이션 개요

Prisma는 스키마 변경사항을 추적하고 안전하게 데이터베이스에 적용하는 마이그레이션 시스템을 제공합니다.

### 마이그레이션 흐름

```
로컬 개발 → 마이그레이션 생성 → Git 커밋 → 운영 서버 배포 → 마이그레이션 적용
```

---

## 사전 준비

### 1. 백업 (필수)

**운영 DB를 건드리기 전에 반드시 백업을 받으세요!**

```bash
# MySQL 백업
mysqldump -u [사용자명] -p [데이터베이스명] > backup_$(date +%Y%m%d_%H%M%S).sql

# 백업 파일 안전한 곳에 보관
# 예: AWS S3, Google Drive 등
```

### 2. 환경 변수 확인

`.env.development` (로컬)

```env
DATABASE_URL="mysql://user:password@localhost:3306/menu_moa_dev"
```

`.env.production` (운영)

```env
DATABASE_URL="mysql://user:password@production-host:3306/menu_moa"
```

### 3. 현재 마이그레이션 상태 확인

```bash
# 로컬
npx prisma migrate status

# 운영 (서버에 접속해서)
npx prisma migrate status
```

---

## 로컬 환경에서 마이그레이션 생성

### Step 1: 스키마 수정

`prisma/schema.prisma` 파일을 수정합니다.

**예시: 새 필드 추가**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  nickname  String   @unique
  credits   Int      @default(100)

  // 새로 추가할 필드
  phoneNumber String?  // 선택적 필드
  isVerified  Boolean  @default(false)  // 기본값 있는 필드

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profileImageUrl String?
  loginAttempts LoginAttempt[]
  generatedImages GeneratedImage[]
}
```

### Step 2: 마이그레이션 생성

```bash
# 개발 환경에서 마이그레이션 생성
npx prisma migrate dev --name add_user_phone_and_verification

# 또는 환경 파일 명시
env-cmd -f .env.development npx prisma migrate dev --name add_user_phone_and_verification
```

**마이그레이션 이름 규칙:**

- `add_[테이블명]_[필드명]` - 필드 추가
- `remove_[테이블명]_[필드명]` - 필드 제거
- `rename_[테이블명]_[old]_to_[new]` - 이름 변경
- `create_[테이블명]_table` - 테이블 생성
- `alter_[테이블명]_[변경내용]` - 테이블 변경

### Step 3: 생성된 마이그레이션 파일 확인

`prisma/migrations/[타임스탬프]_add_user_phone_and_verification/migration.sql`

```sql
-- AlterTable
ALTER TABLE `User`
  ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
  ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;
```

### Step 4: 로컬에서 테스트

```bash
# Prisma Studio로 확인
npx prisma studio

# 또는 직접 쿼리 테스트
npx prisma db execute --stdin < test_migration.sql
```

### Step 5: Git 커밋

```bash
git add prisma/schema.prisma
git add prisma/migrations/
git commit -m "feat: User 테이블에 phoneNumber, isVerified 필드 추가"
git push origin main
```

---

## 운영 환경 배포

### Step 1: 운영 서버 접속

```bash
ssh user@production-server
cd /path/to/menu-moa
```

### Step 2: 최신 코드 Pull

```bash
git pull origin main
```

### Step 3: 의존성 설치 (필요시)

```bash
npm install
```

### Step 4: 마이그레이션 실행 (중요!)

**운영 환경에서는 `migrate deploy` 사용!**

```bash
# 운영 환경 마이그레이션
npx prisma migrate deploy

# 또는 환경 파일 명시
env-cmd -f .env.production npx prisma migrate deploy
```

**⚠️ 주의:**

- `migrate dev`는 개발용! 운영에서는 절대 사용 금지
- `migrate deploy`는 운영용으로 더 안전함

### Step 5: Prisma Client 재생성

```bash
npx prisma generate
```

### Step 6: 애플리케이션 재시작

```bash
# PM2 사용 시
pm2 restart menu-moa

# systemd 사용 시
sudo systemctl restart menu-moa

# 직접 실행 시
npm run build
npm start
```

### Step 7: 마이그레이션 확인

```bash
# 적용된 마이그레이션 확인
npx prisma migrate status

# DB 접속해서 직접 확인
mysql -u user -p menu_moa
> DESCRIBE User;
```

---

## 롤백 방법

### 방법 1: 백업에서 복구 (가장 안전)

```bash
# 백업 파일에서 복구
mysql -u user -p menu_moa < backup_20250101_120000.sql
```

### 방법 2: 수동 롤백 SQL 작성

마이그레이션의 반대 작업을 수행하는 SQL을 작성합니다.

**예시: 필드 추가의 롤백 (필드 제거)**

```sql
-- rollback_add_user_phone_and_verification.sql
ALTER TABLE `User`
  DROP COLUMN `phoneNumber`,
  DROP COLUMN `isVerified`;
```

실행:

```bash
mysql -u user -p menu_moa < rollback_add_user_phone_and_verification.sql
```

### 방법 3: 새로운 마이그레이션으로 되돌리기

```bash
# 스키마를 이전 상태로 수정
# 새 마이그레이션 생성
npx prisma migrate dev --name rollback_user_fields

# 운영 배포
npx prisma migrate deploy
```

---

## 체크리스트

### 배포 전 체크리스트

- [ ] 백업 완료 (타임스탬프 기록: **\*\***\_**\*\***)
- [ ] 로컬에서 마이그레이션 테스트 완료
- [ ] 마이그레이션 SQL 파일 검토 완료
- [ ] Git 커밋 및 푸시 완료
- [ ] 롤백 계획 수립 완료
- [ ] 서비스 중단 시간 최소화 방안 확인
- [ ] 관련 코드 변경사항 함께 배포 준비

### 배포 중 체크리스트

- [ ] 운영 서버 접속 완료
- [ ] 최신 코드 pull 완료
- [ ] 의존성 설치 완료
- [ ] `migrate deploy` 실행 완료
- [ ] `prisma generate` 실행 완료
- [ ] 애플리케이션 재시작 완료

### 배포 후 체크리스트

- [ ] 마이그레이션 상태 확인 (`migrate status`)
- [ ] DB 스키마 변경 확인 (직접 쿼리)
- [ ] 애플리케이션 헬스체크 통과
- [ ] 주요 기능 정상 작동 확인
- [ ] 에러 로그 확인
- [ ] 모니터링 지표 확인

---

## 자주 발생하는 문제와 해결

### 1. 마이그레이션 충돌

**증상:** "마이그레이션이 이미 적용되었습니다" 또는 "마이그레이션 히스토리가 일치하지 않습니다"

**해결:**

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 히스토리 재설정 (신중하게!)
npx prisma migrate resolve --applied [마이그레이션_이름]
```

### 2. 데이터 손실 경고

**증상:** "이 마이그레이션은 데이터를 삭제할 수 있습니다"

**해결:**

- 백업 확인
- 데이터 마이그레이션 스크립트 작성
- 단계적 마이그레이션 (필드 추가 → 데이터 이전 → 필드 제거)

### 3. 외래키 제약 오류

**증상:** "Cannot add foreign key constraint"

**해결:**

```sql
-- 기존 데이터와 참조 무결성 확인
-- 필요시 기존 데이터 정리 후 마이그레이션
```

---

## 고급: 데이터 마이그레이션

새 필드를 추가하면서 기존 데이터를 변환해야 하는 경우:

### Step 1: 필드 추가 (nullable)

```prisma
model User {
  newField String?  // 일단 nullable로 추가
}
```

### Step 2: 데이터 마이그레이션 스크립트

```typescript
// scripts/migrate-user-data.ts
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function migrateUserData() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        newField: transformOldData(user.oldField),
      },
    });
  }
}

migrateUserData()
  .then(() => console.log("Migration completed"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Step 3: 필드를 required로 변경

```prisma
model User {
  newField String  // nullable 제거
}
```

---

## 참고 명령어 모음

```bash
# 마이그레이션 생성 (개발)
npx prisma migrate dev --name [마이그레이션_이름]

# 마이그레이션 배포 (운영)
npx prisma migrate deploy

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 히스토리 조회
npx prisma migrate resolve --help

# 스키마 검증
npx prisma validate

# 스키마 포맷팅
npx prisma format

# Prisma Studio 실행
npx prisma studio

# DB와 스키마 동기화 (마이그레이션 없이)
npx prisma db push

# Prisma Client 생성
npx prisma generate
```

---

## 긴급 상황 대응

### 운영 DB가 망가진 경우

1. **즉시 서비스 중단**

   ```bash
   pm2 stop menu-moa
   ```

2. **백업에서 복구**

   ```bash
   mysql -u user -p menu_moa < backup_latest.sql
   ```

3. **마이그레이션 재적용**

   ```bash
   npx prisma migrate deploy
   ```

4. **서비스 재시작**

   ```bash
   pm2 restart menu-moa
   ```

5. **모니터링**
   - 에러 로그 확인
   - 사용자 요청 정상 처리 확인

---

## 연락처

문제 발생 시:

- 개발팀 슬랙 채널: #dev-backend
- 긴급 연락처: [전화번호]
- 문서 최종 수정일: 2025-10-28
