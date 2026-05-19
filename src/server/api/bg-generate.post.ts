// src/server/api/card-bg.post.ts
import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ prompt?: string; size?: string; model?: string }>(event);
    const prompt = (body?.prompt || "").trim();

    if (!prompt) {
      setResponseStatus(event, 400);
      return { ok: false, error: "prompt is required" };
    }

    const config = useRuntimeConfig();
    if (!config.openaiApiKey) {
      setResponseStatus(event, 500);
      return { ok: false, error: "OPENAI_API_KEY is missing (runtimeConfig.openaiApiKey)" };
    }

    const client = new OpenAI({ apiKey: config.openaiApiKey });

    // ✅ 명함 배경은 보통 1024x1024로 만들고 object-cover로 잘라 쓰는게 안정적
    // (원하면 1536x1024로 바꿔도 됨)
    const size = (body?.size || "1024x1024") as "1024x1024" | "256x256" | "512x512" | "1792x1024" | "1024x1792";
    const model = body?.model || "gpt-image-1.5";

    // OpenAI Images API: img.data[0].b64_json 형태  [oai_citation:1‡OpenAI 플랫폼](https://platform.openai.com/docs/api-reference/images)
    const img = await client.images.generate({
      model,
      prompt,
      size,
      n: 1,
    });

    const b64 = img?.data?.[0]?.b64_json;
    if (!b64) {
      setResponseStatus(event, 500);
      return { ok: false, error: "No b64_json in OpenAI response" };
    }

    // ✅ 프론트에서 바로 <img :src="..."> 가능하도록 dataUrl로 포장
    const dataUrl = `data:image/png;base64,${b64}`;

    return {
      ok: true,
      dataUrl, // 프론트는 이거 쓰면 됨
    };
  } catch (err: any) {
    console.error("[/api/card-bg] error:", err);

    setResponseStatus(event, 500);
    return {
      ok: false,
      error: err?.message || "unknown error",
    };
  }
});