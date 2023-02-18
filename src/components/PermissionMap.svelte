<script>
  import SideModal from "./SlideModal.svelte";

  import Architecture from "./Architecture.svelte";

  import { detailVeiw } from "../assets/etc/Search.svelte";

  import { mobileView, sidoArr, sidoMap, rightSideModal } from "../store";
  import { xmlStr2Json } from "../utils";
  import { onMount } from "svelte";

  // 카카오지도 관련 변수
  let map; // 카카오지도 객체를 담을 변수입니다.
  let mapContainer; // 카카오지도를 담을 영역 태그 컨테이너 입니다.

  // 모달 관련 변수
  let modalToggle = false;
  let siteListModalToggle = false;
  let siteModalToggle = false;
  let expand = "";

  // 사이트 정보 관련 변수
  let siteDetailInfo; // 사이트 세부 정보를 담는 변수입니다.
  let siteList = []; // 인허가api 결과를 담는 변수입니다.

  // 검색어를 담을 변수입니다.
  let searchTerm = "";
  let start = "20221201"; // 시작일
  let end = "20221231"; // 종료일
  let area = 10000; // 면적 조건

  // 공공데이터 apiKey
  const apiKey = "GO8tFIo30%2BUG6NoXSzlVzxv2j8eQFigKu9a8RJ9qY47kAnl2u27pVjWIDlvlZ09Yo3NNJeyRt3UJovtQ5Z11ew%3D%3D";

  // 법정동코드 리스트
  const codeList = [
    "1165010100", //서울특별시 서초구 방배동
    "1165010200",
    "1165010300",
    "1165010400",
    "1165010600",
    "1165010700",
    "1165010800",
    "1165010900",
    "1165011000",
  ];

  // 카카오지도에 마커를 표시하고 클릭 이벤트를 등록하는 함수입니다.
  function pin(elem) {
    let geocoder = new kakao.maps.services.Geocoder();
    return geocoder.addressSearch(elem.platPlc, function (coord, status) {
      if (status == kakao.maps.services.Status.OK) {
        elem.coord = coord; // coord(위경도) 속성을 추가합니다.
        let coords = new kakao.maps.LatLng(elem.coord[0].y, elem.coord[0].x);
        let marker = new kakao.maps.Marker({
          map: map,
          title: elem.id,
          position: coords,
          clickable: true,
        });
        setMarker(elem, coord);
      }
    });
  }

  //////////
  function setMarker(elem, coord) {
    let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);
    let marker = new kakao.maps.Marker({
      map: map,
      title: elem.platPlc,
      position: coords,
      clickable: true,
    });

    kakao.maps.event.addListener(marker, "click", function () {
      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(coord[0].y, coord[0].x));
      modal = true;
      siteModalToggle = true;
    });
  }

  // 건축인허가정보 서비스 api
  async function getApBasisOulnInfo(code, start, end) {
    let url = "http://apis.data.go.kr/1613000/ArchPmsService_v2/getApBasisOulnInfo";
    url += "?sigunguCd=" + code.substr(0, 5);
    url += "&bjdongCd=" + code.substr(5, 5);
    url += "&numOfRows=" + 1000;
    url += "&pageNo=" + 1;
    url += "&startDate=" + start;
    url += "&endDate=" + end;
    url += "&serviceKey=" + apiKey;
    console.log("건축인허가정보 서비스 url : ", url);

    return fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((xmlStr) => {
        return xmlStr2Json(xmlStr).response.body.items.item;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // 법정동코드(10자리)로 인허가정보를 반환합니다.
  async function getInfo(code, start, end) {
    let info = await getApBasisOulnInfo(code, start, end);
    console.log("info: ", info);
    Object.values(info).forEach(function (el) {
      if (Number(el.totArea) >= area && el.archGbCdNm == "신축") {
        pin(el);
        siteList = [...siteList, el];
      }
    });
  }

  onMount(async () => {
    let mapOption = {
      center: new kakao.maps.LatLng(37.5042135, 127.0016985),
      level: 8,
    };
    map = new kakao.maps.Map(mapContainer, mapOption);
    codeList.forEach(async function (code) {
      getInfo(code, start, end);
    });
  });
</script>

<div class="h-full relative" bind:this={mapContainer}>
  <!-- 모달 오픈 -->
  {#if !modalToggle}
    <button
      type="button"
      class="openModal rounded-md absolute p-1.5 z-10 top-3 right-5"
      on:click={() => {
        modalToggle = true;
        siteModalToggle = true;
        siteListModalToggle = true;
      }}
      style="z-index: 99;"
      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </button>
  {/if}

  {#if modalToggle}
    <SideModal>
      <div slot="content" class="flex flex-col relative">
        {#if siteListModalToggle}
          <div class="px-2 mb-5 max-sm:mt-3">
            <div class="flex justify-between mb-5">
              <h3>건축인허가(신축) 리스트</h3>
              <button
                on:click={() => {
                  modalToggle = false;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p>{start} ~ {end}</p>
            <p>{siteList.length}개의 신축 인허가 정보가 있습니다.</p>
            <div class="flex-col">
              {#each siteList as site}
                <button
                  on:click={() => {
                    if (expand == "" || expand != site.mgmPmsrgstPk) {
                      expand = site.mgmPmsrgstPk;
                    } else {
                      expand = "";
                    }
                  }}
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 my-5"
                >
                  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{site.platPlc}</h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">{site.mainPurpsCdNm}</p>
                  <p class="font-normal text-gray-700 dark:text-gray-400">{site.totArea}</p>
                  <p class="font-normal text-gray-700 dark:text-gray-400">{site.bldNm}</p>
                  <p class="font-normal text-gray-700 dark:text-gray-400">{site.useAprDay}</p>
                  <p class="font-normal text-gray-700 dark:text-gray-400">{site.archPmsDay}</p>
                  {#if site.mgmPmsrgstPk == expand}
                    <p class="font-normal text-gray-700 dark:text-gray-400">구역명 {site.guyukCdNm}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">건축면적(㎡) {site.archArea}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">건폐율(%) {site.bcRat}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">용적률산정연면적(㎡) {site.vlRatEstmTotArea}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">용적률 {site.vlRat}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">착공예정일 {site.stcnsSchedDay}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">착공연기일 {site.stcnsDelayDay}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">실제착공일 {site.realStcnsDay}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">지목 {site.jimokCdNm}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">지역 {site.jiyukCdNm}</p>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </SideModal>
  {/if}
</div>

<style>
  button.openModal {
    background-color: rgba(255, 255, 255);
  }
</style>
