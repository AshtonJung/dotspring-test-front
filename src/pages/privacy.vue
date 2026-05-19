<template>
  <div class="min-h-screen bg-[#0f172a]">
    <div class="mx-auto max-w-3xl px-6 py-16">

      <h1 class="text-3xl font-bold text-white mb-2">개인정보처리방침</h1>
      <p class="text-sm text-slate-500 mb-12">최종 업데이트: 2026년 5월 17일</p>

      <section class="mb-10">
        <h2 class="section-title">1. 개요</h2>
        <p class="body-text">
          woojooverse(이하 "서비스")는 사용자의 개인정보를 소중히 여기며, 관련 법령을 준수합니다.
          본 방침은 서비스가 수집하는 정보의 종류, 이용 목적, 보관 방법 및 사용자의 권리에 대해 설명합니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">2. 수집하는 정보</h2>
        <p class="body-text mb-4">서비스는 Google 계정 로그인을 통해 다음 정보를 수집합니다.</p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700 text-sm leading-7">
          <li><strong>기본 계정 정보</strong>: 이름, 이메일 주소, 프로필 사진 (Google 계정 기본 정보)</li>
          <li><strong>Google 캘린더 데이터</strong>: 사용자가 허용한 범위 내에서 캘린더 일정을 조회하고 등록합니다.</li>
          <li><strong>서비스 이용 데이터</strong>: 할 일(Todo), 일기, 여행 일정 등 사용자가 직접 입력한 데이터</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="section-title">3. 정보의 이용 목적</h2>
        <p class="body-text mb-4">수집된 정보는 다음 목적으로만 사용됩니다.</p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700 text-sm leading-7">
          <li>로그인 인증 및 회원 식별</li>
          <li>할 일, 일기, 여행 일정 등 개인 데이터 저장 및 동기화</li>
          <li>Google 캘린더 일정 조회 및 등록 (사용자 요청 시에만)</li>
          <li>서비스 품질 개선</li>
        </ul>
        <p class="body-text mt-4">
          수집된 정보는 제3자에게 판매하거나 마케팅 목적으로 사용하지 않습니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">4. Google API 데이터 사용</h2>
        <p class="body-text">
          woojooverse는 Google API를 통해 수집한 정보를
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener" class="text-blue-600 underline">
            Google API 서비스 사용자 데이터 정책
          </a>
          (제한적 사용 정책 포함)에 따라 사용합니다.
          Google 계정에서 얻은 데이터는 서비스 제공 목적 외에 사용하지 않으며, 광고, 판매, 제3자 공유에 활용하지 않습니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">5. 데이터 보관 및 보안</h2>
        <ul class="list-disc pl-6 space-y-2 text-slate-700 text-sm leading-7">
          <li>사용자 데이터는 암호화된 데이터베이스에 안전하게 저장됩니다.</li>
          <li>비밀번호는 저장하지 않으며, Google OAuth를 통한 인증만 사용합니다.</li>
          <li>서비스를 더 이상 이용하지 않을 경우, 요청 시 모든 데이터를 삭제합니다.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="section-title">6. 제3자 공유</h2>
        <p class="body-text">
          서비스는 사용자의 개인정보를 제3자와 공유하지 않습니다.
          단, 법령에 의한 요구가 있는 경우에는 예외적으로 제공할 수 있습니다.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="section-title">7. 사용자의 권리</h2>
        <ul class="list-disc pl-6 space-y-2 text-slate-700 text-sm leading-7">
          <li>언제든지 Google 계정의 권한을 철회할 수 있습니다.</li>
          <li>서비스에 저장된 데이터 삭제를 요청할 수 있습니다.</li>
          <li>수집된 개인정보 열람을 요청할 수 있습니다.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="section-title">8. 문의</h2>
        <p class="body-text">
          개인정보 관련 문의 및 삭제 요청은 아래 이메일로 연락해 주세요.<br />
          <a href="mailto:jellyznet@gmail.com" class="text-blue-600 underline">jellyznet@gmail.com</a>
        </p>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: '개인정보처리방침 | woojooverse',
  description: 'woojooverse 개인정보처리방침',
})
</script>

<style scoped>
.section-title {
  @apply text-lg font-bold text-white mb-3;
}
.body-text {
  @apply text-sm leading-7 text-slate-400;
}
:deep(ul li), ul li {
  color: rgb(148 163 184);
}
a {
  color: #60a5fa;
}
</style>
