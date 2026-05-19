// 서버와 연동 성공 시 결과 반환, 실패 시 재요청
const api = async (method, url, body) => {
  let DDSP_AT = sessionStorage.getItem("DDSP_AT"); // JWT 토큰 불러오기
  console.log("요청을 보내기 위한 DDSP_AT :" + DDSP_AT);
  let DDSP_UID = sessionStorage.getItem("DDSP_UID");

  if (!DDSP_AT) {
    location.href = "/users/login";
  }

  let init =  {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DDSP_AT}`,
      user_uid: `${DDSP_UID}`,
    }
  }

  if (body) {
    init['body'] = JSON.stringify(body)

  }

  const response = await fetch(
    "https://yjyoon-fastapi-template-dev.k8s.dlab.kr:1443/v1" +
    // "http://localhost:8081/v1" +
    url,
    init
  );

  if (!response.ok) {
    const data = await response.json();
    if (response.status === 401 && data.detail) {
      if (data.detail.msg) {
        alert(data.detail.msg);
        location.href = "/users/login";
        return
      } else {
        // Save the new token and retry
        console.log(data);
        DDSP_AT = data.detail;
        sessionStorage.setItem("DDSP_AT", DDSP_AT);
        sessionStorage.setItem("DDSP_AT", DDSP_AT);
        console.log("NEW_DDSP_AT: " + DDSP_AT);
        return api(method, url, body);
      }
    } else {
      throw new Error("Network response was not ok");
    }
  }

  return response.json();
}

export {
  api
}
