import {
  defineEventHandler,
  getHeader,
  getCookie,
  readBody,
  createError,
} from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const API_BASE =
    (config.apiBase as string) ||
    (config.public?.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  let auth =
    getHeader(event, "authorization") ||
    getHeader(event, "Authorization") ||
    getCookie(event, "auth_header") ||
    "";

  if (!auth) {
    const token = getCookie(event, "access_token");
    if (token) auth = `Bearer ${token}`;
  }

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization header is required",
    });
  }

  const body: Record<string, any> = (await readBody(event)) || {};

  // 수정 불가 필드 제거
  delete body.id;
  delete body.user_id;
  delete body.username;
  delete body.role;
  delete body.is_active;
  delete body.created_at;
  delete body.updated_at;

  // 빈 비밀번호는 변경 안 함
  if (typeof body.password === "string" && !body.password.trim()) {
    delete body.password;
  }

  // undefined / null / 빈 문자열 정리
  Object.keys(body).forEach((key) => {
    const value = body[key];

    if (value === undefined || value === null) {
      delete body[key];
      return;
    }

    if (typeof value === "string") {
      body[key] = value.trim();

      if (key !== "password" && body[key] === "") {
        delete body[key];
      }
    }
  });

  try {
    const res = await $fetch(`${API_BASE}/auth/me`, {
      method: "PATCH",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body,
    });

    return res;
  } catch (err: any) {
    console.error("[me patch error]", err?.data || err);

    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage: "Failed to update my info",
      data: {
        detail:
          err?.data?.detail ||
          err?.response?._data?.detail ||
          err?.data?.message ||
          err?.message ||
          "Failed to update my info",
      },
    });
  }
});