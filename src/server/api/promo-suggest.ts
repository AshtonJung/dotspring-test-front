// src/server/api/promo-suggest.post.ts
import { defineEventHandler, readBody, createError } from "h3";

type Body = {
  keyword?: string;
  name?: string;
  location?: string;
  job?: string;
  tone?: string;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = (await readBody(event)) as Body;

  const keyword = (body.keyword || "").trim();
  const name = (body.name || "").trim();
  const location = (body.location || "").trim();
  const job = (body.job || "전문가").trim();
  const tone = (body.tone || "신뢰감/간결").trim();

  if (!keyword) {
    throw createError({ statusCode: 400, statusMessage: "keyword is required" });
  }

  // ✅ OpenAI 키가 없으면(또는 연결 전이면) 안전한 로컬 추천으로 fallback
  if (!config.openaiApiKey) {
    const samples = [
      `${keyword} 전문 ${job}, ${location} 빠른 상담`,
      `${keyword} 꼼꼼하게, 신뢰로 답하는 ${job}`,
      `${keyword} 상담/대행 — 합리적 비용, 정확한 처리`,
      `${keyword} 문제를 빠르게 정리해드립니다`,
      `${keyword} 필요하신가요? 지금 문의하세요`,
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    return { ok: true, promo: pick, mode: "fallback" };
  }

  // ✅ OpenAI 호출
  const system = `너는 명함에 넣을 한 줄 홍보문구를 만드는 카피라이터야.
- 22~34자 내외(공백 포함) 한국어
- 키워드에 기반하여 작성
- 특수문자 남발 금지
- 결과는 문구 1줄만 반환`;

  const user = `키워드: ${keyword}
이름: ${name || "홍길동"}
직업: ${job}
지역: ${location || "서울"}
톤: ${tone}`;

  try {
    const res: any = await $fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "gpt-4.1-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      },
    });

    const promo = (res?.choices?.[0]?.message?.content || "").trim();
    if (!promo) {
      return { ok: false, error: "empty response" };
    }

    // 혹시 여러 줄이면 1줄만
    const oneLine = promo.split("\n").map((s: string) => s.trim()).filter(Boolean)[0] || promo;

    return { ok: true, promo: oneLine, mode: "openai" };
  } catch (e: any) {
    console.error("[promo-suggest] error:", e?.data || e?.message || e);
    return { ok: false, error: e?.data?.error?.message || e?.message || "OpenAI request failed" };
  }
});