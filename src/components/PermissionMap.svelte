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

  let roadviewContainer; // 로드뷰를 담을 영역 태그 컨테이너 입니다.
  let roadviewMap;

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
  let statusSelected = "";

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
      roadViewUrl.set(""); // 로드뷰 주소를 초기화합니다.
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
            elem.panoId = panoId;
            roadViewUrl.set("https://map.kakao.com/?panoid=" + panoId); //Kakao 지도 로드뷰로 보내는 링크
          } else if (elem.coord.y) {
            roadViewUrl.set("https://map.kakao.com/link/roadview/" + elem.coord.y + "," + elem.coord.x); // panoId를 못찾은 경우에는 좌표로 지정한다.
          } else {
            roadViewUrl.set(""); // 모두 못찾은 경우에는 공백으로 둔다.
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
    url = statusSelected ? url + "&status=" + statusSelected : url;
    console.log(url);

    return fetch(url)
      .then(async (resp) => {
        if (!resp.ok) {
          permsResult = {};
          throw await resp.text(); // response가 200이 아닌 경우 서버에서 보낸 에러메시지를 던집니다.
        }
        return (permsResult = await resp.json());
      })
      .then((json) => {
        totalPermsCnt = json.total_cnt;
        lastPageNo = json.total_page;
        console.log(json);
      })
      .catch((error) => {
        throw error; // 화면에 표시할 에러메시지를 던집니다.
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
  function setMapType(mapType) {
    if (mapType == "mapView") {
      return map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    } else if (mapType == "skyView") {
      return map.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
    }
  }

  let roadview = false;
  function setMapRoadview(elem) {
    roadview = !roadview;

    console.log(elem);

    if (roadview) {
      // let roadviewmap = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
      var rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성
      let position = new kakao.maps.LatLng(elem.coord.y, elem.coord.x);
      rc.getNearestPanoId(position, 50, function (panoId) {
        if (panoId != null) {
          elem.panoId = panoId;
          roadViewUrl.set("https://map.kakao.com/?panoid=" + panoId); //Kakao 지도 로드뷰로 보내는 링크
        } else {
          roadViewUrl.set(""); // panoId를 못찾은 경우에는 공백으로 둔다.
        }
        roadviewMap.setPanoId(elem.panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행

        let rMarker = new kakao.maps.Marker({
          position: position,
          map: roadviewMap, //map 대신 rv(로드뷰 객체)로 설정하면 로드뷰에 올라갑니다.
        });

        // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정 합니다.
        var projection = roadviewMap.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.
        var viewpoint = projection.viewpointFromCoords(rMarker.getPosition(), rMarker.getAltitude());
        roadviewMap.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.
      });

      //   var rLabel = new kakao.maps.InfoWindow({
      //     position: position,
      //     content: "스페이스 닷원",
      //   });
      //   rLabel.open(roadviewmap, rMarker);

      //   // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정 합니다.
      //   var projection = roadviewmap.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.

      //   // 마커의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
      //   var viewpoint = projection.viewpointFromCoords(rMarker.getPosition(), rMarker.getAltitude());
      //   roadviewmap.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.
    }
  }

  onMount(async () => {
    let mapOption = {
      center: new kakao.maps.LatLng(37.5042135, 127.0016985),
      level: 8,
    };
    map = new kakao.maps.Map(mapContainer, mapOption);

    roadviewMap = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체

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
    {#if siteListModalToggle}
      <SideModal>
        <div bind:this={sideModal} slot="content" class="flex flex-col relative px-2 pb-10">
          <!-- 리스트뷰 영역 -->
          <div class="flex justify-between my-3">
            <h1 class="font-bold pl-2">건축인허가정보 <span class="italic font-light">Beta</span></h1>
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
          <div class="flex flex-wrap my-5 px-1">
            <select bind:value={sidoSelected} type="text" class="mb-3 h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-3">
              <option value="" selected>전국</option>
              <option value="11" selected>서울</option>
              <option value="41">경기도</option>
            </select>

            <select bind:value={permTypeSelected} type="text" class="mb-3 h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-3">
              <option value="" selected>허가전체</option>
              <option value="신축" selected>신축</option>
              <option value="증축">증축</option>
              <option value="용도변경">용도변경</option>
            </select>

            <select bind:value={totAreaSelected} type="text" class="mb-3 h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-3">
              <option value="" selected>면적전체</option>
              <option value="100000" selected>10만m2이상</option>
              <option value="50000" selected>5만m2이상</option>
              <option value="30000" selected>3만m2이상</option>
              <option value="10000" selected>1만m2이상</option>
            </select>

            <select bind:value={useSelected} type="text" class="mb-3 h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-3">
              <option value="" selected>용도전체</option>
              <option value="업무시설" selected>업무시설</option>
              <option value="공동주택" selected>공동주택</option>
              <option value="근린생활시설" selected>근린생활시설</option>
            </select>

            <select bind:value={statusSelected} type="text" class="mb-3 h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-3">
              <option value="" selected>단계전체</option>
              <option value="per" selected>건축허가</option>
              <option value="con" selected>착공신고</option>
              <option value="use" selected>사용허가</option>
            </select>

            <!-- 조회 버튼은 이벤트를 넘기지 않고 인허가 정보를 조회합니다. -->
            <button on:click={() => getPermsHandler()} type="button" class="mb-3 h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5 mr-3">조회</button>
          </div>

          {#await perms}
            <p class="my-5">등록된 정보가 <span class="text-blue-700">{addComma(totalPermsCnt, 0)}</span>건 있습니다.</p>

            <!-- 페이지 영역 -->
            <Pagination on:moveTo={getPermsHandler} {lastPageNo} {currentPage} />

            <Loading />
          {:then}
            <p class="my-5">등록된 정보가 <span class="text-blue-700">{addComma(totalPermsCnt, 0)}</span>건 있습니다.</p>

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
                  class="w-full p-6 pt-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 my-4 text-start"
                >
                  <dl class="flex justify-end text-gray-400 gap-4">
                    <button class="w-5 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                    </button>
                  </dl>
                  <dl class="flex-col mx-auto text-gray-900 gap-4">
                    <div class="flex flex-wrap mb-3 gap-2">
                      {#if site.arch_gb_cd_nm != " "}
                        <span class="bg-purple-100 text-purple-800 font-medium mr-2 px-2.5 py-0.5 rounded-full">{site.arch_gb_cd_nm}</span>
                      {/if}

                      {#if site.main_purps_cd_nm != " "}
                        <span class="bg-yellow-100 text-yellow-800 font-medium mr-2 px-2.5 py-0.5 rounded-full">{site.main_purps_cd_nm}</span>
                      {/if}

                      {#if site.arch_pms_day != " " && site.real_stcns_day == " " && site.use_apr_day == " "}
                        <span class="bg-blue-100 text-blue-800 font-medium mr-2 px-2.5 py-0.5 rounded-full">건축허가 {site.arch_pms_day}</span>
                      {:else if site.arch_pms_day != " " && site.real_stcns_day != " " && site.use_apr_day == " "}
                        <span class="bg-blue-100 text-blue-800 font-medium mr-2 px-2.5 py-0.5 rounded-full">착공 {site.real_stcns_day}</span>
                      {:else if site.use_apr_day != " "}
                        <span class="bg-blue-100 text-blue-800 font-medium mr-2 px-2.5 py-0.5 rounded-full">사용승인 {site.use_apr_day}</span>
                      {/if}
                    </div>

                    <!-- <div class="flex-col">
                      <dt class="mb-2 truncate">건축허가일 {site.arch_pms_day}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 truncate">공사착공일 {site.real_stcns_day}</dt>
                    </div>

                    <div class="flex-col">
                      <dt class="mb-2 truncate">사용승인일 {site.use_apr_day}</dt>
                    </div> -->

                    <!-- <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold truncate">{site.arch_gb_cd_nm}</dt>
                    </div> -->

                    <dt class="mb-2 text-xl font-semibold">
                      {#if site.bld_nm != " "}
                        {site.bld_nm}
                      {:else}
                        이름 없음
                      {/if}
                    </dt>

                    <dt class="mb-2 text-lg truncate">
                      {#if site.tot_area}
                        {addComma(site.tot_area)} ㎡ <span class="text-slate-300 font-light">| </span>
                      {/if}
                      {site.plat_plc}
                    </dt>

                    <!-- <div class="flex-col">
                      <dt class="mb-2 text-xl font-bold">{site.main_purps_cd_nm}</dt>
                    </div> -->

                    <!-- {#if site.tot_area}
                      <div class="flex-col">
                        <dt class="mb-2 text-xl font-bold">{addComma(site.tot_area)} ㎡</dt>
                      </div>
                    {/if} -->
                  </dl>
                </button>
              {/each}
            </div>

            <!-- 하단 페이지 영역 -->
            <Pagination on:moveTo={getPermsHandler} {lastPageNo} {currentPage} />
          {:catch error}
            {error}
          {/await}
        </div>
      </SideModal>
    {/if}

    {#if siteDetailToggle && siteDetailInfo}
      <SideModal>
        <div bind:this={sideModal} slot="content" class="flex flex-col relative px-2 pb-10">
          <!-- 상세보기 영역 -->
          <div class="flex justify-between mt-3 mb-10">
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
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축허가구분</th>
                  <td class="px-6 py-4">{siteDetailInfo.arch_gb_cd_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">대장번호</th>
                  <td class="px-6 py-4">{siteDetailInfo.mgm_pmsrgst_pk}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물명</th>
                  <td class="px-6 py-4">{siteDetailInfo.bld_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">주소</th>
                  <td class="px-6 py-4">{siteDetailInfo.plat_plc} </td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지번</th>
                  <td class="px-6 py-4 flex"><input class="w-9 mr-2" type="text" value={siteDetailInfo.bun} /> - <input class="w-9 ml-2" type="text" value={siteDetailInfo.ji} /></td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">주용도</th>
                  <td class="px-6 py-4">{siteDetailInfo.main_purps_cd_nm}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축면적(㎡)</th>
                  <td class="px-6 py-4">{addComma(siteDetailInfo.arch_area, 0) || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">연면적</th>
                  <td class="px-6 py-4">{addComma(siteDetailInfo.tot_area, 0) || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">용적률산정연면적</th>
                  <td class="px-6 py-4">{addComma(siteDetailInfo.vl_rat_estm_tot_area, 0) || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">용적률(%)</th>
                  <td class="px-6 py-4">{siteDetailInfo.vl_rat_estm_tot_area || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건폐율(%)</th>
                  <td class="px-6 py-4">{siteDetailInfo.bc_rat || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축허가일</th>
                  <td class="px-6 py-4">{siteDetailInfo.arch_pms_day}</td>
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
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">실제착공일</th>
                  <td class="px-6 py-4">{siteDetailInfo.real_stcns_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">사용승인일</th>
                  <td class="px-6 py-4">{siteDetailInfo.use_apr_day}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">주건축물수</th>
                  <td class="px-6 py-4">{siteDetailInfo.main_bld_cnt || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">부속건축물수</th>
                  <td class="px-6 py-4">{siteDetailInfo.atch_bld_dong_cnt || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">세대수</th>
                  <td class="px-6 py-4">{siteDetailInfo.hhld_cnt || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">호수</th>
                  <td class="px-6 py-4">{siteDetailInfo.ho_cnt || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">가구수</th>
                  <td class="px-6 py-4">{siteDetailInfo.fmly_cnt || ""}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">총주차대수</th>
                  <td class="px-6 py-4">{siteDetailInfo.tot_pkng_cnt || ""}</td>
                </tr>
                <!-- <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">시군구코드</th>
                  <td class="px-6 py-4">{siteDetailInfo.sigungu_cd}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">법정동코드</th>
                  <td class="px-6 py-4">{siteDetailInfo.bjdong_cd}</td>
                </tr> -->
                <tr class="border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">구역명</th>
                  <td class="px-6 py-4">{siteDetailInfo.guyuk_cd_nm}</td>
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
        </div>
      </SideModal>
    {/if}
  {/if}

  <!-- 지도 타입 변경 -->
  <div class="absolute z-50 max-sm:left-[calc(50%-21px)] md:left-[calc(40%)] bottom-10 flex">
    <div class="inline-flex rounded-md shadow-sm mr-3" role="group">
      <button
        type="button"
        on:click={() => setMapType("mapView")}
        checked
        class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
          />
        </svg>
      </button>
      <button
        type="button"
        on:click={() => setMapType("skyView")}
        class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
          />
        </svg>
      </button>
    </div>

    <!-- {#if $roadViewUrl} -->
    <!-- <button
        type="button"
        on:click={setMapRoadview(siteDetailInfo)}
        class="py-2 px-3.5 justify-center items-center {roadview ? 'text-red-500' : 'text-gray-900'} bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </button> -->

    {#if $roadViewUrl}
      <a
        class="py-2 px-3.5 justify-center items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm"
        href={$roadViewUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="로드뷰 보기"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </a>
    {/if}
  </div>

  <!-- <div class="{roadview ? 'block' : 'hidden'} z-20 absolute w-2/3 h-full left-0 top-0 bg-white" id="roadview" bind:this={roadviewContainer} /> -->
  <!-- 로드뷰를 표시할 div 입니다 -->
</div>

<style>
  button.openModal {
    background-color: rgba(255, 255, 255);
  }
</style>
