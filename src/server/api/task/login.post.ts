// src/server/api/task/login.post.ts
import { readBody, createError, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const username = (body?.username || "").trim();
  const password = body?.password || "";

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "username/password required",
      data: { detail: "아이디와 비밀번호를 입력해주세요." },
    });
  }

  try {
    const res: any = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: "POST",
      body: { username, password },
    });

    // ✅ FastAPI 흔한 응답: { access_token, token_type }
    const token =
      res?.access_token ||
      res?.token ||
      res?.data?.access_token ||
      res?.data?.token;

    if (!token) {
      throw createError({
        statusCode: 500,
        statusMessage: "Login response has no token",
        data: { detail: "로그인 응답에 토큰이 없습니다. 백엔드 응답 키를 확인해주세요." },
      });
    }

    // ✅ 서버 API가 다음 요청에서 꺼내쓸 쿠키들 저장
    setCookie(event, "access_token", token, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    setCookie(event, "auth_header", `Bearer ${token}`, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err: any) {
    const msg =
      err?.data?.detail ||
      err?.response?._data?.detail ||
      err?.message ||
      "로그인에 실패했습니다.";

    throw createError({
      statusCode: err?.statusCode || err?.status || 400,
      statusMessage: "Login failed",
      data: { detail: msg },
    });
  }
});