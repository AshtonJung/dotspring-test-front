// src/server/api/task/requests/[id]/comments.post.ts
export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization"); // "Bearer xxx"
  const base = runtime.fastapiBaseUrl;
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing request id" });
  }
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "Missing Authorization header" });
  }

  const body = await readBody<{ body?: string }>(event);
  const text = (body?.body ?? "").trim();
  if (!text) {
    throw createError({ statusCode: 400, statusMessage: "Comment body is required" });
  }

  try {
    // ✅ FastAPI가 받는 형태에 맞춰 그대로 전달
    const res = await $fetch(`${base}/requests/${id}/comments`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: { body: text },
    });

    return res;
  } catch (err: any) {
    // ✅ FastAPI가 내려준 에러를 최대한 노출
    const statusCode = err?.statusCode || err?.status || 500;
    const detail =
      err?.data?.detail ||
      err?.data ||
      err?.message ||
      "Unknown error";

    console.error("[comments.post] FAIL:", statusCode, detail);

    throw createError({
      statusCode,
      statusMessage: typeof detail === "string" ? detail : JSON.stringify(detail),
    });
  }
});