import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "file id is required" });
  }

  const config = useRuntimeConfig();
  const API_BASE =
    (config.public?.apiBase as string) ||
    (config.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    return await ($fetch as any)(`${API_BASE}/notices/files/${id}/view`, {
      method: "GET",
    });
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage:
        err?.data?.detail ||
        err?.response?._data?.detail ||
        err?.message ||
        "Failed to load file url",
    });
  }
});