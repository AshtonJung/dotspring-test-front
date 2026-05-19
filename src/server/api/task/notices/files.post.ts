import { defineEventHandler, getHeader, getRouterParam, readMultipartFormData, createError } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const config = useRuntimeConfig();
  const API_BASE =
    (config.public?.apiBase as string) ||
    (config.apiBase as string) ||
    process.env.NUXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8000";

  const auth =
    getHeader(event, "authorization") ||
    getHeader(event, "Authorization") ||
    "";

  const form = await readMultipartFormData(event);
  if (!form) throw createError({ statusCode: 400, statusMessage: "multipart form-data required" });

  // h3의 multipart는 그대로 백엔드로 proxy하기가 애매해서,
  // 여기서는 "백엔드가 presigned 업로드" 같은 구조면 더 깔끔해.
  // 만약 FastAPI가 바로 파일을 받는 구조면, Nuxt 서버에서 fetch로 FormData 재구성이 필요함.
  throw createError({
    statusCode: 501,
    statusMessage: "files proxy not implemented yet (need backend upload spec)",
  });
});