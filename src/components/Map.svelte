<script>
  import { mobileView, siteList } from "../store";
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

  import { detailElem, roadVeiwBtnUrl, map, mapCenter, mapLevel, rightSideModal, rightSideModalScrollTop, modal, siteListModal, siteModal, roadViewUrl } from "../store";
  import Pie from "../assets/chart/Pie.svelte";
  import Trend from "../assets/chart/Trend.svelte";
  import Bubble from "../assets/chart/Bubble.svelte";

  let mapContainer;
  $siteList = [
    // {
    //   id: 1,
    //   address: "서울특별시 중구 세종대로7길 25",
    //   jibun: "서울특별시 중구 순화동 175",
    //   name: "에스원 본사",
    //   owner: "코람코",
    //   todos: [
    //     {
    //       id: 12,
    //       title: "3층 천장 누수 발생",
    //       status: 1,
    //     },
    //     {
    //       id: 13,
    //       title: "기계실 바닥 보수",
    //       status: 1,
    //     },
    //   ],
    // },
    {
      id: 2,
      address: "서울특별시 종로구 종로 33",
      jibun: "서울특별시 종로구 청진동 70",
      name: "그랑서울(샘플)",
      owner: "코람코",
      todos: [
        {
          id: 15,
          title: "본죽 천장 누수 발생",
          status: 1,
        },
        {
          id: 21,
          title: "로비 회전문 고장",
          status: 1,
        },
      ],
    },
    // {
    //   id: 3,
    //   address: "서울 서초구 서초대로74길 11",
    //   jibun: "서울특별시 서초구 서초동 1320-10",
    //   name: "삼성전자 서초사옥",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 4,
    //   address: "부산광역시 해운대구 달맞이길 30",
    //   jibun: "부산광역시 해운대구 중동 1829",
    //   name: "엘시티",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 5,
    //   address: "광주광역시 광산구 상무대로 420-25",
    //   jibun: "광주광역시 광산구 신촌동 698-9",
    //   name: "광주공항",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 6,
    //   address: "강원도 정선군 사북읍 하이원길 265",
    //   jibun: "강원도 정선군 사북읍 사북리 424",
    //   name: "강원랜드",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 7,
    //   address: "대전광역시 유성구 엑스포로 1",
    //   jibun: "대전광역시 유성구 도룡동 3-1",
    //   name: "대전신세계백화점",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 8,
    //   address: "서울특별시 강서구 하늘길 112",
    //   jibun: "서울특별시 강서구 공항동 1373",
    //   name: "김포공항 국내선",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 9,
    //   address: "대구광역시 북구 호암로 51",
    //   jibun: "대구광역시 북구 침산동 1757",
    //   name: "대구창조센터",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 10,
    //   address: "경상남도 거제시 계룡로 125",
    //   jibun: "경상남도 거제시 고현동 717",
    //   name: "거제시청",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 11,
    //   address: "제주특별자치도 제주시 첨단로 242",
    //   jibun: "제주특별자치도 제주시 영평동 2181",
    //   name: "제주스페이스닷원",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 12,
    //   address: "제주특별자치도 제주시 광양9길 10",
    //   jibun: "제주특별자치도 제주시 이도이동 1176-1",
    //   name: "제주시청",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 13,
    //   address: "경기도 용인시 수지구 죽전로 152",
    //   jibun: "경기도 용인시 수지구 죽전동 1491",
    //   name: "단국대학교",
    //   owner: "코람코",
    //   todos: [],
    // },
    // {
    //   id: 14,
    //   address: "서울특별시 동작구 흑석로 84",
    //   jibun: "서울특별시 동작구 흑석동 221",
    //   name: "중앙대학교",
    //   owner: "코람코",
    //   todos: [],
    // },
  ];

  // let kakaomap = $map;
  let kakaomapCenter;

  $modal = false;
  $siteListModal = false;
  $siteModal = false;

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
    // let imageSrc = "/public/icon/pv.png",
    //   imageSize = new kakao.maps.Size(24, 24),
    //   imageOption = { offset: new kakao.maps.Point(16, 28) },
    // markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
      // map: kakaomap,
      map: $map,
      title: elem.id,
      // image: markerImage,
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
      $detailElem = elem;
      console.log("333333", $detailElem);
      // siteInfo = elem;
      $map.setLevel(4);
      $map.setCenter(new kakao.maps.LatLng(coord[0].y, coord[0].x));
      // kakaomap.panTo(new kakao.maps.LatLng(coord[0].y, coord[0].x));
      // kakaomap.panBy(200, 0);
      $modal = true;
      $siteModal = true;
      $siteListModal = false;
      detailVeiw(elem);
      if ($rightSideModal != undefined) {
        $rightSideModal.scrollTop = 0;
      }
    });
  }

  function hideMarkerByOid() {
    return markers.forEach((marker) => {
      if (selectedVids.includes(marker.marker.getTitle())) {
        marker.marker.setMap($map);
        marker.label.setMap($map);
      } else {
        marker.marker.setMap(null);
        marker.label.setMap(null);
      }
    });
  }

  function onSiteModal(site) {
    let geocoder = new kakao.maps.services.Geocoder();
    siteInfo = site;
    $siteListModal = false;

    return geocoder.addressSearch(site.address, function (result, status) {
      if (status == kakao.maps.services.Status.OK) {
        $map.setLevel(4);
        $map.setCenter(new kakao.maps.LatLng(result[0].y, result[0].x));
        detailVeiw(site);
        if ($rightSideModal != undefined) {
          $rightSideModal.scrollTop = 0;
        }
        $modal = true;
        $siteModal = true;
        $siteListModal = false;
      }
    });
  }

  //////
  function setMarkerLabel(coord, label) {
    let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);
    let content = label;

    let markerLabel = new kakao.maps.CustomOverlay({
      content: content,
      map: $map,
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
      return $map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    } else if (mapType == "skyView") {
      return $map.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
    }
  }

  function openSiteModal() {
    // $modalToggle = true;
    $modal = true;
    $siteListModal = false;
    $siteModal = true;
    // kakaomap.setCenter(kakaomapCenter);
    // kakaomap.panBy(200, 0);
  }

  function openSiteModalFromList(site) {
    $modal = true;
    $siteModal = true;
    $siteListModal = false;
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
    $map = new kakao.maps.Map(mapContainer, mapOption);
    // kakaomap.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);

    // vppDataQuery.site.forEach(Pin);
    $siteList.forEach(Pin);

    let clusterer = new kakao.maps.MarkerClusterer({
      map: $map,
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

  let realtimeToggle = true;
  let searchTerm = "";
</script>

<div class="max-sm:h-[calc(100%-50px)] md:h-full relative">
  <div class="h-full relative" bind:this={mapContainer}>
    <!-- 모달 오픈 -->
    {#if !$modal && !$mobileView}
      <button
        type="button"
        class="openModal rounded-md absolute p-1.5 z-10 top-3 right-5"
        on:click={() => {
          $modal = true;
          $siteListModal = true;
          $siteModal = false;
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

    {#if $modal}
      <RightSideModal>
        <div slot="content" class="flex flex-col relative">
          {#if $siteListModal}
            <div class="flex justify-between px-2 mb-5 max-sm:mt-3">
              <h3>건물리스트</h3>
              <button
                on:click={() => {
                  $modal = false;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {#each $siteList as site}
              <div class="flex flex-col md:flex-row md:flex-wrap px-0 md:px-2">
                {#if searchTerm == "" || site.name.includes(searchTerm) || site.address.includes(searchTerm) || site.owner.includes(searchTerm)}
                  <button
                    on:click={() => {
                      $detailElem = site;
                      $siteModal = true;
                      $siteListModal = false;
                    }}
                    class="mb-5 bg-white border rounded-lg shadow-md md:w-full md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <h5 class="mt-5 px-5 text-start text-lg md:text-xl tracking-tight text-gray-900 dark:text-white {searchTerm != '' && site.name.includes(searchTerm) ? 'text-red-500' : ''}">
                      {site.name}
                    </h5>

                    <p class="mb-5 px-5 md:text-lg text-start tracking-tight font-light">{site.address}</p>
                  </button>
                {/if}
              </div>
            {/each}
          {/if}

          {#if $siteModal}
            <!-- 모달 닫기 버튼 -->
            <div class="flex justify-between px-2 mb-5 max-sm:mt-5">
              <button
                on:click={() => {
                  $siteModal = false;
                  $siteListModal = true;
                }}
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h3>건물정보</h3>

              <button
                on:click={() => {
                  $modal = false;
                  $siteModal = false;
                  $siteListModal = false;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- <div class="grow my-2 p-2">
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
            </div> -->

            <div class="grow">
              <Architecture elem={$detailElem} />
            </div>

            <!-- <div class="row mb-2 p-2">
            <div class="col-12 border rounded p-3 mb-2"><WeatherDaily /></div>
          </div> -->
          {/if}
        </div>
      </RightSideModal>

      {#if !$mobileView}
        <!-- 모달 접기 버튼 -->
        <button
          type="button"
          class="modalCloseBtn rounded-l-md max-sm:hidden md:fixed md:right-1/3"
          on:click={() => {
            $modal = false;
          }}
          ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      {/if}
    {/if}

    {#if !$modal && siteInfo && !$mobileView}
      <button type="button" class="openSiteModal rounded-l-md" on:click={openSiteModal} style="position: fixed; top: calc(50% - 25px); right:0px; margin-left: auto; width: 20px; height: 50px; z-index: 999; background-color: rgba(255,255,255,0.93);"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
    {/if}

    {#if $mobileView}
      <!-- 지도 전환 버튼 -->
      <div class="w-full flex py-2.5 fixed bottom-0 border-t-2 bg-white z-50">
        <div class="w-1/2 text-center" style="padding-bottom: env(safe-area-inset-bottom);">
          <button
            on:click={() => {
              $modal = false;
              $siteListModal = false;
            }}
            class="w-6 {!$siteListModal ? 'text-indigo-500' : ''}"
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block w-6 h-6 mx-auto pointer-events-none">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
          </button>
        </div>

        <div class="w-1/2 text-center" style="padding-bottom: env(safe-area-inset-bottom);">
          <button
            on:click={() => {
              $modal = true;
              $siteListModal = true;
              $siteModal = false;
            }}
            class="w-6 {$siteListModal ? 'text-indigo-500' : ''}"
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block w-6 h-6 mx-auto pointer-events-none">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
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
