<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import logoImage from "@/assets/logo/logo.png";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
const { user, isAuthed, hydrate, logout } = useAuth();

onMounted(() => {
  if (typeof window !== "undefined") {
    hydrate();
  }
});

const getToken = () => {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("DDSP_AT") || "";
};

const decodeRoleFromToken = () => {
  try {
    const token = getToken();
    if (!token) return "";

    const parts = token.split(".");
    if (parts.length < 2) return "";

    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);

    const payload = JSON.parse(
      decodeURIComponent(
        Array.prototype.map
          .call(json, (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );

    return String(payload?.role || payload?.user_role || "").trim().toUpperCase();
  } catch {
    return "";
  }
};

const nameText = computed(() => {
  return user.value?.name || user.value?.username || "사용자";
});

const companyText = computed(() => {
  return user.value?.company_name || user.value?.companyName || "";
});

const roleText = computed(() => {
  const roleFromUser = String(user.value?.role || "").trim().toUpperCase();
  if (roleFromUser) return roleFromUser;
  return decodeRoleFromToken();
});

const isAdmin = computed(() => roleText.value === "ADMIN");

const isMenuActive = (path: string) => {
  const currentPath = route.path;

  if (path === "/w9/list") {
    return currentPath === "/w9/list" || /^\/w9\/\d+$/.test(currentPath);
  }

  if (path === "/w9/input") {
    return currentPath === "/w9/input";
  }

  if (path === "/w9/notices") {
    return currentPath.startsWith("/w9/notices");
  }

  if (path === "/w9/members") {
    return currentPath.startsWith("/w9/members");
  }

  if (path === "/w9/mypage") {
    return currentPath.startsWith("/w9/mypage");
  }

  return currentPath === path;
};

const go = (path: string) => {
  router.push(path);
};

const goLogin = () => {
  const redirect = route.fullPath || "/w9/list";
  router.push(`/users/login?redirect=${encodeURIComponent(redirect)}`);
};

const onLogout = async () => {
  await logout();
  await router.push("/users/login");
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <!-- 로고 -->
      <button class="flex items-center gap-2" @click="go('/')">
        <img :src="logoImage" alt="logo" class="h-12 w-auto" />
        <span class="text-lg font-black tracking-widest text-slate-900">WOOJOOVERSE</span>
      </button>

      <!-- 메뉴 -->
      <nav v-if="isAuthed" class="flex items-center gap-6 text-sm font-semibold text-slate-700">
        <button
          class="menu-link"
          :class="{ active: isMenuActive('/w9/list') }"
          @click="go('/w9/list')"
        >
          업무요청
        </button>

        <!--<button
          class="menu-link"
          :class="{ active: isMenuActive('/w9/input') }"
          @click="go('/w9/input')"
        >
          요청등록
        </button>-->

        <button
          class="menu-link"
          :class="{ active: isMenuActive('/w9/notices') }"
          @click="go('/w9/notices')"
        >
          공지사항
        </button>

        <button
          class="menu-link"
          :class="{ active: isMenuActive('/w9/mypage') }"
          @click="go('/w9/mypage')"
        >
          마이페이지
        </button>

        <button
          v-if="isAdmin"
          class="menu-link"
          :class="{ active: isMenuActive('/w9/members') }"
          @click="go('/w9/members')"
        >
          회원관리
        </button>
      </nav>

      <!-- 로그인 상태 -->
      <div class="text-sm">
        <div v-if="!isAuthed" class="flex items-center gap-3">
          <button
            class="font-semibold text-slate-700 hover:text-slate-900"
            @click="goLogin"
          >
            로그인
          </button>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="font-semibold text-slate-800">
            {{ nameText }}님
            /
            <span
              v-if="companyText"
              class="font-medium text-slate-400"
            >
              {{ companyText }}
            </span>

            <span
              v-if="roleText"
              class="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
            >
              {{ roleText }}
            </span>
          </div>

          <button
            class="px-2 py-2 border font-semibold text-rose-600 hover:text-rose-700"
            @click="onLogout"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.menu-link {
  position: relative;
  color: rgb(51 65 85);
  transition: color 0.2s ease;
  padding-bottom: 2px;
}

.menu-link:hover {
  color: rgb(15 23 42);
}

.menu-link.active {
  color: rgb(15 23 42);
}

.menu-link.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  border-radius: 9999px;
  background-color: rgb(15 23 42);
}
</style>