// src/server/api/namecard-image.post.ts
import OpenAI from "openai";
import sharp from "sharp";

type Style = "classic" | "modern" | "bold";

function safeText(v: any, fallback = "") {
  if (typeof v !== "string") return fallback;
  return v.trim();
}

function pickStyle(style: Style) {
  if (style === "modern") return { border: "#111827", accent: "#111827" }; // slate-900
  if (style === "bold") return { border: "#0b0f17", accent: "#0b0f17" };
  return { border: "#111827", accent: "#111827" };
}

export default defineEventHandler(async (event) => {
  // ✅ multipart/form-data 받기
  const form = await readMultipartFormData(event);
  const getField = (name: string) =>
    safeText(form?.find((x) => x.name === name)?.data?.toString("utf-8") ?? "");

  const name = getField("name") || "Woojoo Choi";
  const phone = getField("phone") || "+1-213-223-2333";
  const email = getField("email") || "jellyznet@gmail.com";
  const address = getField("address") || "Los Angeles, CA";
  const promo = getField("promo") || "믿을 수 있는 CPA, 로스앤젤레스 전지역 가능";
  const style = (getField("style") as Style) || "classic";
  const extraPrompt = getField("prompt") || ""; // ✅ 추가 프롬프트(일단 debug로만 표시)

  // ✅ 업로드 파일
  const photo = form?.find((x) => x.name === "photo" && x.type)?.data;

  // ---- 캔버스 설정 ----
  const W = 1536;
  const H = 1024;
  const rightW = 600;              // 오른쪽 사진 영역 폭
  const leftW = W - rightW;

  const pad = 70;                  // 전체 패딩
  const imgPad = 0;               // 오른쪽 사진 "안쪽" 패딩

  const { border } = pickStyle(style);

  // ---- 폰트/텍스트 ----
  // sharp 기본 텍스트는 제한이 있어서 SVG로 렌더링 (가장 안정적)
  // 이 SVG는 왼쪽 텍스트 영역 레이아웃 + 외곽 라운드 카드
  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .t0{ font-family: Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; fill:#111827; }
        .small{ font-size:28px; fill:#374151; }
        .label{ font-size:26px; fill:#6B7280; }
        .name{ font-size:92px; font-weight:800; }
        .mid{ font-size:40px; font-weight:700; }
        .body{ font-size:32px; fill:#374151; }
      </style>
    </defs>

    <!-- 전체 바탕 -->
    <rect x="0" y="0" width="${W}" height="${H}" rx="48" ry="48" fill="#ffffff" stroke="${border}" stroke-width="10" />

    <!-- 오른쪽 분할선 -->
    <line x1="${leftW}" y1="120" x2="${leftW}" y2="${H - 120}" stroke="#E5E7EB" stroke-width="2" />

    <!-- 왼쪽 텍스트 영역 -->
    <text x="${pad}" y="140" class="t0 small">CPA</text>

    <text x="${pad}" y="260" class="t0 name">${escapeXml(name)}</text>

    <text x="${pad}" y="350" class="t0 mid">${escapeXml(phone)}</text>

    <text x="${pad}" y="420" class="t0 body">${escapeXml(email)}</text>

    <text x="${pad}" y="490" class="t0 body">${escapeXml(address)}</text>

    <text x="${pad}" y="620" class="t0 body">${escapeXml(promo)}</text>
  </svg>
  `;

  // ---- 오른쪽 사진 만들기 (패딩 적용) ----
  // photo가 없으면 기본 더미(회색 박스)
  let photoPng: Buffer;

  if (photo) {
    const photoBoxW = rightW - imgPad * 2;
    const photoBoxH = H - imgPad * 2;

    const cover = await sharp(photo)
      .resize(photoBoxW, photoBoxH, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();

    photoPng = await sharp({
      create: { width: rightW, height: H, channels: 4, background: "#ffffff" },
    })
      .composite([
        { input: cover, left: imgPad, top: imgPad },
      ])
      .png()
      .toBuffer();
  } else {
    // placeholder
    photoPng = await sharp({
      create: { width: rightW, height: H, channels: 4, background: "#f3f4f6" },
    })
      .png()
      .toBuffer();
  }

  // ---- 합성 ----
  const base = await sharp(Buffer.from(svg))
    .composite([
      { input: photoPng, left: leftW, top: 0 },
    ])
    .png()
    .toBuffer();

  // ---- 응답: usage/cost/debug ----
  // ⚠️ 이건 "합성 방식"이어서 OpenAI usage가 없음
  // usage/cost는 표시를 위해 우리 쪽에서 구조만 내려줌.
  // (나중에 배경 생성 등을 붙이면 여기에 실제 OpenAI usage를 넣어주면 됨)
  const usage = {
    mode: "local-compose", // 지금은 서버 합성
    width: W,
    height: H,
  };

  const costUsd = 0;

  return {
    ok: true,
    b64: base.toString("base64"),
    usage,
    costUsd,
    debug: {
      promptReceived: extraPrompt,
      promptApplied: false,
      appliedTo: "none",
    },
  };
});

// --- helpers ---
function escapeXml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}