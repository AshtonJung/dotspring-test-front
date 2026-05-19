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
    "Failed to load my info";

  if (typeof raw === "string") return raw;

  try {
    return JSON.stringify(raw);
  } catch {
    return "Failed to load my info";
  }
}

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

  try {
    const data = await $fetch(`${API_BASE}/auth/me`, {
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