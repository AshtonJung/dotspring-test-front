<template>
    
<div class="container flex flex-col m-auto w-1/3 border-2 rounded-md shadow-md mt-40 p-4">
    <div class="basis-1/4 flex-1 text-center">
        <span class="block font-bold text-lg">아이디 찾기</span>
        <span class="text-sm">이름과 생년월일, 이메일로 아이디를 찾을 수 있습니다.</span>
    </div>
    <div v-if="!findResult" class="inputContainer">
        <div class="basis-3/4 flex-1 mt-10 flex flex-row">
            <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle">이름</span></div>
            <div class="basis-3/4">
                <input type="text" class="border-2 w-4/5 h-10 p-1 rounded-md" v-model="user_name" placeholder="이름을 입력하세요" required>
            </div>
        </div>
        <div class="basis-3/4 flex-1 mt-5 flex flex-row">
            <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle">생년월일</span></div>
            <div class="basis-3/4">
                <input type="text" class="border-2 w-4/5 h-10 p-1 rounded-md" v-model="user_birth" placeholder="YYYYMMDD 형식으로 입력하세요." required>
            </div>
        </div>
        <div class="basis-3/4 flex-1 mt-5 flex flex-row">
            <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle m-auto">이메일</span></div>
            <div class="basis-3/4">
                <input type="text" class="border-2 w-4/5 h-10 p-1 rounded-md" v-model="user_email" placeholder="이메일을 입력하세요" required>
            </div>
        </div>
        <div class="basis-3/4 flex-1 mt-10 flex flex-row">
            <div class="basis-1/2 flex-1 text-center ">
                <button class="btn-square bg-indigo-500 rounded-md w-3/4 text-white" @click="findId">찾기</button>
            </div>
            <div class="basis-1/2 flex-1 text-center">
                <button class="btn-square text-white bg-gray-500 rounded-md w-3/4"><a href="/users/login">취소</a></button>
            </div>
        </div>
    </div>  

    <div v-if="findResult" class="flex flex-col m-auto mt-5 w-full rounded-md p-3 ">
        <div class="flex-1 w-full text-center text-red-500 font-bold">
        {{ findResult }}
        </div>
        <div class="flex-1 flex flex-row w-full text-center p-5">
            <div class="basis-1/2 text-center">
                <button class="btn-square text-white bg-indigo-500 rounded-md w-3/4"><a href="/users/find-pwd">비밀번호 찾기</a></button>
            </div>
            <div class="basis-1/2 text-center">
                <button class="btn-square text-white bg-gray-500 rounded-md w-3/4"><a href="/users/login">로그인</a></button>
            </div>
        </div>
    </div>
    <div v-if="findResultError" class="flex flex-col m-auto mt-5 w-full rounded-md p-3 ">
        <div class="flex-1 w-full text-center text-red-500 font-bold">
        {{ findResultError }}
        </div>
    </div>
</div>

</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'login'
})

const findResult = ref('');
const findResultError = ref('');
const user_name = ref('');
const user_birth = ref('');
const user_email = ref('');

const findId = async () => {
    try {
        const response = await fetch(`https://yjyoon-fastapi-template-dev.k8s.dlab.kr:1443/v1/mgmt/user/find-id?user_name=${user_name.value}&user_email=${user_email.value}&user_birth=${user_birth.value}`, {
            method: 'POST',
            headers: {
                'Content_Type':'application/json'
            }
        })

        const data = await response.json();
        console.log(data)
        if(data.msg){
            findResult.value = data.msg;
            findResultError.value = '';
        } else {
            findResultError.value = data.detail;
            user_name.value = '';
            user_birth.value = '';
            user_email.value = '';
        }
        
    } catch {
        console.log('error')
    }
    
}

</script>

<style>
    
</style>