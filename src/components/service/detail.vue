<template>
    <div class="text-black text-2xl font-bold">{{ selected_service.svc_name || "-" }}</div>
    <div class="divider divider-neutral"></div>

    <div class="px-20">

        <!-- 서비스 상세 정보 테이블-->
        <table class="table table-lg md:table-fixed ">
            <tbody>
                <tr>
                    <th class="w-1/6">UID</th>
                    <td>{{ selected_service.svc_uid || "-" }}</td>
                    <th class="w-1/6">서비스명</th>
                    <td>{{ selected_service.svc_name || "-" }}</td>

                </tr>
                <tr>
                    <th>회원수</th>
                    <!-- <td>{{ selected_service.svc_user_number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "-" }} -->
                    <td>
                        회원수
                    </td>

                    <th>등록일</th>
                    <td>{{ formatDate(selected_service.crt_time) }}</td>
                </tr>
                <tr>
                    <th>서비스 URL</th>
                    <td> <a :href="selected_service.svc_url">{{ selected_service.svc_url || "-" }}</a></td>

                    <th>차단</th>
                    <td>차단</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="divider"></div>
    <div class="p-6">
        <div class="p-2">
            ■ 서비스 설명
            <div class="p-2" v-html="selected_service.svc_description.replaceAll('\r', '<br />') || '-'"></div>
        </div>
        <div class="p-2">
            ■ 서비스 메모
            <div class="p-2" v-html="selected_service.svc_memo.replaceAll('\r', '<br />') || '-'"></div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

// list로부터 전달된 props
let props = defineProps(['selected_service'])
const selected_service = ref(props.selected_service);

// 선택된 service 변경 감지
watch(props, () => {
    selected_service.value = props.selected_service
})

// YYYY-MM-DDTHH:mm:ss.sss 형식 데이터를 YYYY-MM-DD HH:mm:ss 형식으로 변환
const formatDate = (date) => {
    return date == null ? "-" : `${date.slice(0, 10)} ${date.slice(11, 19)}`
}

</script>