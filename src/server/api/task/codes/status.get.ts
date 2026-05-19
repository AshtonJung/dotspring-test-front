import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const API_BASE =
    config.public.apiBase ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    return await ($fetch as any)(`${API_BASE}/codes/status`);
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.message || "Failed to load codes",
    });
  }
});