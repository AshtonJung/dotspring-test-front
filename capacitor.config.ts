import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.woojooverse.app',
  appName: 'woojooverse',
  webDir: 'dist',
  server: {
    url: 'https://woojooverse.com',   // 프로덕션 사이트 로드
    cleartext: false,
  },
  ios: {
    scheme: 'woojooverse',
    contentInset: 'automatic',
  },
}

export default config
