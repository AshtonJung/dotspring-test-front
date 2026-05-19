// server/api/task/members/[id].patch.ts
import {
  defineEventHandler,
  getHeader,
  getRouterParam,
  readBody,
  createError,
  getCookie,
} from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id is required" });
  }

  const config = useRuntimeConfig();
  const API_BASE =
    (config.apiBase as string) ||
    (config.public?.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  let auth =
    getHeader(event, "authorization") ||
    getHeader(event, "Authorization") ||
    "";

  if (!auth) {
    const cookieAuth = getCookie(event, "auth_header");
    const token = getCookie(event, "access_token");
    auth = cookieAuth || (token ? `Bearer ${token}` : "");
  }

  const body: any = (await readBody(event)) || {};

  // ✅ 아이디(username)는 수정 불가: 넘어와도 제거
  delete body.username;
  delete body.user_id;

  // ✅ 빈 문자열 password는 변경 안함 처리
  if (typeof body.password === "string" && !body.password.trim()) {
    delete body.password;
  }

  // ✅ undefined 제거
  Object.keys(body).forEach((k) => {
    if (body[k] === undefined) delete body[k];
  });

  try {
    const res = await $fetch(`${API_BASE}/admin/members/${id}`, {
      method: "PATCH",
      headers: {
        ...(auth ? { Authorization: auth } : {}),
        "Content-Type": "application/json",
      },
      body,
    });

    return res;
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.response?.status || 500;
    const detail =
      err?.data?.detail ||
      err?.response?._data?.detail ||
      err?.message ||
      "Failed to update member";

    throw createError({ statusCode, statusMessage: detail });
  }
});