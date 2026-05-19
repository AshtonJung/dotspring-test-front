import {
  defineEventHandler,
  getHeader,
  getRouterParam,
  readBody,
  createError,
} from "h3";

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const body = await readBody(event);

  const id = getRouterParam(event, "id");
  const commentId = getRouterParam(event, "commentId");
  const base = runtime.fastapiBaseUrl;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing request id",
    });
  }

  if (!commentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing comment id",
    });
  }

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing Authorization header",
    });
  }

  try {
    return await ($fetch as any)(`${base}/requests/${id}/comments/${commentId}/files`, {
      method: "POST",
      body,
      headers: {
        Authorization: authHeader,
      },
    });
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.status || 500;
    const detail =
      err?.data?.detail ||
      err?.data ||
      err?.message ||
      "Unknown error";

    console.error("[comment files.post] FAIL:", statusCode, detail);

    throw createError({
      statusCode,
      statusMessage: typeof detail === "string" ? detail : JSON.stringify(detail),
    });
  }
});