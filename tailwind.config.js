/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✔ Tailwind 다크 모드 완전 비활성화
  darkMode: false,

  // ✔ Nuxt + Vue 기준 content 경로 추가
  content: [
    "./src/**/*.{vue,js,ts}",
    "./*.html",
  ],

  theme: {
    extend: {},
  },

  plugins: [
    require("daisyui")
  ],

  daisyui: {
    // ✔ 라이트 테마만 사용 (다크 포함 모든 테마 제거)
    themes: ["light"],

    // 필요하면 테마 자체도 끌 수 있음 → themes: false
  },
};