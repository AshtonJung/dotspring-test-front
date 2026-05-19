<template>
  <div class="login-wrap">
    <!-- 배경 이미지 -->
    <img src="~/assets/img/galaxy_bg.jpg" alt="" class="galaxy-bg" />
    <!-- 어두운 오버레이 -->
    <div class="overlay" />

    <div class="content">
      <!-- 로고 영역 -->
      <div class="mb-10 text-center">
        <img src="~/assets/img/logo.png" alt="woojooverse" class="mx-auto mb-4 w-64 h-64 object-contain drop-shadow-2xl" />
        <div class="text-sm text-white/60 tracking-wide">일과 여행이 함께하는 나만의 우주를 만들자</div>
      </div>

      <!-- 구글 로그인 버튼 -->
      <a href="/api/auth/google/login" class="google-btn">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          class="h-5 w-5"
        />
        <span>Google로 계속하기</span>
      </a>

      <p class="mt-6 text-center text-xs text-white/30">
        로그인 시 서비스 이용약관에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'login' })
</script>

<style scoped>
.login-wrap {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

.galaxy-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0.55) 100%
  );
}

.content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 22rem;
}

.google-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  transition: background 0.2s, border-color 0.2s;
  text-decoration: none;
}

.google-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.35);
}
</style>
