<script>
  import SideModal from "./SlideModal.svelte";

  import Architecture from "./Architecture.svelte";

  import { detailVeiw } from "../assets/etc/Search.svelte";

  import { mobileView, sidoArr, sidoMap, rightSideModal, roadViewUrl } from "../store";
  import { xmlStr2Json, addComma, csvToJSON } from "../utils";
  import { onMount } from "svelte";
  import Pagination from "./Pagination.svelte";
  import Loading from "../assets/etc/Loading.svelte";

  // 카카오지도 관련 변수
  let map; // 카카오지도 객체를 담을 변수입니다.
  let mapContainer; // 카카오지도를 담을 영역 태그 컨테이너 입니다.
  let markers = []; // 마커를 담을 배열입니다.

  // 모달 관련 변수
  let modalToggle = true;
  let siteListModalToggle = true;
  let siteDetailToggle = false;
  let expand = "";
  let sideModal;

  // 사이트 정보 관련 변수
  let siteDetailInfo; // 사이트 세부 정보를 담는 변수입니다.
  let siteList = []; // 인허가api 결과를 담는 변수입니다.

  // 검색어를 담을 변수입니다.
  let searchTerm = "";
  let today = new Date();
  let dateSelected = today.getFullYear();

  let totalArea = 10000; // 면적 제한 조건(m2)
  let sidoSelected = ""; // 시도
  let permTypeSelected = "";
  let totAreaSelected = "";
  let useSelected = "";

  let currentNum = 0;
  let totalNum = 0;

  // 공공데이터 apiKey
  const apiKey = "GO8tFIo30%2BUG6NoXSzlVzxv2j8eQFigKu9a8RJ9qY47kAnl2u27pVjWIDlvlZ09Yo3NNJeyRt3UJovtQ5Z11ew%3D%3D";

  // 법정동코드 리스트
  let codeList = [];

  // 카카오지도에 마커를 표시하고 클릭 이벤트를 등록하는 함수입니다.
  function pin(elem) {
    let geocoder = new kakao.maps.services.Geocoder();
    let rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성
    console.log(elem);
    return geocoder.addressSearch(elem.plat_plc, function (coord, status) {
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
        focus(elem);

        rc.getNearestPanoId(coords, 50, function (panoId) {
          if (panoId != null) {
            roadViewUrl.set("https://map.kakao.com/?panoid=" + panoId); //Kakao 지도 로드뷰로 보내는 링크
          } else {
            roadViewUrl.set(""); // panoId를 못찾은 경우에는 공백으로 둔다.
          }
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
      title: elem.plat_plc,
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
        console.log("응답: ", xmlStr);
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

  let permsResult; // 인허가정보를 담을 변수입니다.
  let totalPermsCnt = 0; // 인허가정보 건수를 담을 변수입니다.
  let lastPageNo = 1;
  let currentPage = 1;

  // 인허가정보 불러오는 api
  async function getPerms(event) {
    currentPage = event ? (currentPage = event.detail.currentPage) : 1;

    let url = "/api/getPerms";
    url = url + "?page=" + currentPage;
    url = sidoSelected ? url + "&sido=" + sidoSelected : url;
    url = permTypeSelected ? url + "&permsType=" + permTypeSelected : url;
    url = totAreaSelected ? url + "&totAreaGt=" + totAreaSelected : url;
    url = useSelected ? url + "&mainPurps=" + useSelected : url;
    console.log(url);

    return fetch(url)
      .then(async (resp) => (permsResult = await resp.json()))
      .then((json) => {
        totalPermsCnt = json.total_cnt;
        lastPageNo = json.total_page;
        console.log(json);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // 첫 페이지의 인허가 정보를 불러옵니다.
  let perms = getPerms();

  // 새로운 페이지의 인허가 정보를 불러옵니다. 이 때 하위 컴포넌트에서 dispatch된 이벤트를 받습니다.
  function getPermsHandler(event) {
    console.log(event);
    if (event == null) {
      // 조회 버튼을 눌러서 조회하면 currentPage와 lastPageNo를 초기화 시킵니다.
      currentPage = 1;
      lastPageNo = 1;
    }

    perms = getPerms(event);
  }

  // 법정동코드(10자리)로 인허가정보를 반환합니다.
  async function getInfo(code) {
    let year = dateSelected;
    let startMonth = "01";
    let startDay = "01";
    let endMonth = dateSelected == today.getFullYear() ? String(Number(today.getMonth() + 1)).padStart(2, "0") : "12";
    let endDay = dateSelected == today.getFullYear() ? String(Number(today.getDate() - 1)).padStart(2, "0") : "31";

    let start = year + startMonth + startDay;
    let end = year + endMonth + endDay;

    let info = await getApBasisOulnInfo(code, start, end);
    if (info == undefined) {
      console.log("info: ", info, "인포가 없습니다.");
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

    currentNum += 1;
  }

  function moveToSiteListView() {
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

  /**
   * map/MapTypeBtn.svelte에서 발생한 이벤트를 받아 지도 타입을 변경합니다.
   * @param event
   */
  function setMapType(event) {
    let mapType = event.detail.value;
    console.log(mapType);

    if (mapType == "mapView") {
      return map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    } else if (mapType == "skyView") {
      return map.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
    }
  }

  onMount(async () => {
    let mapOption = {
      center: new kakao.maps.LatLng(37.5042135, 127.0016985),
      level: 8,
    };
    map = new kakao.maps.Map(mapContainer, mapOption);

    // await fetch("/public/seoul_dong_code.csv")
    //   .then((response) => response.text())
    //   .then((csvText) => csvToJSON(csvText))
    //   .then((data) => {
    //     totalNum = data.length;
    //     for (let i = 0; i < data.length; i++) {
    //       let code = data[i];
    //       codeList = [...codeList, code["법정동코드"]];
    //     }
    //   });

    // codeList.forEach(async function (code) {
    //   await getInfo(code);
    // });
    // getStanReginCdList();
  });
</script>

<div class="h-full relative" bind:this={mapContainer} draggable="false">
  <!-- 검색창 영역 -->

  <!-- 모달 오픈 버튼 -->
  {#if !modalToggle}
    <button type="button" class="openModal rounded-md absolute p-1.5 z-10 max-sm:bottom-5 md:top-5 right-5" on:click={moveToSiteListView}
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
            <h1 class="text-lg font-bold">건축인허가정보 <span class="italic font-light">Beta</span></h1>
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

          <!-- 검색창 영역 -->
          <div class="flex flex-wrap my-5">
            <select bind:value={sidoSelected} type="text" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-2">
              <option value="" selected>전국</option>
              <option value="11" selected>서울</option>
              <option value="41">경기도</option>
            </select>

            <select bind:value={permTypeSelected} type="text" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-2">
              <option value="" selected>허가</option>
              <option value="신축" selected>신축</option>
              <option value="증축">증축</option>
              <option value="용도변경">용도변경</option>
            </select>

            <select bind:value={totAreaSelected} type="text" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-2">
              <option value="" selected>면적</option>
              <option value="100000" selected>10만m2</option>
              <option value="50000" selected>5만m2</option>
              <option value="30000" selected>3만m2</option>
              <option value="10000" selected>1만m2</option>
            </select>

            <select bind:value={useSelected} type="text" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-2">
              <option value="" selected>주용도(적용예정)</option>
              <option value="오피스" selected>오피스</option>
            </select>

            <!-- 조회 버튼은 이벤트를 넘기지 않고 인허가 정보를 조회합니다. -->
            <button on:click={() => getPermsHandler()} type="button" class="mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 mx-2">조회</button>
          </div>

          {#await perms}
            <p class="my-5">인허가 정보가 {addComma(totalPermsCnt, 0)}건 있습니다.</p>

            <!-- 페이지 영역 -->
            <Pagination on:moveTo={getPermsHandler} {lastPageNo} {currentPage} />

            <Loading />
          {:then}
            <p class="my-5">인허가 정보가 {addComma(totalPermsCnt, 0)}건 있습니다.</p>

            <!-- 상단 페이지 영역 -->
            <Pagination on:moveTo={getPermsHandler} {lastPageNo} {currentPage} />

            <div class="flex-col">
              {#each permsResult.result as site}
                <button
                  on:click={() => {
                    siteDetailInfo = site;
                    console.log(site);
                    siteDetailView();
                    pin(site);
                  }}
                  class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 my-4 text-start"
                >
                  <dl class="flex-col mx-auto text-gray-900 gap-4">
                    <div class="flex-col">
                      <dt class="mb-2 truncate">건축허가일 {site.arch_pms_day}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 truncate">사용승인일 {site.use_apr_day}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold truncate">{site.arch_gb_cd_nm}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold truncate">{site.plat_plc}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold truncate">{site.bld_nm}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold">{site.main_purps_cd_nm}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold">{addComma(site.tot_area)} ㎡</dt>
                    </div>
                  </dl>
                </button>
              {/each}
            </div>

            <!-- 하단 페이지 영역 -->
            <Pagination on:moveTo={getPermsHandler} {lastPageNo} {currentPage} />
          {/await}
        {/if}

        <!-- 상세보기 영역 -->
        {#if siteDetailToggle && siteDetailInfo}
          <div class="flex justify-between my-3">
            <button on:click={moveToSiteListView}>
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
                    >{siteDetailInfo.plat_plc}
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
                  <td class="px-6 py-4">{siteDetailInfo.main_purps_cd_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">연면적</th>
                  <td class="px-6 py-4">{siteDetailInfo.tot_area}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물명</th>
                  <td class="px-6 py-4">{siteDetailInfo.bld_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">사용승인일</th>
                  <td class="px-6 py-4">{siteDetailInfo.use_apr_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축허가일</th>
                  <td class="px-6 py-4">{siteDetailInfo.arch_pms_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">구역명</th>
                  <td class="px-6 py-4">{siteDetailInfo.guyuk_cd_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축면적(㎡)</th>
                  <td class="px-6 py-4">{siteDetailInfo.arch_area}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건폐율(%)</th>
                  <td class="px-6 py-4">{siteDetailInfo.bc_rat}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">용적률(%)</th>
                  <td class="px-6 py-4">{siteDetailInfo.vl_rat_estm_tot_area}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공예정일</th>
                  <td class="px-6 py-4">{siteDetailInfo.stcns_sched_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공연기일</th>
                  <td class="px-6 py-4">{siteDetailInfo.stcns_delay_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공예정일</th>
                  <td class="px-6 py-4">{siteDetailInfo.stcns_sched_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">실제착공일</th>
                  <td class="px-6 py-4">{siteDetailInfo.real_stcns_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지목</th>
                  <td class="px-6 py-4">{siteDetailInfo.jimok_cd_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지역</th>
                  <td class="px-6 py-4">{siteDetailInfo.jiyuk_cd_nm}</td>
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
