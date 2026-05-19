// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  srcDir: "./src",
  devtools: { enabled: true },
  sourcemap: true,

  app: {
    head: {
      title: 'dotspring test',
      meta: [
        { name: 'description', content: 'dotspring test — powered by woojooverse' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Round' }
      ]
    }
  },

  modules: ["@nuxtjs/tailwindcss"],

  runtimeConfig: {
    // -------------------------
    // Server-only
    // -------------------------
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    dlabApi: process.env.DLAB_API || "",
    uriToken: process.env.URI_TOKEN || "",
    myEnv: process.env.MY_ENV || "",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || "",

    fastapiBaseUrl:
      process.env.FASTAPI_BASE_URL ||
      process.env.NUXT_PUBLIC_API_BASE ||
      "http://127.0.0.1:8000",

    // -------------------------
    // Client-safe
    // -------------------------
    public: {
      googleAnalyticsId: process.env.GTAG || "",

      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000"
          : "http://127.0.0.1:8000"),

      /**
       * ✅ S3 public base
       * 업로드 후 key만 올 때 이미지/파일 URL 조합용
       */
      FILE_BASE:
        process.env.NUXT_PUBLIC_FILE_BASE ||
        "https://dotspring-s3.s3.amazonaws.com",
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
});