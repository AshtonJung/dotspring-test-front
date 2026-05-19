<template>

  <!-- 검색 -->
  <div class="flex justify-center">

    <!-- 검색 후 검색창 가리기, 검색 정보 보이기 -->

    <div v-if="!isSearching" class="join">
      <div>
        <div>
          <input class="input input-bordered join-item" placeholder="" v-model="searchWord" />
        </div>
      </div>
      <select v-model="searchFilter" class="select select-bordered join-item">
        <option>아이디</option>
        <option>이름</option>
      </select>
      <div class="indicator">
        <button class="btn join-item bg-slate-300" @click="search()">검색</button>
      </div>
    </div>

    <div v-else class="text-center grid gap-2">
      <p>"{{ searchWord }}" 의 검색 결과입니다.</p>
      <button class="btn btn-outline m-2 text-sm" @click="resetSearch()" @keydown.enter.prevent="handleEnter">검색
        초기화</button>
    </div>
  </div>

  <!-- 총 데이터 수 -->
  <p class="mx-10 my-4">{{ `총 ${total_user}건` }}</p>

  <!-- 필터링, API 없음. -->
  <div class="mx-10 my-4 flex justify-between">

    <!-- 버튼 필터링 -->
    <div class="space-x-2">
      <input class="btn btn-filter" type="radio" aria-label="전체" name="radio" v-model="filter" value="전체" checked />
      <input class="btn btn-filter" type="radio" aria-label="일반" name="radio" v-model="filter" value="일반" />
      <input class="btn btn-filter" type="radio" aria-label="탈퇴" name="radio" v-model="filter" value="탈퇴" />
      <input class="btn btn-filter" type="radio" aria-label="차단" name="radio" v-model="filter" value="차단" />
      <input class="btn btn-filter" type="radio" aria-label="관리자" name="radio" v-model="filter" value="관리자" />
    </div>

    <!-- 타입 선택 필터링 -->
    <div class="flex items-center">
      <div class="m-2 label-text">
        회원 타입 :
      </div>
      <select v-model="selectedType" class="select select-bordered">
        <option selected>전체</option>
        <option>U</option>
        <option>C</option>
        <!-- <option>F</option>
           <option>E</option> -->
      </select>
    </div>
  </div>

  <!-- 사용자 리스트 -->
  <div class="overflow-x-auto bg-white p-6 rounded-lg shadow-md mx-10 my-2">
    <table class="table w-full table-compact text-gray-600 md:table-fixed text-center">
      <thead>
        <tr>
          <th>번호</th>
          <th>서비스</th>
          <th>이름</th>
          <th>회원 타입</th>
          <th class="w-2/12">id / uid</th>
          <th>생년월일</th>
          <th>성별</th>
          <th class="w-2/12">등록일</th>
          <th>탈퇴 / 차단</th>
          <th>권한</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users.value" :key="user.user_id"
          :class="[{ 'bg-base-200': isClicked && selected_user.user_id == user.user_id }, 'text-gray-700']"
          @click="ShowUserDetail(user)">
          <td>{{ total_user - (index + page_limit * (current_page - 1)) }}</td>
          <td> {{ user.user_service || "-" }} </td>
          <td>{{ user.user_name }}</td>
          <td>{{ user.user_type || "-" }}</td>
          <td>{{ user.user_id || "-" }} / {{ user.user_uid || "-" }}</td>
          <td>{{ user.user_birth || "-" }}</td>
          <td>{{ user.user_gender || "-" }}</td>
          <td>{{ formatDate(user.crt_time) }}
          </td>
          <td>{{ user.wd_yn }} / {{ user.t_user_block || "N" }}</td>
          <td> {{ user.user_auth || "-" }} </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 페이지네이션 -->
  <div class="join flex justify-center my-6">
    <button class="join-item btn" @click="changePage(1)">«</button>
    <button class="join-item btn" @click="changePage(current_page - 1)">‹</button>
    <template v-if="total_page <= 10">
      <template v-for="p in total_page" :key="p">
        <button class="join-item btn" :class="{ 'btn-active': current_page == p }" @click="changePage(p)">{{ p }}</button>
      </template>
    </template>
    <template v-else>
      <template v-if="current_page <= total_page - 9">
        <template v-for="p in 10" :key="p">
          <button class="join-item btn" :class="{ 'btn-active': current_page == current_page + p - 1 }"
            @click="changePage(current_page + p - 1)">{{ current_page + p - 1 }}</button>
        </template>
      </template>
      <template v-else>
        <template v-for="p in total_page - current_page + 1" :key="p">
          <button class="join-item btn" :class="{ 'btn-active': current_page == p + current_page - 1 }"
            @click="changePage(p + current_page - 1)">{{ p + current_page - 1 }}</button>
        </template>
      </template>
    </template>
    <button class="join-item btn" @click="changePage(current_page + 1)">›</button>
    <button class="join-item btn" @click="changePage(total_page)">»</button>
  </div>

    <!-- 사용자 등록 버튼 -->
  <div class="flex justify-end m-10">
    <a href='/users/join-user' class="btn btn-neutral btn-wide">등록</a>
  </div>

  <!-- 상세 정보 조회 -->
  <div v-if="isClicked" class="m-10 overflow-x-auto">
    <div class="text-black text-2xl font-bold">{{ selected_user.user_name || "-" }}</div>
    <div class="divider divider-neutral"></div>
    <table class="table table-sm md:table-fixed ">
      <tbody>
        <tr>
          <th>id</th>
          <td>{{ selected_user.user_id || "-" }}</td>
          <th>서비스</th>
          <td>{{ selected_user.user_service || "-" }}</td>

        </tr>
        <tr>
          <th>이름</th>
          <td>{{ selected_user.user_name }}</td>

          <th>UID</th>
          <td>{{ selected_user.user_uid || "-" }}</td>
        </tr>
        <tr>
          <th>성별</th>
          <td>{{ selected_user.user_gender || "-" }}</td>
          <th>생년월일</th>
          <td>{{ selected_user.user_birth || "-" }}</td>
        </tr>
        <tr>
          <th>가입일자</th>
          <td>{{ formatDate(selected_user.crt_time) }}</td>
          <th>회원타입</th>
          <td>{{ selected_user.user_type || "-" }}</td>
        </tr>
        <tr>
          <th>최근접속일</th>
          <td>{{ formatDate(selected_user.rec_connect) }}</td>
          <th>회원탈퇴</th>
          <td>{{ selected_user.wd_yn }}<span v-if="selected_user.wd_yn == 'Y'">{{ ` (${formatDate(selected_user.wd_time)},
                        ${getDday(selected_user.wd_time)}일 남음)` }}</span></td>
        </tr>
        <tr>
          <th>유료 상품</th>
          <td>유료상품</td>
          <th>권한</th>
          <td>권한</td>
        </tr>
        <tr>
          <th></th>
          <td></td>
          <th>차단 / 삭제</th>
          <td>{{ selected_user.t_user_block || "N" }} / {{ selected_user.del_yn }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 유저 정보 변경 버튼 -->
    <div class="divider"></div>
    <div class="flex flex-col md:flex-row justify-between overflow-x-auto md:overflow-x-clip overflow-y-auto">
      <div class="flex flex-col xl:flex-row">
        <button class="btn btn-active btn-neutral w-full md:w-40 m-2" onclick="my_modal_wd.showModal()">탈퇴 {{
          selected_user.wd_yn == "Y" ? '철회' : '' }}</button>

        <button class="btn btn-active btn-neutral w-full md:w-40 m-2" onclick="my_modal_del.showModal()">삭제 {{
          selected_user.del_yn == "Y" ? '철회' : '' }}</button>
      </div>

      <div class="flex flex-col xl:flex-row">
        <button class="btn btn-active btn-neutral w-full md:w-40 m-2" @click="loadUpdatePage()">수정</button>
        <button class="btn btn-active btn-neutral w-full md:w-40 m-2" onclick="my_modal_block.showModal()">차단 {{
          selected_user.t_user_block == "Y" ? '철회' : '' }}</button>
        <button class="btn btn-active btn-neutral w-full md:w-40 m-2" @click="isClicked = false">목록</button>
      </div>

      <!-- 탈퇴(철회) 확인 dialog -->
      <dialog id="my_modal_wd" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <div class="p-2 font-bold text-xl">{{ selected_user.user_name }} ({{ selected_user.user_uid  }})</div>
          <hr>
          <div class="p-4">{{ `탈퇴${selected_user.wd_yn == "Y" ? '철회' : '처리'} 하시겠습니까?` }}
          </div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn bg-slate-300 mr-2" @click="controlMember('withdraw')">확인</button>
              <button class="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- 삭제(철회) 확인 dialog -->
      <dialog id="my_modal_del" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <div class="p-2 font-bold text-xl">{{ selected_user.user_name }} ({{ selected_user.user_uid  }})</div>
          <hr>
          <div class="p-4">{{ `삭제${selected_user.del_yn == "Y" ? '철회' : '처리'} 하시겠습니까?` }}
          </div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn bg-slate-300 mr-2" @click="controlMember('delete')">확인</button>
              <button class="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- 차단(철회) 확인 dialog -->
      <dialog id="my_modal_block" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <div class="p-2 font-bold text-xl">{{ selected_user.user_name }} ({{ selected_user.user_uid  }})</div>
          <hr>
          <div class="p-4">{{ `차단${selected_user.del_yn == "Y" ? '철회' : '처리'} 하시겠습니까?` }}
          </div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn bg-slate-300 mr-2" @click="controlMember('block')">확인</button>
              <button class="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>

  </div>

</template>

<script setup>
import {api} from '@/composables/connect.js'

const total_user = ref(0);    // users 데이터 수
const total_page = ref(1);    // 총 페이지 수
const page_limit = 5;         // 한 페이지 로딩 수
const current_page = ref(1);  // 현재 페이지

let users = reactive([]);       // users 변수 선언

const isClicked = ref(false);   // 상세 조회 여부
const selected_user = ref({});  // 상세 조회할 user  

const searchWord = ref("");          // 검색 String
const searchFilter = ref("아이디");  // 검색 필터 
const isSearching = ref(false);     // 검색 여부

const filter = ref("전체");       // filter
const selectedType = ref("전체"); // type filter

// 페이지 접속
onMounted(() => {
  selectAllUsers(); // 페이지 로드 시 사용자 데이터를 가져옵니다.
})

// 필터 변경 시 users 데이터 변화
watch(filter, () => {
  let data;
  switch (filter) {
    case "일반":
      // filter API 
      break;
    case "탈퇴":
      break;
    case "차단":
      break;
    case "관리자":
      break;
    default:
      selectAllUsers();
  }
  // 전체 조회 시 PASS
  if (data) {
    // users.value = data;
  }
})


// 모든 사용자 GET 
const selectAllUsers = async () => {
  isSearching.value = false;
  try {
    const data = await api("GET", `/core/mgmt/users-all?page=${current_page.value}&page_size=${page_limit}`);
    users.value = data.value; // users 변수의 내용을 변경
    total_user.value = data.count[0].total_users_count
    total_page.value = Math.ceil(total_user.value / page_limit);

  } catch (err) {
    console.error(err);
  }
};

// 검색 정보와 일치하는 사용자 GET
const search = async () => {

  if (!searchWord.value) {
    alert("검색어를 입력해주세요.")

  } else {
    if (!isSearching.value) current_page.value = 1;
    if (isClicked.value) isClicked.value = false;
    isSearching.value = true;

    let data;
    if (searchFilter.value == "아이디") {
      data = await api("GET", `/core/mgmt/search-user?type=user_id&user_id=${searchWord.value}&page=${current_page.value}&page_size=${page_limit}`);
      console.log(data)

    } else if (searchFilter.value == "이름") {
      data = await api("GET", `/core/mgmt/search-user?type=user_name&user_name=${searchWord.value}&page=${current_page.value}&page_size=${page_limit}`);

    }

    console.log(data)
    if (data) {
      console.log(data)
      users.value = data.user_list;

      total_user.value = data.count[0].search_count;
      total_page.value = Math.ceil(total_user.value / page_limit);
    } else {
      alert("검색 결과가 존재하지 않습니다.")
      isSearching.value = false;
    }
  }
}

// 검색 초기화
const resetSearch = () => {
  current_page.value = 1;
  isSearching.value = false;
  searchWord.value = '';
  searchFilter.value = '아이디';
  selectAllUsers();
}

// 페이지네이션
const changePage = (selected) => {
  // 페이지 넘김 시 사용자 상세 정보 숨김
  isClicked.value = false;

  if (selected < 1 || selected > total_page.value) {
    alert("존재하지 않는 페이지입니다.")
  } else if (selected != current_page) {
    current_page.value = selected;
    if (isSearching.value) search();
    else selectAllUsers();
  }
}

// user 상세 정보 조회
const ShowUserDetail = (user) => {
  if (user.user_id == selected_user.value.user_id) {
    isClicked.value = !isClicked.value;
  } else {
    isClicked.value = true;
    selected_user.value = user;
  }
}

// user 탈퇴, 차단, 삭제
const controlMember = async (func) => {

  if (func == 'withdraw') {
    if (selected_user.value.wd_yn == "Y") {
      try {
        await api("PUT", `/core/mgmt/cancel_wd?user_id=${selected_user.value.user_id}`);
        selected_user.value.wd_yn = "N";
        console.log("탈퇴를 철회하였습니다.")
      } catch (err) {
        console.error(err);
        alert("처리 중 오류가 발생하였습니다.\n다시 시도해주세요");
      }

    } else {
      try {
        await api("PUT", `/core/mgmt/withdraw-user?userUid=${selected_user.value.user_uid}`);
        selected_user.value.wd_yn = "Y";
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 9);
        selected_user.value.wd_time = currentDate.toISOString();
        console.log("탈퇴되었습니다.")
      } catch (err) {
        console.error(err);
        alert("처리 중 오류가 발생하였습니다. \n 다시 시도해주세요");
      }

    }
  } else if (func == 'delete') {
    const delete_it = selected_user.value.del_yn == "N"
    await api("PUT", `/core/mgmt/delete-user?user_uid=${selected_user.value.user_uid}&delete_it=${delete_it}`);
    selected_user.value.del_yn = delete_it ? "Y" : "N";

  } else if (func == 'block') {
    alert("아직 지원하지 않는 기능입니다.")
    if (selected_user.value.t_user_block) {

    } else {

    }
  }
}

