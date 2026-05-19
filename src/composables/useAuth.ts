import { computed, ref } from "vue"

type AuthUser = {
  username?: string
  name?: string
  email?: string
  user_uid?: string | number
  [k: string]: any
}

type SessionPayload = {
  access_token: string
  user?: AuthUser
}

const TOKEN_KEY = "DDSP_AT"
const USER_KEY = "DDSP_USER"

const user = ref<AuthUser | null>(null)
const token = ref<string>("")

const isAuthed = computed(() => !!token.value)

function safeJsonParse<T>(v: string | null): T | null {
  if (!v) return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

function setSession(payload: SessionPayload) {
  token.value = payload.access_token
  user.value = payload.user ?? null

  if (process.client) {
    sessionStorage.setItem(TOKEN_KEY, payload.access_token)
    if (payload.user) sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user))
    else sessionStorage.removeItem(USER_KEY)
  }
}

function hydrate() {
  if (!process.client) return

  const t = sessionStorage.getItem(TOKEN_KEY) || ""
  token.value = t

  const u = safeJsonParse<AuthUser>(sessionStorage.getItem(USER_KEY))
  user.value = u

  // 토큰은 있는데 유저가 없다면, 최소 표시용으로 username이라도 만들어줌
  // (원하면 여기서 /api/task/me 같은 걸로 “진짜 프로필 조회” 붙이면 됨)
  if (token.value && !user.value) {
    user.value = { username: "사용자" }
  }
}

async function logout() {
  token.value = ""
  user.value = null
  if (process.client) {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  }
}

export function useAuth() {
  return { user, token, isAuthed, hydrate, setSession, logout }
}