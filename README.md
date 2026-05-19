# dotspring-test-front

woojooverse-front 기반의 dotspring 테스트 프로젝트입니다.

---

## 서버 정보

| 항목 | 값 |
|------|-----|
| 운영 도메인 | https://app.dotspring.us |
| EC2 | 3.13.9.82 / SSH: `dotspring-ec2` |
| 서버 경로 | `/home/ubuntu/dotspring-test-front` |
| PM2 이름 | `dotspring-test-front` (port 3005) |
| API 경로 | `/home/ubuntu/dotspring-test-api` |
| PM2 이름 | `dotspring-test-api` (port 8002) |
| DB | dotspring_test (AWS RDS) |
| GitHub (front) | https://github.com/AshtonJung/dotspring-test-front |
| GitHub (api) | https://github.com/AshtonJung/dotspring-test-api |

---

## 로컬 개발 서버 실행

### 1. SSH 터널 (RDS 접속용, woojooverse와 공용)
```bash
ssh -fN dotspring-tunnel
```
> 127.0.0.1:3307 → AWS RDS 3306 포워딩. 한 번만 실행하면 됨.

### 2. API 서버
```bash
cd ~/Documents/GitHub/03\ Woojooverse/dotspring-test-api
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

### 3. 프론트 서버
```bash
cd ~/Documents/GitHub/03\ Woojooverse/dotspring-test-front
pnpm dev --port 3002
```

---

## 배포

```bash
# 1. 로컬에서 커밋 & 푸시
git add [파일들]
git commit -m "..."
git push

# 2. EC2에서 빌드
ssh dotspring-ec2 "source ~/.nvm/nvm.sh && cd ~/dotspring-test-front && git pull && pnpm install && pnpm run build"

# 3. PM2 재시작
ssh dotspring-ec2 "source ~/.nvm/nvm.sh && pm2 restart dotspring-test-front"
```

API 변경 시:
```bash
ssh dotspring-ec2 "source ~/.nvm/nvm.sh && pm2 restart dotspring-test-api"
```

---

## 환경 변수 (.env)

`.gitignore`에 포함되어 있으므로 로컬에서 직접 생성:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback

UNSPLASH_ACCESS_KEY=...

NUXT_PUBLIC_API_BASE=http://127.0.0.1:8002
FASTAPI_BASE_URL=http://127.0.0.1:8002
```

---

## 디렉토리 구조

```
├── src/
│   ├── assets/       # CSS, 이미지
│   ├── components/   # Vue 컴포넌트
│   ├── composables/  # 재사용 함수
│   ├── data/         # 도시 데이터 등 정적 데이터
│   ├── layouts/      # 레이아웃
│   ├── middleware/   # 인증 미들웨어
│   ├── pages/        # 페이지 라우트
│   └── server/       # API 라우트 (Nitro)
├── public/           # 정적 파일
├── nuxt.config.ts
└── tailwind.config.js
```
