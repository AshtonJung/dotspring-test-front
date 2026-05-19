---
name: woojooverse 배포 및 로컬 개발 환경
description: EC2 SSH 배포 방법, 로컬 개발 서버 실행, PM2 서비스 구성, 환경변수 위치
type: project
---

## 인프라 구성

- **EC2**: `ubuntu@3.13.9.82` (AWS)
- **SSH 키**: `~/.ssh/dotspring-prod-key.pem`
- **도메인**: `https://woojooverse.com`

## 서비스 목록 (PM2)

| id | name | 포트 | 설명 |
|----|------|------|------|
| 0  | woojooverse-api   | 8001 | FastAPI 백엔드 (Python) |
| 10 | woojooverse-front | 3000 | Nuxt 3 프론트엔드 (Node) |

- FastAPI 경로: `/home/ubuntu/woojooverse-api/`
- Nuxt 경로: `/home/ubuntu/woojooverse-front/`

## EC2 배포 명령

```bash
ssh -i ~/.ssh/dotspring-prod-key.pem ubuntu@3.13.9.82 \
  "source ~/.nvm/nvm.sh && cd /home/ubuntu/woojooverse-front && \
   git pull && npm run build && pm2 restart woojooverse-front"
```

**주의**: `source ~/.nvm/nvm.sh` 필수 — 비대화형 SSH에서는 nvm PATH가 없음

## 로컬 개발 서버

```bash
# .nuxt 캐시 오류 시 먼저 삭제
rm -rf .nuxt

# 개발 서버 실행 (pnpm 사용, npm 아님)
pnpm run dev
```

- 패키지 매니저: **pnpm** (`.npmrc`에 `shamefully-hoist=true`)
- npm install 사용 불가 (lockfile 충돌)

## 환경변수

EC2 PM2 env에 설정됨:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`: `https://woojooverse.com/api/auth/google/callback`
- `FASTAPI_BASE_URL`: `http://127.0.0.1:8001`

로컬 Google OAuth 콜백은 GCP Console에 `http://localhost:3000/api/auth/google/callback` 등록 필요

## PM2 로그 확인

```bash
ssh -i ~/.ssh/dotspring-prod-key.pem ubuntu@3.13.9.82 \
  "source ~/.nvm/nvm.sh && pm2 logs woojooverse-front --lines 50 --nostream"

# FastAPI 에러 로그
ssh -i ~/.ssh/dotspring-prod-key.pem ubuntu@3.13.9.82 \
  "cat /home/ubuntu/.pm2/logs/woojooverse-api-error.log | tail -50"
```

## FastAPI 설정 변경 방법

EC2에서 직접 파일 수정 후 PM2 restart:
```bash
ssh -i ~/.ssh/dotspring-prod-key.pem ubuntu@3.13.9.82 \
  "source ~/.nvm/nvm.sh && pm2 restart woojooverse-api"
```

- DB 커넥션 풀 설정: `/home/ubuntu/woojooverse-api/database.py`
  - `pool_recycle=1800`, `pool_pre_ping=True` 설정됨 (MySQL idle timeout 대응)

## iOS Capacitor 빌드

- 설정: `capacitor.config.ts` (프로덕션 URL 로드)
- Xcode 프로젝트: `ios/App/App.xcodeproj`
- 모바일 SPA 빌드 설정: `nuxt.config.mobile.ts`
- Node 22 필요: `source ~/.nvm/nvm.sh && nvm use 22`
- 빌드 후 sync: `npx cap sync ios`
- Xcode 열기: `npx cap open ios` 또는 `open ios/App/App.xcodeproj`

**Why:** 배포마다 명령어를 매번 찾지 않아도 되도록
**How to apply:** EC2 배포 또는 로컬 서버 시작 시 이 파일 참조
