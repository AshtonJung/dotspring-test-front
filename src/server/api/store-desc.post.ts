import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      keyword?: string;
      name?: string;
      location?: string;
      category?: string;
      tone?: string;
    }>(event);

    const keyword = (body?.keyword || "").trim();
    if (!keyword) {
      setResponseStatus(event, 400);
      return { ok: false, error: "keyword is required" };
    }

    const config = useRuntimeConfig();
    if (!config.openaiApiKey) {
      setResponseStatus(event, 500);
      return { ok: false, error: "OPENAI_API_KEY is missing (runtimeConfig.openaiApiKey)" };
    }

    const client = new OpenAI({ apiKey: config.openaiApiKey });

    const name = (body?.name || "").trim();
    const location = (body?.location || "").trim();
    const category = (body?.category || "").trim();
    const tone = (body?.tone || "친근/간결").trim();

    const prompt = `
너는 한인 비즈니스 네트워크에 등록할 "가게 소개 문구"를 작성하는 카피라이터야.
아래 키워드를 참고해서 한국어로 1~2문장, 80~130자 정도로 자연스럽게 작성해줘.
- 가게명: ${name || "(미입력)"}
- 지역/주소: ${location || "(미입력)"}
- 카테고리: ${category || "(미입력)"}
- 톤: ${tone}
- 키워드: ${keyword}

조건:
- 과장/허위 금지
- 따옴표는 쓰지 말고 문장만 반환
`.trim();

    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You write concise Korean business descriptions." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = (res.choices?.[0]?.message?.content || "").trim();
    if (!text) {
      setResponseStatus(event, 500);
      return { ok: false, error: "Empty response from model" };
    }

    return { ok: true, text };
  } catch (err: any) {
    console.error("[/api/store-desc] error:", err);
    setResponseStatus(event, 500);
    return { ok: false, error: err?.message || "unknown error" };
  }
});