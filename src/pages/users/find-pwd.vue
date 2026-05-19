<template>
    
<div class="container flex flex-col m-auto w-1/2 border-2 rounded-md shadow-md mt-40 p-4">
    <div class="basis-1/4 flex-1 text-center">
        <span class="block font-bold text-lg">비밀번호 재설정</span>
    </div>
    <form>
    <div class="basis-3/4 flex-1 mt-8 flex flex-row">
        <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle">아이디</span></div>
        <div class="basis-2/4">
            <input type="text" class="border-2 w-full h-10 p-1 rounded-md" v-model="form.user_id" placeholder="아이디를 입력하세요" required>
        </div>
        <div class="basis-1/4 w-1/4 ml-2"></div>
    </div>
    
    <div class="basis-3/4 flex-1 mt-5 flex flex-row">
        <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle m-auto">이메일</span></div>
        <div class="basis-2/4">
            <input type="text" class="border-2 w-full h-10 p-1 rounded-md" v-model="form.user_email" placeholder="이메일을 입력하세요" required>
        </div>
        <div class="basis-1/4 w-1/6 ml-2 pr-11">
            <button class="border-gray-500 w-full h-full rounded-md bg-slate-500 text-white" @click="sendVerificationEmail" :disabled="disableEmailButton">인증번호 발송</button>
        </div>
    </div>
    <div class="basis-3/4 flex-1 mt-5 flex flex-row" v-if="showVerificationInput">
        <div class="basis-1/4 flex-1 text-center pt-1"></div>
        <div class="basis-2/4">
            <input type="text" id="verification_code" class="border-2 w-2/4 h-10 p-1 rounded-md" v-model="form.verification_code" placeholder="인증번호" required>
            <button @click.prevent="verifyCode" class="border-gray-500 w-1/4 h-full rounded-md bg-slate-500 text-white ml-2">인증</button>
            <p v-if="verifiedError" class="text-red-500 text-xs mt-1">{{ verifiedError }}</p>
        </div>
        <div class="basis-1/4 w-1/6 ml-2 pr-11">
        </div>
    </div>
    
    <div class="basis-3/4 flex-1 mt-8 flex flex-row" v-if="completeVerification">
        <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle">비밀번호</span></div>
        <div class="basis-2/4">
            <input type="password" class="border-2 w-full h-10 p-1 rounded-md" v-model="form.user_pwd" placeholder="새로운 비밀번호" @keyup="validatePassword" required>
            <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
        </div>
        <div class="basis-1/4 w-1/4 ml-2"></div>
    </div>
    <div class="basis-3/4 flex-1 mt-8 flex flex-row"  v-if="completeVerification">
        <div class="basis-1/4 flex-1 text-center pt-1"><span class="align-middle">비밀번호 확인</span></div>
        <div class="basis-2/4">
            <input type="password" class="border-2 w-full h-10 p-1 rounded-md" v-model="checkPasswordVal" placeholder="새로운 비밀번호 확인" @keyup="checkPassword" required>
            <p v-if="checkPasswordError" class="text-red-500 text-xs mt-1">{{ checkPasswordError }}</p>
        </div>
        <div class="basis-1/4 w-1/4 ml-2"></div>
    </div>
    <div class="basis-3/4 flex-1 mt-10 flex flex-row">
        <div class="basis-1/2 flex-1 text-center ">
            <button class="btn-square bg-indigo-500 rounded-md w-3/4 text-white" @click.prevent="updatePassword">재설정</button>
        </div>
        <div class="basis-1/2 flex-1 text-center">
            <NuxtLink to="/"><button class="btn-square text-white bg-gray-500 rounded-md w-3/4">취소</button></NuxtLink>
        </div>
    </div>
</form>

</div>


</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'login'
})
const form = ref({
    user_id: '',
    user_email: '',
    user_pwd: '',
})

const checkPasswordVal = ref('')
const passwordError = ref('');
const checkPasswordError = ref('');
const disableEmailButton = ref(false);
const showVerificationInput = ref(false);
const completeVerification = ref(false);
const verifiedError = ref('')

const router = useRouter()

const validatePassword = async () => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
  if (!passwordRegex.test(form.value.user_pwd)) {
    passwordError.value = '비밀번호는 최소 8자 이상 15자 이하이며 영문, 숫자, 특수문자를 각각 최소 1개 이상 포함하여 작성해주세요.'
  } else {
    passwordError.value = ''
  }
}

const checkPassword = async () => {
  const originPassword = form.value.user_pwd;
  console.log(originPassword)
  if (!(originPassword === checkPasswordVal.value)) {
    checkPasswordError.value = '비밀번호가 일치하지 않습니다. 다시 확인해주세요.';
  } else {
    checkPasswordError.value = '';
  }
}

const sendVerificationEmail = async () => {
  disableEmailButton.value = true
  setTimeout(() => {
    disableEmailButton.value = false
  }, 20000) // 20초 후에 버튼을 다시 활성화합니다.

  try {
    const formData = new URLSearchParams();
    formData.append('user_id', form.value.user_id);
    formData.append('user_email', form.value.user_email);

    const response = await fetch('https://yjyoon-fastapi-template-dev.k8s.dlab.kr:1443/v1/core/mgmt/email_celtify_request', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      throw new Error('인증번호 발송에 실패했습니다.')
    }


    showVerificationInput.value = true
  } catch (error) {
    console.error(error)
  }
}

const verifyCode = async () => {
    try {
    const formData = new URLSearchParams()
    formData.append('user_id', form.value.user_id)
    formData.append('user_email', form.value.user_email)
    formData.append('verification_code', form.value.verification_code)

    const response = await fetch('https://yjyoon-fastapi-template-dev.k8s.dlab.kr:1443/v1/core/mgmt/email_celtify_check', {
        method: 'POST',
        body: formData,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    const data = await response.json()

    if (!data.result) {
        verifiedError.value = "인증번호 인증에 실패했습니다. 코드를 확인해주세요.";
    } else {
        verifiedError.value = "";
        showVerificationInput.value = false;
        completeVerification.value = true;
    }


    } catch (error) {
        verifiedError.value = "인증번호 인증에 실패했습니다. 코드를 확인해주세요.";
        console.error(error)
    }
}

const updatePassword = async () => {
    try {
        const response = await fetch(`https://yjyoon-fastapi-template-dev.k8s.dlab.kr:1443/v1/mgmt/user/find-pwd?user_id=${form.value.user_id}&user_email=${form.value.user_email}&new_password=${form.value.user_pwd}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const result = await response.json();
        if(result.msg) {
            if(confirm(result.msg)) {
                router.push('/users/login');
            }
        } else if(result.detail) {
            alert(result.detail);
            form.value.user_pwd = '';
            
        }
    } catch {
        console.log('error')
    }
}

</script>

<style>
    
</style>