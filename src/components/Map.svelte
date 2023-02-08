<script>
  import { mobileView } from "../store";
  import Search from "../assets/etc/Search.svelte";
  import ArchitectureModal from "./RightSlideModalArchitecture.svelte";
  import RightSideModal from "./RightSlideModal.svelte";
  import MapTypeBtn from "../assets/btn/MapTypeBtn.svelte";
  import RoadVeiwBtn from "../assets/btn/RoadviewBtn.svelte";

  import Architecture from "./Architecture.svelte";
  import BarChart from "../assets/chart/Bar.svelte";
  import BubbleChart from "../assets/chart/Bubble.svelte";
  import CalendarChart from "../assets/chart/Calendar.svelte";
  import ColumnChart from "../assets/chart/Column.svelte";
  import WeatherDaily from "./Weather.svelte";
  import Line from "../assets/chart/Line.svelte";
  import Guage from "../assets/chart/Guage.svelte";
  import Issue from "./Issue.svelte";

  import { link } from "svelte-spa-router";

  import { onMount, onDestroy } from "svelte";
  import { detailVeiw } from "../assets/etc/Search.svelte";

  import { detailElem, roadVeiwBtnUrl, map, mapCenter, mapLevel, rightSideModal, rightSideModalScrollTop } from "../store";
  import Pie from "../assets/chart/Pie.svelte";
  import Trend from "../assets/chart/Trend.svelte";
  import Bubble from "../assets/chart/Bubble.svelte";

  let mapContainer;

  let kakaomap;
  let kakaomapCenter;

  let modal = false;
  let siteListModal = false;
  let siteModal = false;

  let vppDropdown = false;
  let vppList = [
    {
      vid: 1,
      vname: "vpp1",
      oid: "ewp",
      oname: "동서발전",
    },
    {
      vid: 2,
      vname: "vpp2",
      oid: "khnp",
      oname: "한국수력원자력",
    },
    {
      vid: 3,
      vname: "vpp3",
      oid: "iwest",
      oname: "서부발전",
    },
  ];
  let selectedVids = vppList.map((el) => el.vid)[0];

  let resourceDropdown = false;
  let resourceList = [
    {
      rid: "pv",
      name: "태양광",
    },
    {
      rid: "wind",
      name: "풍력",
    },
    {
      rid: "ess",
      name: "ESS",
    },
  ];
  let selectedRids = resourceList.map((el) => el.rid);

  let infoDropdown = false;
  let infoModal = false;

  let infoRadio = "totalCurrentKW";

  let markers = [];
  let ms = [];

  const reqObj = {
    mainRatingOutputKW: "주자원 정격출력",
    subRatingOutputKW: "보조자원 정격출력",
    totalRatingOutputKW: "전체 정격출력",
    totalCurrentKW: "현재출력",
    totalTodayKWh: "금일 발전량",
    totalTodayH: "금일 발전시간",
  };

  const vppDataQuery = {
    vppName: "브이피피1332",
    oid: "khnp",
    coperateName: "동서발전",
    queryPrams: ["mainRatingOutputKW", "subRatingOutputKW", "totalRatingOutputKW", "totalCurrentKW", "totalTodayKWh", "totalTodayH"],
    queryStartTime: new Date("2022-12-06 23:00:00"),
    queryEndTime: new Date("2022-12-08 23:00:00"),
    queryUnit: "hourly",
    stastics: {
      siteCount: 3,
      grandTotalMainRatingOutputKW: 3000, // main 자원의 정격출력
      grandTotalSubRatingOutputKW: 3000, // sub 자원의 정격출력
      grandTotalRatingOutputKW: 6000, // 전체 자원의 정격출력
      grandTotaltodayKWh: 300, // 금일 발전량 합계
      maxCurrentKW: 350,
      minCurrentKW: 200,
    },
    site: [
      {
        sid: 1,
        name: "한빛1호",
        address: "서울 중구 세종대로7길 25",
        owner: "중부발전",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 150,
        totalTodayKWh: 300,
        totalTodayH: 2.5,
        equip: [
          {
            did: 1,
            category: "kpx",
            name: "kpx-422",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 0, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
          {
            did: 2,
            category: "inv",
            name: "inv-1",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 1, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
          {
            did: 3,
            category: "inv",
            name: "inv-2",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 0, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
        ],
        weather: {
          gridNo: 12,
          history: [
            {
              datetime: "2022-12-06 1:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
            {
              datetime: "2022-12-06 2:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
            {
              datetime: "2022-12-06 3:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
          ],
          current: {
            category: 0, // 0 관측, 1 예보
            timestamp: new Date("2022-12-08 23:00:00"),
            temp: 13,
            humid: 50,
            rad: 52,
            rain: 90,
            cloud: 0.021,
          },
        },
        todos: [],
      },
      {
        sid: 2,
        name: "한빛2호",
        address: "서울 서초구 서초대로52길 12",
        owner: "옆집아저씨A",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 150,
        totalTodayKWh: 300,
        totalTodayH: 2.5,
        equip: [
          {
            did: 1,
            category: "kpx",
            name: "kpx-422",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 0, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
          {
            did: 2,
            category: "inv",
            name: "inv-1",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 1, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
          {
            did: 3,
            category: "inv",
            name: "inv-2",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 0, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
        ],
        weather: {
          gridNo: 12,
          history: [
            {
              datetime: "2022-12-06 1:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
            {
              datetime: "2022-12-06 2:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
            {
              datetime: "2022-12-06 3:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
          ],
          current: {
            category: 0, // 0 관측, 1 예보
            timestamp: new Date("2022-12-08 23:00:00"),
            temp: 13,
            humid: 50,
            rad: 52,
            rain: 90,
            cloud: 0.021,
          },
        },
        todos: [],
      },
      {
        sid: 3,
        name: "한빛3호",
        address: "부산 해운대구 달맞이길 30",
        owner: "옆집아줌마B",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 150,
        totalTodayKWh: 300,
        totalTodayH: 2.5,
        equip: [
          {
            did: 1,
            category: "kpx",
            name: "kpx-422",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              category: 0, // 0 실측, 1 추정
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
          {
            did: 2,
            category: "inv",
            name: "inv-1",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
          {
            did: 3,
            category: "inv",
            name: "inv-2",
            history: [
              {
                datetime: "2022-12-06 1:00",
                startWh: 400,
                endWh: 500,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 2:00",
                startWh: 500,
                endWh: 600,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
              {
                datetime: "2022-12-06 3:00",
                startWh: 600,
                endWh: 700,
                kwh: 100,
                predKwh: 90,
                predErr: 0.021,
              },
            ],
            current: {
              timestamp: new Date("2022-12-08 23:00:00"),
              kw: 350,
              rKw: 115,
              sKw: 115,
              tKw: 115,
              va: 360,
              rVa: 120,
              sVa: 120,
              tVa: 120,
              var: 10,
              pf: 0.9,
              rPf: 0.9,
              sPf: 0.9,
              tPf: 0.9,
            },
          },
        ],
        weather: {
          gridNo: 12,
          history: [
            {
              datetime: "2022-12-06 1:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
            {
              datetime: "2022-12-06 2:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
            {
              datetime: "2022-12-06 3:00",
              temp: 13,
              humid: 50,
              rad: 52,
              rain: 90,
              cloud: 0.021,
            },
          ],
          current: {
            category: 0, // 0 관측, 1 예보
            timestamp: new Date("2022-12-08 23:00:00"),
            temp: 13,
            humid: 50,
            rad: 52,
            rain: 90,
            cloud: 0.021,
          },
        },
        todos: [],
      },
    ],
  };

  /////////
  function Pin(elem) {
    let geocoder = new kakao.maps.services.Geocoder();
    let address = elem.address;

    return geocoder.addressSearch(address, function (result, status) {
      if (status == kakao.maps.services.Status.OK) {
        // setMarkerLabel(result, label);
        setMarker(elem, result);
        // elem.xAxis = result[0].x; // x축 추가
        // elem.yAxis = result[0].y; // y축 추가
      }
    });
  }

  //////////
  function makePinLabel(elem) {
    if (!elem.todos || elem.todos.length == 0) {
      return '<span class="text-gray-800 text-sm font-light mr-2 px-2.5 py-0.5 rounded bg-slate-50 dark:bg-gray-700 dark:text-gray-300">' + elem.name + "</span>";
    }
    return (
      '<div class="inline-flex relative text-red-800 text-sm font-light mr-2 px-2.5 py-0.5 rounded bg-slate-50 dark:bg-red-200 dark:text-red-900"><span>' +
      elem.name +
      "</span><div class='inline-flex absolute -top-1 -right-1 justify-center items-center w-3 h-3 font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900'></div></div>"
    );
  }

  let siteInfo;

  //////////
  function setMarker(elem, coord) {
    let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);
    let imageSrc = "/public/icon/pv.png",
      imageSize = new kakao.maps.Size(24, 24),
      imageOption = { offset: new kakao.maps.Point(16, 28) },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
      map: kakaomap,
      title: elem.oid,
      image: markerImage,
      position: coords,
      clickable: true,
    });

    // let markerLabel = new kakao.maps.CustomOverlay({
    //   content: makePinLabel(elem),
    //   map: kakaomap,
    //   position: coords,
    //   yAnchor: 0,
    // });

    // markers.push({ marker: marker, label: markerLabel });
    ms.push(marker);

    //   let clusterer = new kakao.maps.MarkerClusterer({
    //   map: kakaomap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    //   averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    //   minLevel: 5, // 클러스터 할 최소 지도 레벨
    // });
    //   clusterer.addMarker(marker);

    kakao.maps.event.addListener(marker, "click", function () {
      // $detailElem = elem;
      siteInfo = elem;
      kakaomap.setLevel(4);
      kakaomap.setCenter(new kakao.maps.LatLng(coord[0].y, coord[0].x));
      // kakaomap.panTo(new kakao.maps.LatLng(coord[0].y, coord[0].x));
      // kakaomap.panBy(200, 0);
      modal = true;
      siteModal = true;
      siteListModal = false;
      detailVeiw(elem);
      if ($rightSideModal != undefined) {
        $rightSideModal.scrollTop = 0;
      }
    });
  }

  function hideMarkerByOid() {
    return markers.forEach((marker) => {
      if (selectedVids.includes(marker.marker.getTitle())) {
        marker.marker.setMap(kakaomap);
        marker.label.setMap(kakaomap);
      } else {
        marker.marker.setMap(null);
        marker.label.setMap(null);
      }
    });
  }

  function onSiteModal(site) {
    let geocoder = new kakao.maps.services.Geocoder();
    siteInfo = site;
    siteListModal = false;

    return geocoder.addressSearch(site.address, function (result, status) {
      if (status == kakao.maps.services.Status.OK) {
        kakaomap.setLevel(4);
        kakaomap.setCenter(new kakao.maps.LatLng(result[0].y, result[0].x));
        detailVeiw(site);
        if ($rightSideModal != undefined) {
          $rightSideModal.scrollTop = 0;
        }
        modal = true;
        siteModal = true;
        siteListModal = false;
      }
    });
  }

  //////
  function setMarkerLabel(coord, label) {
    let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);
    let content = label;

    let markerLabel = new kakao.maps.CustomOverlay({
      content: content,
      map: kakaomap,
      position: coords,
      yAnchor: 0,
    });

    // markerLabel.setMap(kakaomap);
  }

  /**
   * map/MapTypeBtn.svelte에서 발생한 이벤트를 받아 지도 타입을 변경합니다.
   * @param event
   */
  function setMapType(event) {
    let mapType = event.detail.value;

    if (mapType == "mapView") {
      return kakaomap.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    } else if (mapType == "skyView") {
      return kakaomap.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
    }
  }

  function openSiteModal() {
    // $modalToggle = true;
    modal = true;
    siteListModal = false;
    siteModal = true;
    // kakaomap.setCenter(kakaomapCenter);
    // kakaomap.panBy(200, 0);
  }

  function openSiteModalFromList(site) {
    modal = true;
    siteModal = true;
    siteListModal = false;
    siteInfo = site;
    // kakaomap.setCenter(kakaomapCenter);
  }

  function clickOutside(element, callbackFunction) {
    function onClick(event) {
      if (!element.contains(event.target)) {
        callbackFunction();
      }
    }

    document.body.addEventListener("click", onClick);

    return {
      update(newCallbackFunction) {
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener("click", onClick);
      },
    };
  }

  onMount(() => {
    // if (!kakaomapCenter) {
    kakaomapCenter = new kakao.maps.LatLng(36.450701, 127.570667);
    // }
    let mapOption = {
      center: new kakao.maps.LatLng(36.450701, 127.570667),
      level: 12,
    };
    kakaomap = new kakao.maps.Map(mapContainer, mapOption);
    kakaomap.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);

    vppDataQuery.site.forEach(Pin);

    let clusterer = new kakao.maps.MarkerClusterer({
      map: kakaomap,
      markers: ms,
      gridSize: 35,
      averageCenter: true,
      minLevel: 6,
      disableClickZoom: true,
      // styles: [{
      //     width : '53px', height : '52px',
      //     background: 'url(cluster.png) no-repeat',
      //     color: '#fff',
      //     textAlign: 'center',
      //     lineHeight: '54px'
      // }]
    });
  });

  // onDestroy(() => {
  //   map.set();
  //   console.log("gg", map);
  // });

  let realtimeToggle = true;
</script>

<div class="max-sm:h-[calc(100%-50px)] md:h-full relative">
  {#if $mobileView}
    <button on:click={() => (realtimeToggle = !realtimeToggle)} class="absolute top-10 right-8 z-20 text-slate-500">
      {#if realtimeToggle}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      {/if}
    </button>
  {/if}

  {#if realtimeToggle}
    <div class="flex-col absolute max-sm:w-full max-sm:top-8 max-sm:px-5 md:w-80 md:top-5 md:left-5 z-10">
      <div class="flex-initial rounded-md" style="background-color: rgba(255,255,255,0.93)">
        <div class="px-5 pt-5">
          <h6 class="text-sm text-slate-500">2:30:43 PM</h6>
          <h5 class="text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">3,500 <span class="text-lg text-slate-500">kW</span></h5>
        </div>

        <div class="flex-none text-center self-end">
          <button type="button" class="openModa bg-transparent rounded-lg z-50" on:click={() => (infoModal = !infoModal)}>
            {#if infoModal}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            {:else if !infoModal}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            {/if}
          </button>
        </div>

        {#if infoModal}
          <div class="h-36">
            <Line />
          </div>
          <div class="flex">
            <div class="basis-1/2 p-5">
              <div class="inline-flex items-center w-full mb-2.5">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.4 12.8C0.1792 12.8 0 12.6208 0 12.4V0.4C0 0.1792 0.1792 0 0.4 0H15.6C15.8208 0 16 0.1792 16 0.4V12.4C16 12.6208 15.8208 12.8 15.6 12.8H8.8V14.4H12.4C12.6208 14.4 12.8 14.5792 12.8 14.8V15.6C12.8 15.8208 12.6208 16 12.4 16H3.6C3.3792 16 3.2 15.8208 3.2 15.6V14.8C3.2 14.5792 3.3792 14.4 3.6 14.4H7.2V12.8H0.4ZM6.96018 7.19792H1.84018C1.72658 7.19792 1.63138 7.27712 1.60658 7.38272L1.60018 7.43792V10.9579C1.60018 11.0715 1.67938 11.1667 1.78498 11.1915L1.84018 11.1979H6.96018C7.07378 11.1979 7.16898 11.1187 7.19378 11.0131L7.20018 10.9579V7.43792C7.20018 7.30512 7.09298 7.19792 6.96018 7.19792ZM14.1599 7.19792H9.03994C8.92634 7.19792 8.83114 7.27712 8.80634 7.38272L8.79994 7.43792V10.9579C8.79994 11.0715 8.87914 11.1667 8.98474 11.1915L9.03994 11.1979H14.1599C14.2735 11.1979 14.3687 11.1187 14.3935 11.0131L14.3999 10.9579V7.43792C14.3999 7.30512 14.2927 7.19792 14.1599 7.19792ZM6.96018 1.6H1.84018C1.72658 1.6 1.63138 1.6792 1.60658 1.7848L1.60018 1.84V5.36C1.60018 5.4736 1.67938 5.5688 1.78498 5.5936L1.84018 5.6H6.96018C7.07378 5.6 7.16898 5.5208 7.19378 5.4152L7.20018 5.36V1.84C7.20018 1.7072 7.09298 1.6 6.96018 1.6ZM14.1599 1.6H9.03994C8.92634 1.6 8.83114 1.6792 8.80634 1.7848L8.79994 1.84V5.36C8.79994 5.4736 8.87914 5.5688 8.98474 5.5936L9.03994 5.6H14.1599C14.2735 5.6 14.3687 5.5208 14.3935 5.4152L14.3999 5.36V1.84C14.3999 1.7072 14.2927 1.6 14.1599 1.6Z"
                    fill="#5882FA"
                  />
                </svg>
                <span class="flex-none ml-4 whitespace-nowrap">1500 kW</span>
              </div>

              <div class="inline-flex items-center w-full mb-3">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.5095 0.333328C11.7909 0.333328 12.0192 0.555592 12.0192 0.829452V7.29891C13.0641 6.34238 14.5381 5.7639 16.1498 5.79069C19.1437 5.84229 21.5912 7.96868 21.6646 10.6408L21.6666 10.8472L21.6575 11.3433C21.6534 11.5864 21.4689 11.7859 21.2303 11.8236L21.1386 11.8305L13.3577 11.6975C14.7032 12.6799 15.5871 14.3339 15.5871 16.2093C15.5871 19.1483 13.4168 21.5446 10.7001 21.6617L10.4901 21.6667H9.98045C9.72969 21.6667 9.52173 21.491 9.47892 21.2598L9.47076 21.1705V14.5899C8.49216 15.3103 7.23526 15.736 5.8489 15.7132C2.69086 15.6586 0.285116 13.297 0.334046 10.5148L0.341182 10.1606C0.346279 9.88669 0.578698 9.6684 0.860047 9.67435L7.52884 9.78747C6.52781 8.79026 5.90293 7.36837 5.90293 5.79069C5.90293 2.77624 8.1843 0.333328 10.9998 0.333328H11.5095ZM11.5095 13.1202V19.2969L11.7062 19.2146C12.6767 18.7631 13.3862 17.7877 13.5238 16.6218L13.5421 16.4015L13.5482 16.209C13.5482 14.8556 12.7806 13.6947 11.6879 13.1956L11.5095 13.1202ZM2.66844 11.4053L2.68373 11.4717C3.06294 12.9303 4.38202 13.9861 5.87847 14.0119L6.05788 14.0099C7.48196 13.9553 8.74905 12.969 9.1619 11.5819L9.18025 11.5164L2.66844 11.4053ZM16.1141 7.77393C14.6768 7.75012 13.4454 8.43576 12.8592 9.42503L12.7715 9.58379L12.7165 9.70088L19.4393 9.81499L19.3884 9.69592C18.9337 8.71161 17.8674 7.96146 16.5534 7.8037L16.319 7.78286L16.1141 7.77393ZM9.98048 8.87782V2.70107L9.96825 2.70603C8.78475 3.16048 7.94172 4.36904 7.94172 5.78994L7.94681 5.98244C8.01511 7.24458 8.75212 8.31521 9.78272 8.79546L9.98048 8.87782Z"
                    fill="#5882FA"
                  />
                </svg>
                <span class="ml-4 whitespace-nowrap">3500 kW</span>
              </div>
            </div>

            <div class="basis-1/2 p-5 items-center">
              <div class="inline-flex items-center w-full mb-2">
                <svg width="22" height="11" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.67 2.23371e-06C17.4 2.26562e-06 18 0.600002 18 1.33L18 3L20 3L20 7L18 7L18 8.67C18 9.4 17.4 10 16.67 10L1.33 10C0.976143 9.99802 0.637492 9.85588 0.388211 9.60473C0.138929 9.35357 -0.000663569 9.01386 3.43616e-06 8.66L3.75656e-06 1.33C0.00198743 0.976142 0.14412 0.637489 0.395276 0.388208C0.646431 0.138926 0.98614 -0.000665441 1.34 1.56362e-06L16.67 2.23371e-06ZM15 2.5L2.5 2.5L2.5 7.5L15 7.5L15 2.5Z"
                    fill="#ED8987"
                  />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.375 3.75L5.625 3.75L5.625 6.25L4.375 6.25L4.375 3.75Z" fill="#ED8987" stroke="#ED8987" />
                </svg>
                <span class="ml-4 whitespace-nowrap">2300 kW</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FF4000" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" />
                </svg>
              </div>

              <div class="inline-flex items-center w-full mb-4">
                <svg width="22" height="11" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 8.67L18 7L20 7L20 3L18 3L18 1.33C18 0.6 17.4 -1.1365e-07 16.67 -1.45559e-07L1.34 -8.15655e-07C0.599998 -8.48001e-07 -1.93358e-06 0.599999 -1.96548e-06 1.33L-2.28589e-06 8.66C-0.000669873 9.01386 0.138925 9.35357 0.388206 9.60473C0.637487 9.85588 0.976139 9.99802 1.33 10L16.67 10C17.4 10 18 9.4 18 8.67ZM2 4L7.5 4L7.5 2L15 6L9.5 6L9.5 8L2 4Z"
                    fill="green"
                  />
                </svg>
                <span class="ml-4 whitespace-nowrap">1300 kW</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#298A08" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
                </svg>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if !$mobileView}
    <!-- 필터 영역 -->
    <div class="inline-flex absolute z-10 max-sm:top-4 max-sm:left-3 md:top-5 md:left-96">
      <!-- vpp 선택 드롭다운 -->
      <div class="relative inline-flex items-center">
        <div class="relative">
          <button
            id="dropdownBgHoverButton1"
            data-dropdown-toggle="dropdownBgHover1"
            class="inline-flex py-1.5 px-3 mr-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-2xl border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
            on:click|stopPropagation={() => {
              vppDropdown = !vppDropdown;
              resourceDropdown = false;
              infoDropdown = false;
            }}
            >VPP <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {#if vppDropdown}
            <div use:clickOutside={() => (vppDropdown = false)} id="dropdownBgHover1" class="absolute top-7 z-10 w-40 mt-2 bg-white rounded-md shadow dark:bg-gray-700">
              <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton1">
                {#each vppList as vpp, id}
                  <li>
                    <div class="flex px-4 py-2 rounded-2lx items-center hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="vpp-radio-{id}"
                        type="radio"
                        value={vpp.vid}
                        class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        bind:group={selectedVids}
                        on:change={hideMarkerByOid}
                      />
                      <label for="vpp-radio-{id}" class="ml-2 w-full text-sm text-start font-medium text-gray-900 dark:text-gray-300">{vpp.vname}</label>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <div class="relative">
          <!-- 자원 선택 드롭다운 -->
          <button
            id="dropdownBgHoverButton"
            data-dropdown-toggle="dropdownBgHover"
            class="inline-flex items-center py-1.5 px-3 mr-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
            on:click|stopPropagation={() => {
              resourceDropdown = !resourceDropdown;
              vppDropdown = false;
              infoDropdown = false;
            }}
            >자원 <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg
            ></button
          >

          {#if resourceDropdown}
            <div use:clickOutside={() => (resourceDropdown = false)} id="dropdownBgHover1" class="absolute top-7 z-10 w-40 mt-2 bg-white rounded-md shadow dark:bg-gray-700">
              <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton1">
                {#each resourceList as resource, id}
                  <li>
                    <div class="flex px-4 py-2 rounded-2lx items-center hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="resource-checkbox-{id}"
                        type="checkbox"
                        value={resource.rid}
                        class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        bind:group={selectedRids}
                        on:change={hideMarkerByOid}
                      />
                      <label for="resource-checkbox-{id}" class="ml-2 w-full text-sm text-start font-medium text-gray-900 dark:text-gray-300">{resource.name}</label>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <div class="relative">
          <!-- 표시정보 선택 드롭다운 -->
          <button
            id="dropdownHelperRadioButton"
            data-dropdown-toggle="dropdownHelperRadio"
            class="inline-flex items-center py-1.5 px-3 mr-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
            on:click|stopPropagation={() => {
              infoDropdown = !infoDropdown;
              vppDropdown = false;
              resourceDropdown = false;
            }}
            >표시정보 <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg
            ></button
          >

          {#if infoDropdown}
            <div
              use:clickOutside={() => (infoDropdown = false)}
              id="dropdownHelperRadio"
              class="absolute top-7 z-10 w-48 mt-2 bg-white rounded-md shadow dark:bg-gray-700"
              data-popper-reference-hidden=""
              data-popper-escaped=""
              data-popper-placement="top"
            >
              <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHelperRadioButton">
                {#each vppDataQuery.queryPrams as req, id}
                  <li>
                    <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div class="flex items-center h-5">
                        <input
                          bind:group={infoRadio}
                          id="info-radio-{id}"
                          name="helper-radio"
                          type="radio"
                          value={req}
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div class="ml-2 text-sm">
                        <label for="info-radio-{id}" class="font-medium text-gray-900 dark:text-gray-300">{reqObj[req]}</label>
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <div class="h-full relative" bind:this={mapContainer}>
    <!-- 발전소리스트 오픈 -->
    {#if !modal && !$mobileView}
      <button
        type="button"
        class="openModal rounded-md absolute p-1.5 z-10 top-3 right-5"
        on:click={() => {
          modal = true;
          siteListModal = true;
          siteModal = false;
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

    {#if modal}
      <RightSideModal>
        <div slot="content" class="flex flex-col relative">
          {#if siteListModal}
            <div class="flex justify-between px-2 mb-5">
              <h3>발전소 리스트</h3>
              <button
                on:click={() => {
                  modal = false;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {#each vppDataQuery.site as site}
              <button
                class="grow py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                on:click={() => onSiteModal(site)}
              >
                {site.name}
              </button>
            {/each}
          {/if}

          {#if siteModal}
            <div class="text-end">
              <button
                on:click={() => {
                  siteModal = false;
                  siteListModal = true;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
            <h3 class="grow mt-3">
              {siteInfo.name}
              <span class="ms-3"><a class="fs-6 fw-light text-decoration-none" use:link href={"/pop/sites/" + siteInfo.sid}>자세히 <i class="fa-solid fa-angle-right" /></a></span>
            </h3>
            <h6>
              {siteInfo.address}
            </h6>

            <div class="grow my-2 p-2">
              <h5>진행중인 이슈 <span class="text-danger">{siteInfo.todos.length}</span></h5>
              <table class="table table-hover">
                {#if siteInfo.todos.length == 0 || !siteInfo.todos}
                  <h6 class="my-4">현재 진행중인 이슈가 없습니다.</h6>
                {:else}
                  <tbody class="table-group-divider">
                    {#each siteInfo.todos as todo}
                      <tr>
                        <td>{todo.title}</td>
                        <td class="text-end fw-light"><a use:link href={"/pop/sites/log/" + todo.id}>상세보기></a></td>
                      </tr>
                    {/each}
                  </tbody>
                {/if}
              </table>
            </div>

            <div class="grow mb-2 p-2">
              <Architecture />
            </div>

            <!-- <div class="row mb-2 p-2">
            <div class="col-12 border rounded p-3 mb-2"><WeatherDaily /></div>
          </div> -->

            <div class="row mb-2 p-2">
              <div class="col-12 border rounded p-3 mb-2 bg-white"><BarChart /></div>
            </div>

            <div class="row mb-2 p-2">
              <div class="col-12 border rounded p-3 mb-2 bg-white"><Pie /></div>
            </div>

            <div class="row mb-2 p-2">
              <div class="col-12 border rounded p-3 mb-2 bg-white"><Trend /></div>
            </div>

            <div class="row mb-2 p-2">
              <div class="col-12 border rounded p-3 mb-2 bg-white"><CalendarChart /></div>
            </div>

            <div class="row mb-2 p-2">
              <div class="col-12 border rounded p-3 mb-2 bg-white"><BubbleChart /></div>
            </div>

            <div class="row mb-2 p-2">
              <div class="col-12 border rounded p-3 mb-2 bg-white"><ColumnChart /></div>
            </div>
          {/if}
        </div>
      </RightSideModal>

      {#if !$mobileView}
        <!-- 모달 닫기 버튼 -->
        <button
          type="button"
          class="modalCloseBtn rounded-l-md max-sm:hidden md:fixed md:right-1/3"
          on:click={() => {
            modal = false;
          }}
          ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      {/if}
    {/if}

    {#if !modal && siteInfo && !$mobileView}
      <button type="button" class="openSiteModal rounded-l-md" on:click={openSiteModal} style="position: fixed; top: calc(50% - 25px); right:0px; margin-left: auto; width: 20px; height: 50px; z-index: 999; background-color: rgba(255,255,255,0.93);"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
    {/if}

    {#if $mobileView}
      <!-- 지도 전환 버튼 -->
      <div class="w-full flex py-2.5 fixed bottom-0 border-t-2 bg-white z-50">
        <div class="w-1/2 text-center">
          <button
            on:click={() => {
              modal = true;
              siteListModal = true;
              siteModal = false;
            }}
            class="w-6 {!modal ? '' : 'text-indigo-500'}"
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block w-6 h-6 mx-auto pointer-events-none">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
        </div>

        <div class="w-1/2 text-center">
          <button on:click={() => (modal = false)} class="w-6 {modal ? '' : 'text-indigo-500'}"
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block w-6 h-6 mx-auto pointer-events-none">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    {/if}

    <!-- {#if $roadVeiwBtnUrl != ""}
      <div class="roadview-btn-wrapper">
        <RoadVeiwBtn url={$roadVeiwBtnUrl} />
      </div>
    {/if} -->
  </div>
</div>

<style>
  /* .roadview-btn-wrapper {
    position: absolute;
    left: calc(50% - 90px);
    bottom: 10px;
    width: 48px;
    height: 42px;
    z-index: 10;
  } */

  /* .map-type-btn-wrapper {
    position: absolute;
    bottom: 10px;
    left: calc(50% - 21px);
    z-index: 10;
  } */

  button.openModal {
    background-color: rgba(255, 255, 255);
  }

  button.modalCloseBtn {
    background-color: rgba(255, 255, 255);
    top: calc(50% - 25px);
    width: 20px;
    height: 50px;
    z-index: 999;
  }
</style>
