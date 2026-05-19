
import {
  defineEventHandler,
  getRouterParam,
  getHeader,
  createError,
} from "h3";

export default defineEventHandler(async (event) => {
  const commentId = getRouterParam(event, "commentId");
  if (!commentId) {
    throw createError({ statusCode: 400, statusMessage: "comment id is required" });
  }

  const auth =
    getHeader(event, "authorization") ||
    getHeader(event, "Authorization") ||
    "";

  const config = useRuntimeConfig();
  const API_BASE =
    (config.public?.apiBase as string) ||
    (config.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  try {
    return await ($fetch as any)(`${API_BASE}/notices/comments/${commentId}`, {
      method: "DELETE",
      headers: auth ? { Authorization: auth } : {},
    });
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 500,
      statusMessage:
        err?.data?.detail ||
        err?.response?._data?.detail ||
        err?.message ||
        "Failed to delete comment",
    });
  }
});