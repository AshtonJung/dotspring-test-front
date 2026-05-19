<template>
    <form @submit="upload">
        <div class="space-y-12 ">

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div class="sm:col-span-4">
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">서비스명</label>
                    <div class="mt-2">
                        <div
                            class="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md p-2 mb-2">
                            <input type="text" v-model="old_svc.svc_name"
                                class="block flex-1 border-0 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="서비스명을 입력해 주세요" required />
                        </div>
                    </div>
                </div>

                <div class="sm:col-span-4">
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">URL</label>
                    <div class="mt-2">
                        <div
                            class="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md p-2">
                            <input type="text" v-model="old_svc.svc_url"
                                class="block flex-1 border-0 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="URL을 입력해 주세요" required />
                        </div>
                    </div>
                </div>

                <div class="col-span-full">
                    <label for="about" class="block text-sm font-medium leading-6 text-gray-900">서비스 설명</label>
                    <div class="mt-2">
                        <textarea id="about" name="about" rows="3" v-model="old_svc.svc_description"
                            placeholder="서비스 설명을 입력해 주세요"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" />
                    </div>
                </div>

                <div class="col-span-full">
                    <label for="about" class="block text-sm font-medium leading-6 text-gray-900">서비스 메모</label>
                    <div class="mt-2">
                        <textarea id="about" name="about" rows="3" v-model="old_svc.svc_memo" placeholder="서비스 메모를 입력해 주세요"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" />
                    </div>
                </div>

            </div>

            <!-- 전달된 query가 있을 경우 수정, 아니라면 등록 -->
            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="button"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onclick="modal.showModal()">
                    {{ old_svc.svc_uid ? '수정' : '등록' }}</button>
                <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="goToList()">취소</button>

            </div>
        </div>

        <dialog id="modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <p> {{ old_svc.svc_uid ? '수정' : '등록' }}하시겠습니까?</p>
                <div class="modal-action">
                    <form method="dialog">
                      <button class="btn bg-slate-300 mr-2" @click="upload()">확인</button>
                      <button class="btn">취소</button>
                    </form>
                </div>
            </div>
        </dialog>

    </form>
</template>
<script setup>
import {api} from '@/composables/connect.js'

// 수정 시 props로 old_svc(기존 서비스 정보) 전달 
const props = defineProps(['old_svc']);
const old_svc = ref(props.old_svc ? props.old_svc : {});

// textarea의 개행 처리
onMounted(() => {
    old_svc.value.svc_memo = old_svc.value.svc_memo.replaceAll("<br />", "\n")
    old_svc.value.svc_description = old_svc.value.svc_description.replaceAll("<br />", "\n")
})


// 등록 또는 수정 처리
const upload = async () => {
    const svc = old_svc.value; 
    if (svc.svc_name && svc.svc_url) {
        try {
            if(svc.svc_memo){            
                svc.svc_memo = svc.svc_memo.replaceAll("\n", "\r\n");
            }
            
            if(svc.svc_description){            
                svc.svc_description = svc.svc_description.replaceAll("\n", "\r\n");
            }

            const data = await api(svc.svc_uid ? "PUT" : "POST", "/mgmt/services", old_svc.value);
            console.log(data)
            goToList();
        } catch (err) {
            console.log(err)
        }
    }
}

// 취소 버튼 누를 시 list 로 돌아가기 ($router가 URL만 변경되고 페이지 이동이 안됨)
const goToList = () => {
    location.href = '/service/list'
}
</script>   