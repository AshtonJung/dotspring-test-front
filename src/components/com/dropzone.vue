<template>
    <div class="dropzone" ref="dropzoneRef">
        <span v-if="!files.length"></span>
        <ul v-else>
            <li v-for="(file, index) in files" :key="index">
            {{ file.name }} - {{ file.size }} bytes
            </li>
        </ul>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import Dropzone from 'dropzone';

const dropzoneRef = ref(null);
const files = ref([]);

onMounted(() => {
    const dropzoneElement = dropzoneRef.value;
    const options = {
        url: '/api/chat-vision', // 업로드를 처리할 서버 엔드포인트
        autoProcessQueue: true, // 자동으로 파일을 업로드하지 않음
        acceptedFiles: ".pdf,.doc,.docx",
        maxFiles: 1,
        maxFileSize: 100, // MB
        dictDefaultMessage: "파일을 여기에 놓거나 클릭하여 업로드 가능",
        dictMaxFilesExceeded: "You can not upload any more files.",
        dictInvalidFileType: "지원하지 않는 데이터 형식입니다.",

        init() {
            this.on('addedfile', function (file) {
                console.log("added file", file);
            });

            this.on('sending', function (file, xhr, formData) {
                console.log('보내는중');
            });

            this.on('success', function (file, responseText) {
                console.log("success");
                this.removeFile(file);
            });

            this.on('error', function (file, errorMessage) {
                console.log("upload error response : ", errorMessage);
                this.removeFile(file);
            });

            this.on('removedfile', function (file) {
                const index = files.value.indexOf(file);
                if (index !== -1) {
                    files.value.splice(index, 1);
                }
            });
        },
    };
    const dropzone = new Dropzone(dropzoneElement, options);
    dropzoneRef.value = dropzone;
});
</script>
  
<style>
.dropzone {
    border: 2px dashed #0087f7;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
}


</style>
  