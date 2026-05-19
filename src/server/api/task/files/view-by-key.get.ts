import { defineEventHandler, getQuery, sendRedirect, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const key = String(query.key || "");

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: "key is required",
    });
  }

  const config = useRuntimeConfig();
  const API_BASE =
    (config.public?.apiBase as string) ||
    (config.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    const res: any = await $fetch(`${API_BASE}/files/view-by-key`, {
      method: "GET",
      query: { key },
    });

    if (!res?.url) {
      throw createError({
        statusCode: 404,
        statusMessage: "File URL not found",
      });
    }

    return sendRedirect(event, res.url, 302);
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage:
        err?.data?.detail ||
        err?.response?._data?.detail ||
        err?.message ||
        "Failed to redirect file url",
    });
  }
});