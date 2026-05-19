<template>
  <div class="min-h-screen bg-[#0f172a]">
    <div class="mx-auto max-w-3xl px-6 py-16">

      <h1 class="text-3xl font-bold text-white mb-2">이용약관</h1>
      <p class="text-sm text-slate-500 mb-12">최종 업데이트: 2026년 5월 17일</p>

      <section class="mb-10">
        <h2 class="section-title">1. 서비스 소개</h2>
        <p class="body-text">
          woojooverse(이하 "서비스")는 일과 여행을 함께 관리할 수 있는 개인 생산성 서비스입니다.
          할 일, 일기, 여행 일정, 구글 캘린더 연동 기능을 제공합니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">2. 이용 조건</h2>
        <ul class="list-disc pl-6 space-y-2 text-slate-700 text-sm leading-7">
          <li>서비스는 Google 계정이 있는 누구나 이용할 수 있습니다.</li>
          <li>타인의 정보를 도용하거나 서비스를 악용하는 행위는 금지됩니다.</li>
          <li>서비스의 안정적인 운영을 방해하는 행위는 금지됩니다.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="section-title">3. 서비스 변경 및 중단</h2>
        <p class="body-text">
          서비스는 운영상의 이유로 사전 고지 없이 변경되거나 중단될 수 있습니다.
          서비스 중단 시 사용자 데이터는 요청에 따라 제공하거나 삭제합니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">4. 책임 제한</h2>
        <p class="body-text">
          서비스는 사용자가 입력한 데이터의 손실, 서비스 중단으로 인한 손해에 대해
          법적 책임을 지지 않습니다. 중요한 데이터는 별도로 백업하시기 바랍니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">5. 문의</h2>
        <p class="body-text">
          서비스 관련 문의는 아래 이메일로 연락해 주세요.<br />
          <a href="mailto:jellyznet@gmail.com" class="text-blue-600 underline">jellyznet@gmail.com</a>
        </p>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: '이용약관 | woojooverse',
  description: 'woojooverse 이용약관',
})
</script>

<style scoped>
.section-title {
  @apply text-lg font-bold text-white mb-3;
}
.body-text {
  @apply text-sm leading-7 text-slate-400;
}
ul li {
  color: rgb(148 163 184);
}
a {
  color: #60a5fa;
}
</style>
