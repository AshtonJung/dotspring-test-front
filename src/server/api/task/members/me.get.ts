// src/server/api/task/members/me.get.ts
import { defineEventHandler, getHeader, createError } from "h3";

function toErrorMessage(err: any) {
  const raw =
    err?.data?.detail ??
    err?.response?._data?.detail ??
    err?.data?.message ??
    err?.response?._data?.message ??
    err?.message ??
    "Failed to load my profile";

  if (typeof raw === "string") return raw;

  try {
    return JSON.stringify(raw);
  } catch {
    return "Failed to load my profile";
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const API_BASE =
    config.public.apiBase ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  const auth = getHeader(event, "authorization");

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization header is required",
    });
  }

  try {
    const me = await $fetch(`${API_BASE}/members/me`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });

    return me;
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage: toErrorMessage(err),
    });
  }
});