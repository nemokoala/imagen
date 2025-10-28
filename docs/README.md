# Menu-Moa 데이터베이스 관리 가이드

이 디렉토리에는 데이터베이스 관리와 마이그레이션에 관련된 문서들이 포함되어 있습니다.

## 📚 문서 목록

### 1. [데이터베이스 마이그레이션 가이드](./database-migration-guide.md)

상세한 마이그레이션 프로세스와 베스트 프랙티스

**포함 내용:**

- 마이그레이션 개요 및 워크플로우
- 로컬 환경에서 마이그레이션 생성하기
- 운영 환경 배포 상세 가이드
- 롤백 방법 및 긴급 상황 대응
- 문제 해결 가이드
- 데이터 마이그레이션 고급 기법

### 2. [빠른 참조 가이드](./migration-quick-reference.md)

3분 요약 치트시트

**포함 내용:**

- 핵심 명령어 모음
- 자주하는 실수 모음
- 긴급 상황 대응 방법
- 기본 원칙 및 금지 사항

## 🛠️ 유틸리티 스크립트

프로젝트 루트의 `scripts/` 디렉토리에 유용한 스크립트들이 있습니다:

### 백업 스크립트

```bash
# 운영 DB 백업
./scripts/db-backup.sh production

# 개발 DB 백업
./scripts/db-backup.sh development
```

### 복구 스크립트

```bash
# 백업 파일에서 복구
./scripts/db-restore.sh ./backups/backup_production_20250128_120000.sql.gz production
```

### 운영 마이그레이션 스크립트

```bash
# 안전한 마이그레이션 (백업 포함)
./scripts/migrate-production.sh
```

### 데이터 마이그레이션 예제

```bash
# 특정 마이그레이션 실행
npx ts-node scripts/data-migration-example.ts phone

# 모든 마이그레이션 실행
npx ts-node scripts/data-migration-example.ts all
```

## 🚀 빠른 시작

### 처음 사용하는 경우

1. **스크립트 실행 권한 부여** (Linux/Mac)

   ```bash
   chmod +x scripts/*.sh
   ```

2. **환경 변수 설정**

   ```bash
   # .env.production 파일 생성
   DATABASE_URL="mysql://user:password@host:port/database"
   ```

3. **백업 테스트**
   ```bash
   ./scripts/db-backup.sh production
   ```

### 일반적인 워크플로우

```bash
# 1. 로컬에서 스키마 수정
vim prisma/schema.prisma

# 2. 마이그레이션 생성
npx prisma migrate dev --name add_new_feature

# 3. 테스트
npx prisma studio

# 4. 커밋 및 푸시
git add prisma/
git commit -m "feat: 새 기능 추가"
git push

# 5. 운영 배포 (서버에서)
./scripts/migrate-production.sh
```

## ⚠️ 중요 사항

### 반드시 지켜야 할 규칙

1. ✅ **항상 백업 먼저**
2. ✅ **로컬에서 먼저 테스트**
3. ✅ **Git으로 버전 관리**
4. ✅ **운영은 `migrate deploy`만 사용**
5. ✅ **롤백 계획 준비**

### 절대 하지 말아야 할 것

1. ❌ 운영에서 `migrate dev` 사용
2. ❌ 백업 없이 마이그레이션
3. ❌ 마이그레이션 파일 직접 수정
4. ❌ Git 커밋 없이 배포

## 🆘 긴급 상황

문제가 발생하면:

1. **서비스 중단**

   ```bash
   pm2 stop menu-moa
   ```

2. **백업에서 복구**

   ```bash
   ./scripts/db-restore.sh [백업파일] production
   ```

3. **팀에 연락**
   - Slack: #dev-backend
   - 긴급 연락처: [전화번호]

## 📖 추가 리소스

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Prisma Migrate 가이드](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [프로젝트 README](../README.md)

## 🤝 기여

문서 개선 아이디어나 오류를 발견하셨나요?

- Issue 생성
- Pull Request 제출

---

**최종 수정일:** 2025-10-28  
**관리자:** 개발팀
