import {
  defineEventHandler,
  getRouterParam,
  getHeader,
  readBody,
  createError,
} from "h3";

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const base =
    runtime.fastapiBaseUrl ||
    runtime.public?.apiBase ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "request id is required",
    });
  }

  try {
    return await ($fetch as any)(`${base}/requests/${id}/admin-meta`, {
      method: "PATCH",
      headers: authHeader ? { Authorization: authHeader } : undefined,
      body,
    });
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage:
        err?.data?.detail ||
        err?.response?._data?.detail ||
        err?.message ||
        "Failed to update request meta",
    });
  }
});