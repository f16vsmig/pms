import { readable, writable } from "svelte/store";

export const count = writable(0);

export const map = writable();
export const modalToggle = writable(false); // 모달창 토글 상태
export const detailElem = writable(); // pop 지도 메뉴 모달창의 사이트 정보 상태
export const mapLevel = writable(12); // pop 지도 확대축소 레벨
export const mapCenter = writable(); // pop 지도 중심 위치
export const listVisable = writable(false); // pop 지도 상부 버튼 리스트 보기 상태
export const roadVeiwBtnUrl = writable("");

export const rightSideModal = writable(); // 우측 모달 엘리먼트
export const rightSideModalScrollTop = writable(0); // 우측 모달의 스크롤바 포지션

export const modalFormToggle = writable(false); // 모달폼 토글 상태

export const sidebarVisable = writable(true);

export const mgmBldrgstPk = writable(""); // 건축물대장pk

export const mobileView = readable(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
