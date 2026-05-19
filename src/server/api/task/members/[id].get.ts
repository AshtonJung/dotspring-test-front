// src/server/api/task/members/[id].get.ts
import {
  defineEventHandler,
  getHeader,
  getCookie,
  createError,
} from "h3";

function toErrorMessage(err: any) {
  const raw =
    err?.data?.detail ??
    err?.response?._data?.detail ??
    err?.data?.message ??
    err?.response?._data?.message ??
    err?.message ??
    "Failed to load member";

  if (typeof raw === "string") return raw;

  try {
    return JSON.stringify(raw);
  } catch {
    return "Failed to load member";
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const API_BASE =
    (config.apiBase as string) ||
    (config.public?.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  const memberId = event.context.params?.id;

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

  if (!memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: "member id is required",
    });
  }

  try {
    const data = await $fetch(`${API_BASE}/admin/members/${memberId}`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });

    return data;
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage: toErrorMessage(err),
    });
  }
});