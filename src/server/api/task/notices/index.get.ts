// src/server/api/task/notices.get.ts
import { defineEventHandler, getQuery, getHeader, createError } from "h3";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);

  const cfg = useRuntimeConfig();
  const API_BASE =
    (cfg.public?.API_BASE as string) ||
    (cfg.public?.apiBase as string) ||
    "http://127.0.0.1:8000";

  const auth = getHeader(event, "authorization") || "";

  const params = new URLSearchParams();
  if (q.page) params.set("page", String(q.page));
  if (q.page_size) params.set("page_size", String(q.page_size));
  if (q.q) params.set("q", String(q.q));

  try {
    const res = await $fetch(`${API_BASE}/notices?${params.toString()}`, {
      method: "GET",
      headers: auth ? { Authorization: auth } : {},
    });

    return res;
  } catch (e: any) {
    const statusCode = e?.statusCode || e?.response?.status || 500;
    const detail =
      e?.data?.detail ||
      e?.response?._data?.detail ||
      e?.message ||
      "notice list failed";

    throw createError({
      statusCode,
      statusMessage: detail,
    });
  }
});