import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const config = useRuntimeConfig();
  const API_BASE =
    (config.public?.apiBase as string) ||
    (config.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    const res = await $fetch(`${API_BASE}/notices/${id}`, { method: "GET" });
    return res;
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.response?.status || 500;
    const detail =
      err?.data?.detail ||
      err?.response?._data?.detail ||
      err?.message ||
      "Failed to load notice";

    throw createError({ statusCode, statusMessage: detail });
  }
});