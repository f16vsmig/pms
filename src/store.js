import { readable, writable } from "svelte/store";

export const count = writable(0);

export const map = writable();
export const siteList = writable(); // 사이트리스트 정보
export const modal = writable(false); // 모달창 토글
export const siteModal = writable(false); // 사이트 세부정보창
export const siteListModal = writable(false); // 사이트 리스트 창
export const roadViewUrl = writable(""); // 로드뷰 링크 주소
export const mapCenter = writable(); // pop 지도 중심 위치

// 인허가 기능 관련 정보
export const sidoArr = readable([
  // 공식 법정동 시도명 리스트 입니다.
  "강원도",
  "서울특별시",
  "경기도",
  "인천광역시",
  "충청북도",
  "대전광역시",
  "세종특별자치시",
  "충청남도",
  "전라북도",
  "광주광역시",
  "전라남도",
  "대구광역시",
  "경상북도",
  "부산광역시",
  "울산광역시",
  "경상남도",
  "제주특별자치도",
  "제주특별자치도",
]);
export const sidoMap = readable({
  // 다음 주소 api의 시도명을 법정동 시도로 변환하는 맵입니다.
  강원: "강원도",
  강원도: "강원도",
  서울: "서울특별시",
  서울특별시: "서울특별시",
  경기: "경기도",
  경기도: "경기도",
  인천: "인천광역시",
  인천광역시: "인천광역시",
  충북: "충청북도",
  충청북도: "충청북도",
  대전: "대전광역시",
  대전광역시: "대전광역시",
  세종: "세종특별자치시",
  세종특별자치시: "세종특별자치시",
  충남: "충청남도",
  충청남도: "충청남도",
  전북: "전라북도",
  전라북도: "전라북도",
  광주: "광주광역시",
  광주광역시: "광주광역시",
  전남: "전라남도",
  전라남도: "전라남도",
  대구: "대구광역시",
  대구광역시: "대구광역시",
  경북: "경상북도",
  경상북도: "경상북도",
  부산: "부산광역시",
  부산광역시: "부산광역시",
  울산: "울산광역시",
  울산광역시: "울산광역시",
  경남: "경상남도",
  경상남도: "경상남도",
  제주: "제주특별자치도",
  제주도: "제주특별자치도",
  제주특별자치도: "제주특별자치도",
});
export const permMap = writable(); // 카카오지도 객체를 담을 변수입니다.
export const permSite = writable(); // 하나의

//
export const modalToggle = writable(false); // 모달창 토글 상태
export const detailElem = writable(); // pop 지도 메뉴 모달창의 사이트 정보 상태
export const mapLevel = writable(12); // pop 지도 확대축소 레벨
export const listVisable = writable(false); // pop 지도 상부 버튼 리스트 보기 상태
export const roadVeiwBtnUrl = writable("");

export const rightSideModal = writable(); // 우측 모달 엘리먼트
export const rightSideModalScrollTop = writable(0); // 우측 모달의 스크롤바 포지션

export const modalFormToggle = writable(false); // 모달폼 토글 상태

export const sidebarVisable = writable(true);

export const mgmBldrgstPk = writable(""); // 건축물대장pk

export const mobileView = readable(
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
    navigator.userAgent
  )
);