const router = useRouter();
const loadUpdatePage = () => {
  // User 정보 수정 페이지 이동 시 필요한 값만 query로 보냄
  const u_user = {
    user_id: selected_user.value.user_id,
    user_uid: selected_user.value.user_uid,
    user_email: selected_user.value.user_email,
    user_name: selected_user.value.user_name,
    user_gender: selected_user.value.user_gender,
    user_birth: selected_user.value.user_birth,
    user_phone: selected_user.value.user_phone,
    user_type : selected_user.value.user_type
  };
  router.push({ path: '/users/update', query: u_user })
}

// 검색 후 enter event 중복 방지 
const handleEnter = (event) => {
  if (event.defaultPrevented) return;
  this.handleClick();
  event.preventDefault();
}

// YYYY-MM-DDTHH:mm:ss.sss 형식 데이터를 YYYY-MM-DD HH:mm:ss 형식으로 변환
const formatDate = (date) => {
  return date == null ? "-" : `${date.slice(0, 10)} ${date.slice(11, 19)}`
}

// 탈퇴 시 삭제까지 남은 날 계산
const getDday = (date) => {
  // 60 - (diff)
  const today = new Date();
  const formatDate = new Date(date);

  // d_day = 60일추가
  let diff = today.getTime() - formatDate.getTime();
  diff = Math.ceil(diff / (1000 * 3600 * 24));
  return 60 - diff;
}
</script>