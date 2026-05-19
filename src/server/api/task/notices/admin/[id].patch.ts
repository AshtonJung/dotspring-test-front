import {
  defineEventHandler,
  getHeader,
  getRouterParam,
  readBody,
  createError,
} from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "id is required",
    });
  }

  const auth =
    getHeader(event, "authorization") ||
    getHeader(event, "Authorization") ||
    "";

  const body = await readBody(event);

  const config = useRuntimeConfig();
  const API_BASE =
    (config.public?.apiBase as string) ||
    (config.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    return await ($fetch as any)(`${API_BASE}/notices/admin/${id}`, {
      method: "PATCH",
      headers: auth ? { Authorization: auth } : {},
      body,
    });
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage:
        err?.data?.detail ||
        err?.response?._data?.detail ||
        err?.message ||
        "Failed to update notice",
    });
  }
});