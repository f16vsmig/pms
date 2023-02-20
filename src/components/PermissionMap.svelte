<script>
  import SideModal from "./SlideModal.svelte";

  import Architecture from "./Architecture.svelte";

  import { detailVeiw } from "../assets/etc/Search.svelte";

  import { mobileView, sidoArr, sidoMap, rightSideModal, roadViewUrl } from "../store";
  import { xmlStr2Json, addComma } from "../utils";
  import { onMount } from "svelte";

  // 카카오지도 관련 변수
  let map; // 카카오지도 객체를 담을 변수입니다.
  let mapContainer; // 카카오지도를 담을 영역 태그 컨테이너 입니다.
  let markers = []; // 마커를 담을 배열입니다.

  // 모달 관련 변수
  let modalToggle = false;
  let siteListModalToggle = false;
  let siteDetailToggle = false;
  let expand = "";
  let sideModal;

  // 사이트 정보 관련 변수
  let siteDetailInfo; // 사이트 세부 정보를 담는 변수입니다.
  let siteList = []; // 인허가api 결과를 담는 변수입니다.

  // 검색어를 담을 변수입니다.
  let searchTerm = "";
  let today = new Date();
  let dateSelected = today.getFullYear() + "-" + String(today.getMonth()).padStart(2, "0");

  let totalArea = 10000; // 면적 조건
  let sidoSelected = "서울특별시"; // 시도

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
    "1111010100", // 서울특별시 종로구 청운동
  ];

  // 카카오지도에 마커를 표시하고 클릭 이벤트를 등록하는 함수입니다.
  function pin(elem) {
    let geocoder = new kakao.maps.services.Geocoder();
    let rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성
    return geocoder.addressSearch(elem.platPlc, function (coord, status) {
      if (status == kakao.maps.services.Status.OK) {
        elem.coord = coord[0]; // coord(위경도) 속성을 추가합니다.
        let coords = new kakao.maps.LatLng(elem.coord.y, elem.coord.x);
        // let marker = new kakao.maps.Marker({
        //   map: map,
        //   title: elem.id,
        //   position: coords,
        //   clickable: true,
        // });
        setMarker(elem, coord);

        rc.getNearestPanoId(coords, 50, function (panoId) {
          roadViewUrl.set("https://map.kakao.com/?panoid=" + panoId); //Kakao 지도 로드뷰로 보내는 링크
        });
      }
    });
  }

  function focus(elem) {
    map.setLevel(4);
    map.setCenter(new kakao.maps.LatLng(elem.coord.y, elem.coord.x));
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

    markers = [...markers, marker];

    markers = [...markers, marker];
    kakao.maps.event.addListener(marker, "click", function () {
      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(coord[0].y, coord[0].x));
      siteDetailInfo = elem;
      siteDetailView();
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

  // 법정동코드 api
  async function getStanReginCdList() {
    let url = "http://api.odcloud.kr/api/15063424/v1/uddi:6d7fd177-cc7d-426d-ba80-9b137edf6066";
    url += "?serviceKey=" + apiKey;
    url += "&page=" + 1;
    url += "&perPage=" + 1000;
    url += "&returnType=" + "json";
    url += "&locatadd_nm=" + "서울특별시";
    console.log("법정동 코드 api url : ", url);

    return fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // 법정동코드(10자리)로 인허가정보를 반환합니다.
  async function getInfo(code) {
    let dateArr = dateSelected.split("-");
    let year = dateArr[0];
    let month = String(Number(dateArr[1])).padStart(2, "0");
    let start = year + month + "01";
    let nextMonth = new Date(year, month, 0, 0, 0, 0, 0);
    let end = nextMonth.getFullYear() + String(nextMonth.getMonth() + 1).padStart(2, "0") + String(nextMonth.getDate()).padStart(2, "0"); // 종료일

    let info = await getApBasisOulnInfo(code, start, end);

    if (info == undefined) {
      // 인허가정보가 없으면 함수를 종료합니다.
      return;
    }

    if (Array.isArray(info)) {
      Object.values(info).forEach(function (el) {
        if (Number(el.totArea) >= totalArea && Number(el.archPmsDay) >= Number(start) && el.archGbCdNm == "신축") {
          pin(el);
          siteList = [...siteList, el];
        }
      });
    } else {
      if (Number(info.totArea) >= totalArea && Number(info.archPmsDay) >= Number(start) && info.archGbCdNm == "신축") {
        pin(info);
        siteList = [...siteList, info];
      }
    }
  }

  function siteListView() {
    modalToggle = true;
    siteListModalToggle = true;
    siteDetailToggle = false;
  }

  function siteDetailView() {
    modalToggle = true;
    siteListModalToggle = false;
    siteDetailToggle = true;
  }

  function closeModal() {
    modalToggle = false;
  }

  onMount(async () => {
    let mapOption = {
      center: new kakao.maps.LatLng(37.5042135, 127.0016985),
      level: 8,
    };
    map = new kakao.maps.Map(mapContainer, mapOption);

    codeList.forEach(async function (code) {
      getInfo(code);
    });
    // getStanReginCdList();
  });
</script>

<div class="h-full relative" bind:this={mapContainer}>
  <!-- 검색창 영역 -->
  <div class="absolute left-5 top-5 z-10 flex">
    <select bind:value={sidoSelected} type="ra" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mx-2">
      <option value="서울특별시" selected>서울특별시</option>
      <option value="경기도">경기도(예정)</option>
    </select>
    <input bind:value={dateSelected} type="month" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mx-2" />
    <button
      on:click={() => {
        markers.forEach((marker) => marker.setMap(null)); // 이전에 지도에 표시된 마커를 모두 지웁니다.
        siteList = []; // 사이트 리스트 변수를 초기화 합니다.
        markers = [];
        codeList.forEach(async function (code) {
          getInfo(code);
        });
      }}
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2">조회</button
    >
  </div>

  <!-- 모달 오픈 -->
  {#if !modalToggle}
    <button type="button" class="openModal rounded-md absolute p-1.5 z-10 top-3 right-5" on:click={siteListView} style="z-index: 99;"
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
      <div bind:this={sideModal} slot="content" class="flex flex-col relative px-2 pb-10">
        <!-- 리스트뷰 영역 -->
        {#if siteListModalToggle}
          <div class="flex justify-between my-3">
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
          <p>{siteList.length}개의 신축 인허가 정보가 있습니다.</p>
          <div class="flex-col">
            {#each siteList as site}
              <button
                on:click={() => {
                  siteDetailInfo = site;
                  siteDetailView();
                  focus(site);
                }}
                class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 my-4 text-start"
              >
                <dl class="grid grid-cols-2 mx-auto text-gray-900 gap-4">
                  <div class="flex flex-col">
                    <dd class="font-light text-gray-500 dark:text-gray-400">건물명</dd>
                    <dt class="mb-2 text-xl font-bold truncate">{site.bldNm}</dt>
                  </div>

                  <div class="flex flex-col">
                    <dd class="font-light text-gray-500 dark:text-gray-400">용도</dd>
                    <dt class="mb-2 text-xl font-bold">{site.mainPurpsCdNm}</dt>
                  </div>

                  <div class="flex flex-col">
                    <dd class="font-light text-gray-500 dark:text-gray-400">연면적</dd>
                    <dt class="mb-2 text-xl font-bold">{addComma(site.totArea)} ㎡</dt>
                  </div>

                  <div class="flex flex-col">
                    <dd class="font-light text-gray-500 dark:text-gray-400">건축면적</dd>
                    <dt class="mb-2 text-xl font-bold">{addComma(site.archArea)} ㎡</dt>
                  </div>

                  <div class="col-span-2">
                    <dd class="font-light text-gray-500 dark:text-gray-400">주소</dd>
                    <dt class="mb-2 text-xl font-bold">{site.platPlc}</dt>
                  </div>
                </dl>
              </button>
            {/each}
          </div>
        {/if}

        <!-- 상세보기 영역 -->
        {#if siteDetailToggle && siteDetailInfo}
          <div class="flex justify-between my-3">
            <button on:click={siteListView}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1>상세보기</h1>
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

          <div class="relative overflow-x-auto shadow-md">
            <table class="w-full text-sm text-left text-gray-500">
              <!-- <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">기본정보</th>
                </tr>
              </thead> -->
              <tbody>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">주소</th>
                  <td class="px-6 py-4 flex"
                    >{siteDetailInfo.platPlc}
                    {#if $roadViewUrl}
                      <a href={$roadViewUrl} target="_blank" rel="noreferrer" class="text-indigo-600 hover:text-indigo-500 ml-2" title="로드맵 보기"
                        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pointer-events-none">
                          <path
                            stroke-linecap="round"
                            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </a>
                    {/if}</td
                  >
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">주용도</th>
                  <td class="px-6 py-4">{siteDetailInfo.mainPurpsCdNm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">연면적</th>
                  <td class="px-6 py-4">{siteDetailInfo.totArea}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물명</th>
                  <td class="px-6 py-4">{siteDetailInfo.bldNm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">사용승인일</th>
                  <td class="px-6 py-4">{siteDetailInfo.useAprDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축허가일</th>
                  <td class="px-6 py-4">{siteDetailInfo.archPmsDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축허가일</th>
                  <td class="px-6 py-4">{siteDetailInfo.archPmsDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">구역명</th>
                  <td class="px-6 py-4">{siteDetailInfo.guyukCdNm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축면적(㎡)</th>
                  <td class="px-6 py-4">{siteDetailInfo.archArea}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건폐율(%)</th>
                  <td class="px-6 py-4">{siteDetailInfo.bcRat}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">용적률(%)</th>
                  <td class="px-6 py-4">{siteDetailInfo.vlRatEstmTotArea}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공예정일</th>
                  <td class="px-6 py-4">{siteDetailInfo.stcnsSchedDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공연기일</th>
                  <td class="px-6 py-4">{siteDetailInfo.stcnsDelayDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공예정일</th>
                  <td class="px-6 py-4">{siteDetailInfo.stcnsSchedDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">실제착공일</th>
                  <td class="px-6 py-4">{siteDetailInfo.realStcnsDay}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지목</th>
                  <td class="px-6 py-4">{siteDetailInfo.jimokCdNm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지역</th>
                  <td class="px-6 py-4">{siteDetailInfo.jiyukCdNm}</td>
                </tr>
              </tbody>
            </table>
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
