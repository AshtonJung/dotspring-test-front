---
name: woojooverse 인증 구조
description: Nuxt Nitro 프록시 라우트, x-client-token 헤더, Google OAuth 콜백, 세션 저장 방식
type: project
---

## 인증 흐름

1. Google OAuth → `/api/auth/google/callback` (Nuxt Nitro)
2. Nitro가 FastAPI `/auth/google` 호출 → JWT 발급
3. 쿠키 설정:
   - `auth_header`: `Bearer <JWT>` (maxAge: 24h, httpOnly: false)
   - `access_token`: JWT 원문
   - `GOOGLE_AT`: Google access token (캘린더용)
4. 클라이언트 sessionStorage: `DDSP_AT` = JWT

## Nitro 프록시 라우트 인증 패턴

모든 `/api/todo/*` 서버 라우트에서 동일하게 사용:

```typescript
const cookieAuth = getCookie(event, 'auth_header') || ''
const clientToken = getHeader(event, 'x-client-token') || ''
const authHeader = cookieAuth || (clientToken ? `Bearer ${clientToken}` : '')
// FastAPI 호출 시 Authorization: authHeader
```

- `auth_header` 쿠키: 기본 (로그인 시 자동 설정)
- `x-client-token`: fallback (sessionStorage → 모든 $fetch 요청 헤더)

## 클라이언트 API 호출 패턴 (useTodo.ts)

```typescript
function getClientToken() {
  if (!process.client) return ''
  return sessionStorage.getItem('DDSP_AT') || ''
}
function clientHeaders() {
  const t = getClientToken()
  return t ? { 'x-client-token': t } : {}
}
function apiUrl(path: string) {
  const base = useRuntimeConfig().public.apiBase
  // 외부 URL(Capacitor 모바일)에서만 절대경로, 웹에서는 상대경로
  if (base && base.startsWith('http') && !base.includes('127.0.0.1') && !base.includes('localhost'))
    return `${base}${path}`
  return path
}
```

**중요**: `apiBase`가 `http://127.0.0.1:*`이면 상대경로 사용 → Nitro 프록시 경유
Capacitor 앱(`https://woojooverse.com`)에서만 절대경로 사용

## Nitro 라우트 파일 목록

```
src/server/api/
├── auth/google/login.get.ts       # Google OAuth URL 생성
├── auth/google/callback.get.ts    # OAuth 콜백 처리
├── todo/
│   ├── items.get.ts               # GET /todo/items
│   ├── items.post.ts              # POST /todo/items
│   ├── items/[id].patch.ts        # PATCH /todo/items/:id
│   ├── items/[id].delete.ts       # DELETE /todo/items/:id
│   └── items/reorder.patch.ts     # PATCH /todo/items/reorder
│   ├── trips.get.ts
│   ├── calendar-sort.get.ts / .post.ts
│   └── weekly-goal.get.ts / .post.ts
└── calendar/                      # Google Calendar 연동
```

**Why:** 배포 후 인증 관련 버그 원인 파악을 빠르게 하기 위해
**How to apply:** 401/403 에러 발생 시 이 흐름을 먼저 확인
