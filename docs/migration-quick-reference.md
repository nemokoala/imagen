# 마이그레이션 빠른 참조 가이드

## 🚀 3분 요약

### 로컬 개발

```bash
# 1. 스키마 수정 (prisma/schema.prisma)

# 2. 마이그레이션 생성
npx prisma migrate dev --name [변경사항_설명]

# 3. 테스트
npx prisma studio

# 4. 커밋
git add prisma/
git commit -m "feat: [변경사항]"
git push
```

### 운영 배포

```bash
# 1. 백업 (필수!)
mysqldump -u user -p database > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 서버 접속 및 코드 업데이트
ssh user@server
git pull

# 3. 마이그레이션 적용
npx prisma migrate deploy
npx prisma generate

# 4. 재시작
pm2 restart menu-moa

# 5. 확인
npx prisma migrate status
```

---

## 📝 명령어 치트시트

| 작업              | 명령어                                 |
| ----------------- | -------------------------------------- |
| 마이그레이션 생성 | `npx prisma migrate dev --name [이름]` |
| 운영 배포         | `npx prisma migrate deploy`            |
| 상태 확인         | `npx prisma migrate status`            |
| 백업              | `mysqldump -u user -p db > backup.sql` |
| 복구              | `mysql -u user -p db < backup.sql`     |
| DB 초기화         | `npx prisma migrate reset --force`     |
| Client 생성       | `npx prisma generate`                  |
| Studio 실행       | `npx prisma studio`                    |

---

## ⚠️ 절대 금지 사항

❌ 운영에서 `migrate dev` 사용  
❌ 백업 없이 마이그레이션  
❌ 마이그레이션 파일 직접 수정  
❌ Git에 커밋하지 않고 배포

---

## ✅ 기본 원칙

1. **항상 백업 먼저**
2. **로컬에서 먼저 테스트**
3. **Git으로 버전 관리**
4. **운영은 `migrate deploy`만**
5. **롤백 계획 준비**

---

## 🆘 긴급 상황

### 마이그레이션 실패 시

```bash
# 1. 서비스 중단
pm2 stop menu-moa

# 2. 백업 복구
mysql -u user -p db < backup_latest.sql

# 3. 마이그레이션 재시도
npx prisma migrate deploy

# 4. 안되면 팀에 연락!
```

### 롤백하기

```bash
# 백업에서 복구가 가장 안전
mysql -u user -p db < backup_before_migration.sql
```

---

## 💡 자주하는 실수

### 실수 1: 마이그레이션 이름 없이 실행

```bash
❌ npx prisma migrate dev
✅ npx prisma migrate dev --name add_user_phone
```

### 실수 2: 운영에서 migrate dev 사용

```bash
❌ npx prisma migrate dev  (운영에서)
✅ npx prisma migrate deploy  (운영에서)
```

### 실수 3: generate 없이 코드 실행

```bash
# 마이그레이션 후 반드시
npx prisma generate
```

### 실수 4: 환경 변수 확인 안함

```bash
# 실행 전 확인
echo $DATABASE_URL
```

---

## 📞 도움말

자세한 내용: `docs/database-migration-guide.md` 참조
