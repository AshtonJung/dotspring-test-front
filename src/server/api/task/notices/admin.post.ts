import { defineEventHandler, readBody, getHeader, createError } from "h3";

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig();

  const API_BASE =
    (cfg.public?.API_BASE as string) ||
    (cfg.public?.apiBase as string) ||
    "http://127.0.0.1:8000";

  const auth = getHeader(event, "authorization") || "";
  const body = await readBody(event);

  try {
    return await ($fetch as any)(`${API_BASE}/notices/admin`, {
      method: "POST",
      headers: auth ? { Authorization: auth } : {},
      body,
    });
  } catch (e: any) {
    throw createError({
      statusCode: e?.statusCode || e?.response?.status || 500,
      statusMessage:
        e?.data?.detail ||
        e?.response?._data?.detail ||
        e?.message ||
        "notice create failed",
    });
  }
});