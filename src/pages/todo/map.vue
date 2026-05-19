<template>
  <section class="min-h-screen bg-slate-50">
    <!-- Top Nav -->
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white font-black">
            D
          </div>
          <div class="text-sm font-bold text-slate-900">DOTSPRING</div>
        </div>

        <nav class="flex items-center gap-8">
          <button class="nav-item" :class="activeTop==='map' && 'nav-active'" @click="activeTop='map'">Map</button>
          <button class="nav-item" :class="activeTop==='buyer' && 'nav-active'" @click="activeTop='buyer'">Buyer</button>
          <button class="nav-item" :class="activeTop==='order' && 'nav-active'" @click="activeTop='order'">Order</button>
        </nav>

        <div class="flex items-center gap-2">
          <button class="btn-login">Login</button>
          <button class="btn-join">Join</button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="mx-auto w-full max-w-6xl px-4 py-8">
      <!-- Tabs + Right selector -->
      <div class="mb-4 flex items-center justify-between gap-3">
        <div class="seg">
          <button
            class="seg-btn"
            :class="category==='Cosmetics' ? 'seg-on' : 'seg-off'"
            @click="category='Cosmetics'"
          >
            Cosmetics
          </button>
          <button
            class="seg-btn"
            :class="category==='Foods' ? 'seg-on' : 'seg-off'"
            @click="category='Foods'"
          >
            Foods
          </button>
        </div>

        <select v-model="selectedId" class="input h-11 w-[260px]">
          <option v-for="s in filteredStores" :key="s.id" :value="s.id">
            {{ s.title }}
          </option>
        </select>
      </div>

      <!-- 2-column layout -->
      <div class="grid gap-4 lg:grid-cols-[1fr_360px]">
        <!-- Map Area -->
        <div class="card relative overflow-hidden">
          <!-- Map placeholder -->
          <div class="map-surface">
            <!-- Fake marker -->
            <button
              class="marker"
              :style="{ left: '62%', top: '56%' }"
              @click="showBubble = !showBubble"
              aria-label="marker"
            />
            <!-- Info bubble -->
            <div v-if="showBubble" class="bubble">
              <div class="text-xs font-semibold text-slate-500">{{ category }}</div>
              <div class="mt-1 text-base font-black text-slate-900">{{ activeStore.title }}</div>
              <div class="mt-1 text-sm text-slate-600">{{ activeStore.address }}</div>
            </div>
          </div>
        </div>

        <!-- Right Card -->
        <aside class="card p-6">
          <div class="flex items-center justify-between">
            <div class="text-sm font-bold text-emerald-700">{{ category }}</div>
            <button class="icon-btn" title="close">✕</button>
          </div>

          <h2 class="mt-2 text-3xl font-black leading-tight text-slate-900">
            {{ activeStore.title }}
          </h2>

          <p class="mt-3 text-sm text-slate-700">
            {{ activeStore.address }}
          </p>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="label">Email :</span>
              <a class="link" :href="`mailto:${activeStore.email}`">{{ activeStore.email }}</a>
            </div>
            <div class="flex items-center gap-2">
              <span class="label">Tel :</span>
              <a class="link" :href="`tel:${activeStore.phone}`">{{ activeStore.phone }}</a>
            </div>
          </div>

          <button class="btn-contact mt-6 w-full" @click="openContact(activeStore)">
            Contact
          </button>

          <!-- floating quick icons (right side) -->
          <div class="fixed right-6 top-40 z-40 hidden flex-col gap-3 lg:flex">
            <button class="fab">★</button>
            <button class="fab">✉︎</button>
            <button class="fab">⤴︎</button>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type Store = {
  id: string;
  category: "Cosmetics" | "Foods";
  title: string;
  address: string;
  email: string;
  phone: string;
};

const activeTop = ref<"map" | "buyer" | "order">("map");
const category = ref<"Cosmetics" | "Foods">("Cosmetics");
const showBubble = ref(true);

const stores = ref<Store[]>([
  {
    id: "dotspring-showroom",
    category: "Cosmetics",
    title: "DOTSPRING SHOWROOM",
    address: "6th St & S Vermont Ave, Los Angeles, CA",
    email: "hello@dotspring.us",
    phone: "213-000-0000",
  },
  {
    id: "foods-1",
    category: "Foods",
    title: "DOTSPRING FOODS HUB",
    address: "Downtown, Los Angeles, CA",
    email: "foods@dotspring.us",
    phone: "213-111-1111",
  },
]);

const filteredStores = computed(() =>
  stores.value.filter((s) => s.category === category.value)
);

const selectedId = ref(filteredStores.value[0]?.id ?? "");
watch(category, () => {
  selectedId.value = filteredStores.value[0]?.id ?? "";
  showBubble.value = true;
});

const activeStore = computed(() => {
  return (
    filteredStores.value.find((s) => s.id === selectedId.value) ??
    filteredStores.value[0]
  );
});

function openContact(s: Store) {
  alert(`Contact: ${s.title}\n${s.email}\n${s.phone}`);
}
</script>

<style scoped>
.card { @apply rounded-3xl bg-white shadow-sm ring-1 ring-slate-200; }

.nav-item { @apply relative text-sm font-bold text-slate-700 hover:text-slate-900; }
.nav-active { @apply text-slate-900; }
.nav-active::after {
  content: "";
  @apply absolute left-1/2 top-[26px] h-[3px] w-10 -translate-x-1/2 rounded-full bg-rose-500;
}

.btn-login { @apply h-10 rounded-full bg-sky-400 px-5 text-sm font-bold text-white shadow-sm hover:opacity-95; }
.btn-join { @apply h-10 rounded-full bg-white px-5 text-sm font-bold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50; }

.seg { @apply inline-flex rounded-2xl bg-white p-1 ring-1 ring-slate-200 shadow-sm; }
.seg-btn { @apply h-11 min-w-[150px] rounded-xl text-sm font-bold transition; }
.seg-on { @apply bg-emerald-700 text-white shadow; }
.seg-off { @apply bg-white text-slate-700 hover:bg-slate-50; }

.input { @apply rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100; }

.map-surface {
  @apply relative h-[520px] w-full;
  background:
    radial-gradient(1200px 600px at 60% 55%, rgba(0,0,0,0.05), transparent 60%),
    linear-gradient(180deg, #f8fafc, #eef2f7);
}

.marker {
  @apply absolute h-12 w-12 -translate-x-1/2 -translate-y-full rounded-full bg-orange-500 shadow-lg;
}
.marker::after{
  content:"";
  @apply absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80;
}
.marker::before{
  content:"";
  @apply absolute left-1/2 bottom-[-14px] h-0 w-0 -translate-x-1/2;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 16px solid rgb(249 115 22);
}

.bubble {
  @apply absolute left-[46%] top-[34%] w-[280px] rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-slate-200;
}

.label { @apply w-16 text-slate-500 font-semibold; }
.link { @apply font-bold text-sky-600 hover:underline; }

.btn-contact { @apply h-12 rounded-2xl bg-emerald-700 text-white font-black shadow hover:opacity-95; }

.icon-btn { @apply grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50; }

.fab { @apply grid h-12 w-12 place-items-center rounded-full bg-rose-600 text-white shadow-lg; }
</style>