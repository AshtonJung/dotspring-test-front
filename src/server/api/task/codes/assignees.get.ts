import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const API_BASE =
    config.public.apiBase ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    const res = await $fetch(`${API_BASE}/codes/category/3`);
    console.log("[assignees.get] API_BASE =", API_BASE);
    console.log("[assignees.get] response =", res);
    return res;
  } catch (err: any) {
    console.error("[assignees.get] error =", err);
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage:
        err?.data?.detail ||
        err?.response?._data?.detail ||
        err?.statusMessage ||
        err?.message ||
        "Failed to load assignees",
    });
  }
});