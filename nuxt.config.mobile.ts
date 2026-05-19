// nuxt.config.mobile.ts — Capacitor iOS 빌드용 (SPA 모드)
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  srcDir: "./src",
  ssr: false,              // SPA 모드: 서버 없이 클라이언트 전용
  devtools: { enabled: false },

  app: {
    baseURL: '/',
    head: {
      title: 'woojooverse',
      meta: [
        { name: 'description', content: '일과 여행이 함께하는 나만의 우주를 만들자 — woojooverse' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Round' }
      ]
    }
  },

  modules: ["@nuxtjs/tailwindcss"],

  runtimeConfig: {
    public: {
      // 앱에서 API 호출은 프로덕션 서버로
      apiBase: 'https://woojooverse.com',
      FILE_BASE: 'https://dotspring-s3.s3.amazonaws.com',
      googleAnalyticsId: '',
    },
  },

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    exposeLevel: 2,
    config: { darkMode: false },
    injectPosition: "first",
    viewer: true,
  },

  build: {
    transpile: ["echarts", "zrender", "tslib"],
  },

  nitro: {
    output: {
      publicDir: 'dist',
    },
  },
})
