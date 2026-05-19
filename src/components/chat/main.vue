<template>
   
    <main class="drawer-content relative">
        <div class="h-dvh">
          <div ref="chatContainer" class="w-full overflow-y-scroll px-56" style="height: 92vh;">
              <div v-for="(message, index) in messages" :key="index" :class="{ 'chat-end': message.sender === 'user', 'chat-start': message.sender === 'dlab' }"  class="chat">
                  <!-- <div class="chat-image avatar">
                      <div class="w-10 rounded-full">
                          <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                      </div>
                  </div> -->
                  <div class="chat-header font-bold text-lg">
                      {{ message.sender }}
                  </div>
                  <div ref="chatBubble" class="chat-bubble" v-html="message.text" v-on:click="contentClick">
                      
                  </div>
              </div>
              
          </div>
          
          <div class="w-full join">
            <div class="w-full flex p-3 bg-white">
                <input v-model="newMessage" @keyup.enter="sendMessage()" @keyup.right="console.log('asdf')" placeholder="메시지를 입력하세요..."  class="w-full input input-bordered border join-item">
                <button class="btn border join-item " v-on:click="sendMessage()">Send</button>
            </div>
          </div>
        </div>
        
    </main>
</template>

<script setup>
import { ref, watch} from 'vue';
import markdownit from 'markdown-it'

const md = markdownit({
  breaks: true
});

const messages = ref([
  { sender: 'user', text: 'vue3 composition api 예시를 하나 만들어줘' },
  { sender: 'dlab', text: md.render('Vue.js 3에서 Composition API를 사용하는 간단한 예시는 아래와 같습니다. 이 예시에서는 반응형으로 데이터를 다루고, 생명주기 훅을 사용하며, 계산된 속성을 정의합니다.\n\n```vue\n<template>\n  <div>\n    <h1>{{ title }}</h1>\n    <p>Computed reversed message: {{ reversedMessage }}</p>\n    <button @click="incrementCount">Count is: {{ count }}</button>\n  </div>\n</template>\n\n\x3Cscript>\nimport { ref, computed, onMounted } from \'vue\';\n\nexport default {\n  setup() {\n    // 반응형 데이터\n    const count = ref(0);\n    const message = ref(\'Hello Vue 3!\');\n    \n    // 계산된 속성\n    const reversedMessage = computed(() => {\n      return message.value.split(\'\').reverse().join(\'\');\n    });\n    \n    // 메서드\n    function incrementCount() {\n      count.value++;\n    }\n    \n    // 생명주기 훅\n    onMounted(() => {\n      console.log(\'Component is mounted!\');\n    });\n\n    // setup() 함수에서 반환된 객체는 템플릿에서 사용할 수 있는 모든 속성과 메서드를 포함한다.\n    return {\n      count,\n      message,\n      reversedMessage,\n      incrementCount\n    };\n  }\n};\n\x3C/script>\n```\n\n이 예시에서 `ref`를 사용하여 `count`와 `message`라는 반응형 참조를 생성합니다. `computed` 함수로 계산된 속성인 `reversedMessage`를 정의하여, `message`가 변경될 때마다 자동으로 업데이트됩니다. 또한, `setup()` 함수 내부에서 `onMounted` 훅을 사용하여 컴포넌트가 마운트될 때 콘솔에 메시지를 출력합니다. `incrementCount` 메서드는 버튼 클릭 시 `count`를 증가시키는 역할을 합니다.\n\n위 코드의 `setup()` 함수는 템플릿에서 사용하기 위해 필요한 모든 데이터와 메서드를 반환합니다. Vue 3의 Composition API 덕분에 관련 기능과 로직을 더욱 구조화되고 모듈화된 방식으로 조직할 수 있습니다.') },
]);

const newMessage = ref('');
const chatContainer = ref();
const chatBubble = ref();

const scrollChatToBottom = () => {
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
};

// messages 배열이 변경될때 채팅창을 가장 하단으로 이동
watch(messages, (newVal, oldVal) => {
  setTimeout(() => {
    scrollChatToBottom();
  }, 500);
}, {deep :true});

const chatApiCall = async (sendMsg) => {
  const { data: responseData } = await useFetch('http://localhost:8087/just_chat?model_name=gpt-4', {
    method: 'post',
    body: {
      "user_input": sendMsg
    }
  });

  return responseData
};

// chat api 호출 & 화면 출력
const chatCallAndDisplay = async (msg) => {
  // chat response
  const apiData = await chatApiCall(msg);
  let response = apiData.value.response; // 답변
  if( apiData.value.recommendation ) { // 추천항목이 있을시
    response += "\n***\n";
    apiData.value.recommendation.forEach((recommend)=> response += recommend + '\n');
  } 
  messages.value.push({ sender: 'dlab', text: md.render(response) });
};

// input 직접 입력하여 전송시
const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push({ sender: 'user', text: newMessage.value });
    const sendMsg = newMessage.value;
    newMessage.value = ''; // input 초기화
    chatCallAndDisplay(sendMsg);
  }
}; 


// 채팅 영역 클릭시 작동하는 함수
const contentClick = async (event) => {
  if(event.srcElement.parentElement.nodeName == 'OL' && event.target.nodeName == 'LI' ) {
    messages.value.push({ sender: 'user', text: event.target.innerText });
    chatCallAndDisplay(event.target.innerText);
  }

};

</script>
<style>
.chat-bubble > p:not(:last-child) {
  margin-bottom: 1.25rem;
}
.chat-bubble > p:not(:first-child) {
  margin-top: 1.25rem;
}


/* markdown css */
pre,code{font: Menlo, Monaco, "DejaVu Sans Mono", "Bitstream Vera Sans Mono",monospace;}
pre {
	 margin:1em 0;
	 /* font-size:12px; */
	 background-color:#ffffff;
	 border:1px solid #ddd;
	 padding:5px;
	 line-height:1.5em;
	 color:#444;
	 overflow:auto;
	 /* -webkit-box-shadow:rgba(0,0,0,0.07) 0 1px 2px inset; */
	 -webkit-border-radius:3px;
	 -moz-border-radius:3px;border-radius:3px;
}
pre code {
	 padding:0;
	 /* font-size:12px; */
	 /* background-color:#eee; */
	 border:none;
}
/* code {
	 font-size:12px;
	 background-color:#f8f8ff;
	 color:#e8ffd5;
	 padding:0 .2em;
	 border:1px solid #dedede;
} */
</style>