<template>
    <aside class="drawer-side z-10">
        <label for="my-drawer" class="drawer-overlay"></label>
        <!-- sidebar menu -->
        <nav class="flex min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10">
            <div class="mx-4 flex items-center gap-2 font-black">
                <img src="../../public/assets/images/ddsp_logo.png" width="50%">
                WithOn9
            </div>
            <ul class="menu">

                <div class="divider divider-start">로드업GPT</div>
                <li>
                    <NuxtLink exact-active-class="active" to="/openai/chat">
                        <svg data-src="https://unpkg.com/heroicons/20/solid/chat-bubble-left-right.svg"
                            class="h-5 w-5"></svg>
                        로드업GPT chat
                    </NuxtLink>
                    <NuxtLink exact-active-class="active" to="/openai/chat-vision">
                        <svg data-src="https://unpkg.com/heroicons/20/solid/chat-bubble-left-right.svg"
                            class="h-5 w-5"></svg>
                        로드업GPT chat-vision
                    </NuxtLink>
                </li>
                <div class="divider divider-start">로드업GPT Chart</div>
                <li>
                    <details>
                        <summary>
                            <svg data-src="https://unpkg.com/heroicons/20/solid/squares-2x2.svg" class="h-5 w-5"></svg>
                            Echarts example
                        </summary>
                        <ul>
                            <li>
                                <NuxtLink exact-active-class="active" to="/echarts/bar">
                                    bar
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink exact-active-class="active" to="/echarts/pie">
                                    pie
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink exact-active-class="active" to="/echarts/connect">
                                    connect
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink exact-active-class="active" to="/echarts/map">
                                    map
                                </NuxtLink>
                            </li>
                        </ul>
                    </details>
                </li>
                <p v-if="loginInfo">
                <div class="divider divider-start"> DDSP 관리자 </div>
                <li>
                    <NuxtLink v-if="loginInfo" to="/user-data-all">
                        <svg data-src="https://unpkg.com/heroicons/20/solid/user.svg" class="h-5 w-5"></svg>
                        회원관리
                    </NuxtLink>
                    <NuxtLink v-if="!loginInfo" to="/users/login">
                        <svg data-src="https://unpkg.com/heroicons/20/solid/user.svg" class="h-5 w-5"></svg>
                        회원관리
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/service/list">
                        <svg data-src="https://unpkg.com/heroicons/20/solid/credit-card.svg" class="h-5 w-5"></svg>
                        서비스관리 
                    </NuxtLink>
                </li>
            </p>
                <!-- <li>
                    <details>
                        <summary>
                            <svg data-src="https://unpkg.com/heroicons/20/solid/adjustments-vertical.svg"
                                class="h-5 w-5"></svg>
                            Settings
                        </summary>
                        <ul>
                            <li><a>General</a></li>
                            <li><a>Themes</a></li>
                            <li><a>Routes</a></li>
                            <li><a>Comments</a></li>
                            <li><a>Media</a></li>
                            <li><a>Roles</a></li>
                            <li><a>Merchants</a></li>
                            <li>
                                <a>Tools</a>
                                <ul>
                                    <li><a>Files</a></li>
                                    <li><a>Scripts</a></li>
                                    <li><a>Suggestions</a></li>
                                </ul>
                            </li>
                            <li><a>Databases</a></li>
                            <li><a>Gateways</a></li>
                            <li><a>Plugins</a></li>
                            <li><a>API</a></li>
                            <li><a>Support</a></li>
                        </ul>
                    </details>
                </li> -->
                <div class="divider divider-end"></div>
            </ul>
            <label class="flex cursor-pointer gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path
                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
                <input type="checkbox" value="synthwave" class="toggle theme-controller toggle-sm" />
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </label>
        </nav>
        <!-- /sidebar menu -->
    </aside>
</template>

<script setup>
const loginInfo = typeof window !== 'undefined' ? sessionStorage.getItem('DDSP_AT') : null;
</script>


<style>
body{
    font-family: 'Pretendard-Regular';
}
@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
</style>