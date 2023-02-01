<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/SideMenubar.svelte";
  import Btype from "../layout/Btype.svelte";

  import { link } from "svelte-spa-router";
  import { fade } from "svelte/transition";

  import Form from "../components/Form.svelte";
  import Alternative from "../assets/btn/Alternative.svelte";

  let formData = {
    title: "새로운 발전소 추가하기",
    action: "/",
    inputElements: [
      {
        label: "발전소 이름",
        name: "siteName",
        type: "text",
        placeholder: "발전소 이름을 입력하세요.",
      },
      {
        label: "자원보유자",
        name: "owner",
        type: "text",
        placeholder: "개인 또는 법인명을 입력하세요.",
      },
      {
        label: "관리자",
        name: "management",
        type: "text",
        placeholder: "직영 또는 위탁관리(법인)을 입력하세요.",
      },
      {
        label: "기타",
        name: "memo",
        type: "textarea",
        placeholder: "기타 메모를 입력하세요.",
      },
    ],
  };

  let siteList = {
    count: 7,
    grandTotalMainRatingOutputKW: 3000,
    grandTotalSubRatingOutputKW: 3000,
    grandTotalRatingOutputKW: 6000,
    maxCurrentKW: 350,
    minCurrentKW: 200,
    data: [
      {
        id: 1,
        address: "서울 중구 세종대로7길 25",
        name: "한빛1호",
        owner: "중부발전",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 150,
        sun: {
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 350,
          },
        },
        ess: {
          ratingInputKW: 500,
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            mode: 1,
            kw: 200,
          },
        },
      },
      {
        id: 2,
        address: "서울 종로구 종로 33",
        name: "한빛2호",
        owner: "중부발전",
        mainRatingOutputKW: 350,
        totalRatingOutputKW: 350,
        totalCurrentKW: 200,
        sun: {
          ratingOutputKW: 350,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 200,
          },
        },
      },
      {
        id: 3,
        address: "서울 서초구 서초대로52길 12",
        name: "울진1호",
        owner: "한수원",
        mainRatingOutputKW: 300,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 800,
        totalCurrentKW: 150,
        sun: {
          ratingOutputKW: 300,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 250,
          },
        },
        ess: {
          ratingInputKW: 500,
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            mode: 1,
            kw: 200,
          },
        },
      },
      {
        id: 4,
        address: "부산 해운대구 달맞이길 30",
        name: "울진2호",
        owner: "한수원",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 500,
        sun: {
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 300,
          },
        },
        ess: {
          ratingInputKW: 500,
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            mode: 2,
            kw: 200,
          },
        },
      },
      {
        id: 5,
        address: "광주 광산구 상무대로 420-25",
        name: "순천1호",
        owner: "남부발전",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 300,
        sun: {
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 200,
          },
        },
        ess: {
          ratingInputKW: 500,
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            mode: 2,
            kw: 100,
          },
        },
      },
      {
        id: 6,
        address: "강원 정선군 사북읍 하이원길 265",
        name: "순천2호",
        owner: "남부발전",
        mainRatingOutputKW: 500,
        totalRatingOutputKW: 500,
        totalCurrentKW: 200,
        sun: {
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 200,
          },
        },
      },
      {
        id: 7,
        address: "대전 유성구 대덕대로 480",
        name: "순천3호",
        owner: "남부발전",
        mainRatingOutputKW: 500,
        subRatingOutputKW: 500,
        totalRatingOutputKW: 1000,
        totalCurrentKW: 270,
        sun: {
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            kw: 270,
          },
        },
        ess: {
          ratingInputKW: 500,
          ratingOutputKW: 500,
          current: {
            timestamp: new Date("2022-12-08 23:00:00"),
            mode: 1,
            kw: 0,
          },
        },
      },
    ],
  };

  let modalForm = false;

  let search = "";

  let detailData;

  let promise = getData();
  async function getData() {
    // let xhr = new XMLHttpRequest();
    // xhr.open("get", "/getAllSites");  // api를 통해 데이터 획득

    // if (xhr.status == 200) {
    // return JSON.parse(xhr.responseText);  // 응답이 정상이면 json 반환
    // }
    await timeout(3000);
    let result = detailData;
    return result;
  }
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<Btype>
  <Navbar slot="navbar" />
  <Sidebar slot="sidebar" />

  <div slot="content">
    <div class="flex justify-between items-center my-4 mx-10">
      <div class="flex-none w-96 ml-4">
        <h3 class="text-lg">
          <span class="text-red-700">{siteList.data.length}</span>개의 발전소가 있습니다.
          <span class="ml-3">
            <Alternative
              name={"+ 새로 등록하기"}
              on:click={() => {
                modalForm = true;
              }}
            />
          </span>
        </h3>
      </div>

      <form class="flex-initial ml-4" role="search">
        <label for="simple-search" class="sr-only">검색</label>
        <div class="relative w-96">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
              ><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg
            >
          </div>
          <input
            on:keyup={(e) => {
              search = e.target.value;
            }}
            type="text"
            id="simple-search"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
        </div>
      </form>

      {#if modalForm}
        <div transition:fade={{ duration: 100 }} class="flex items-center justify-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 900; background-color: rgba(0, 0, 0, 0.6);">
          <div class="bg-white border rounded p-4 relative" style="min-width: 500px; max-width: 700px; max-height:90%; overflow-y: auto;">
            <button
              type="button"
              class="absolute text-gray-900 bg-white focus:outline-none hover:text-red-400 focus:ring-2 focus:ring-gray-200 font-medium rounded-full text-sm dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              style="top: 15px; right: 15px;"
              on:click={() => (modalForm = false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <Form form={formData} />
          </div>
        </div>
      {/if}
    </div>

    <div class="flex flex-wrap mx-10">
      {#each siteList.data as site, i}
        {#if search == "" || site.name.includes(search) || site.address.includes(search) || site.owner.includes(search)}
          <a
            use:link
            href={"/pop/sites/" + site.id}
            class="flex-col ml-4 mb-5 bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            style="min-width: {(1 + site.totalRatingOutputKW / siteList.grandTotalRatingOutputKW) * 20}rem;"
          >
            <div class="flex justify-between p-4 leading-normal">
              <h5 class="text-2xl tracking-tight text-gray-900 dark:text-white {search != '' && site.name.includes(search) ? 'text-red-500' : ''}">
                {site.name}
              </h5>
              <span class="font-normal dark:text-gray-400 {search != '' && site.address.includes(search) ? 'text-red-500' : 'text-gray-600'}">{site.owner}</span>
            </div>

            <div class="flex flex-col p-4 mb-3">
              <h5 class="mb-10 text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-emerald-600">{site.totalCurrentKW} <span class="text-lg text-slate-500">kW</span></h5>
              {#if site.sun}
                <div class="flex items-center">
                  <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.4 12.8C0.1792 12.8 0 12.6208 0 12.4V0.4C0 0.1792 0.1792 0 0.4 0H15.6C15.8208 0 16 0.1792 16 0.4V12.4C16 12.6208 15.8208 12.8 15.6 12.8H8.8V14.4H12.4C12.6208 14.4 12.8 14.5792 12.8 14.8V15.6C12.8 15.8208 12.6208 16 12.4 16H3.6C3.3792 16 3.2 15.8208 3.2 15.6V14.8C3.2 14.5792 3.3792 14.4 3.6 14.4H7.2V12.8H0.4ZM6.96018 7.19792H1.84018C1.72658 7.19792 1.63138 7.27712 1.60658 7.38272L1.60018 7.43792V10.9579C1.60018 11.0715 1.67938 11.1667 1.78498 11.1915L1.84018 11.1979H6.96018C7.07378 11.1979 7.16898 11.1187 7.19378 11.0131L7.20018 10.9579V7.43792C7.20018 7.30512 7.09298 7.19792 6.96018 7.19792ZM14.1599 7.19792H9.03994C8.92634 7.19792 8.83114 7.27712 8.80634 7.38272L8.79994 7.43792V10.9579C8.79994 11.0715 8.87914 11.1667 8.98474 11.1915L9.03994 11.1979H14.1599C14.2735 11.1979 14.3687 11.1187 14.3935 11.0131L14.3999 10.9579V7.43792C14.3999 7.30512 14.2927 7.19792 14.1599 7.19792ZM6.96018 1.6H1.84018C1.72658 1.6 1.63138 1.6792 1.60658 1.7848L1.60018 1.84V5.36C1.60018 5.4736 1.67938 5.5688 1.78498 5.5936L1.84018 5.6H6.96018C7.07378 5.6 7.16898 5.5208 7.19378 5.4152L7.20018 5.36V1.84C7.20018 1.7072 7.09298 1.6 6.96018 1.6ZM14.1599 1.6H9.03994C8.92634 1.6 8.83114 1.6792 8.80634 1.7848L8.79994 1.84V5.36C8.79994 5.4736 8.87914 5.5688 8.98474 5.5936L9.03994 5.6H14.1599C14.2735 5.6 14.3687 5.5208 14.3935 5.4152L14.3999 5.36V1.84C14.3999 1.7072 14.2927 1.6 14.1599 1.6Z"
                      fill="gray"
                    />
                  </svg>
                  <span class="ml-2">
                    {site.sun.current.kw} kW
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
                  <div class="bg-blue-600 h-2.5 rounded-full" style="width: {(site.sun.current.kw / site.sun.ratingOutputKW) * 100}%" />
                </div>
              {/if}
              {#if site.wind}
                <div class="flex items-center">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5095 0.333328C11.7909 0.333328 12.0192 0.555592 12.0192 0.829452V7.29891C13.0641 6.34238 14.5381 5.7639 16.1498 5.79069C19.1437 5.84229 21.5912 7.96868 21.6646 10.6408L21.6666 10.8472L21.6575 11.3433C21.6534 11.5864 21.4689 11.7859 21.2303 11.8236L21.1386 11.8305L13.3577 11.6975C14.7032 12.6799 15.5871 14.3339 15.5871 16.2093C15.5871 19.1483 13.4168 21.5446 10.7001 21.6617L10.4901 21.6667H9.98045C9.72969 21.6667 9.52173 21.491 9.47892 21.2598L9.47076 21.1705V14.5899C8.49216 15.3103 7.23526 15.736 5.8489 15.7132C2.69086 15.6586 0.285116 13.297 0.334046 10.5148L0.341182 10.1606C0.346279 9.88669 0.578698 9.6684 0.860047 9.67435L7.52884 9.78747C6.52781 8.79026 5.90293 7.36837 5.90293 5.79069C5.90293 2.77624 8.1843 0.333328 10.9998 0.333328H11.5095ZM11.5095 13.1202V19.2969L11.7062 19.2146C12.6767 18.7631 13.3862 17.7877 13.5238 16.6218L13.5421 16.4015L13.5482 16.209C13.5482 14.8556 12.7806 13.6947 11.6879 13.1956L11.5095 13.1202ZM2.66844 11.4053L2.68373 11.4717C3.06294 12.9303 4.38202 13.9861 5.87847 14.0119L6.05788 14.0099C7.48196 13.9553 8.74905 12.969 9.1619 11.5819L9.18025 11.5164L2.66844 11.4053ZM16.1141 7.77393C14.6768 7.75012 13.4454 8.43576 12.8592 9.42503L12.7715 9.58379L12.7165 9.70088L19.4393 9.81499L19.3884 9.69592C18.9337 8.71161 17.8674 7.96146 16.5534 7.8037L16.319 7.78286L16.1141 7.77393ZM9.98048 8.87782V2.70107L9.96825 2.70603C8.78475 3.16048 7.94172 4.36904 7.94172 5.78994L7.94681 5.98244C8.01511 7.24458 8.75212 8.31521 9.78272 8.79546L9.98048 8.87782Z"
                      fill="gray"
                    />
                  </svg>
                  <span class="ml-2">
                    {site.wind.current.kw} kW
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
                  <div class="bg-blue-600 h-2.5 rounded-full" style="width: {(site.wind.current.kw / site.wind.ratingOutputKW) * 100}%" />
                </div>
              {/if}
              {#if site.ess}
                <div class="flex items-center">
                  {#if site.ess.current.mode == 1}
                    <svg width="22" height="11" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 8.67L18 7L20 7L20 3L18 3L18 1.33C18 0.6 17.4 -1.1365e-07 16.67 -1.45559e-07L1.34 -8.15655e-07C0.599998 -8.48001e-07 -1.93358e-06 0.599999 -1.96548e-06 1.33L-2.28589e-06 8.66C-0.000669873 9.01386 0.138925 9.35357 0.388206 9.60473C0.637487 9.85588 0.976139 9.99802 1.33 10L16.67 10C17.4 10 18 9.4 18 8.67ZM2 4L7.5 4L7.5 2L15 6L9.5 6L9.5 8L2 4Z"
                        fill="green"
                      />
                    </svg>
                    <span class="ml-2">
                      {site.ess.current.kw} kW
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
                    </svg>
                  {:else if site.ess.current.mode == 2}
                    <svg width="22" height="11" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.67 2.23371e-06C17.4 2.26562e-06 18 0.600002 18 1.33L18 3L20 3L20 7L18 7L18 8.67C18 9.4 17.4 10 16.67 10L1.33 10C0.976143 9.99802 0.637492 9.85588 0.388211 9.60473C0.138929 9.35357 -0.000663569 9.01386 3.43616e-06 8.66L3.75656e-06 1.33C0.00198743 0.976142 0.14412 0.637489 0.395276 0.388208C0.646431 0.138926 0.98614 -0.000665441 1.34 1.56362e-06L16.67 2.23371e-06ZM15 2.5L2.5 2.5L2.5 7.5L15 7.5L15 2.5Z"
                        fill="#ED8987"
                      />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.375 3.75L5.625 3.75L5.625 6.25L4.375 6.25L4.375 3.75Z" fill="#ED8987" stroke="#ED8987" />
                    </svg>
                    <span class="ml-2">
                      {site.ess.current.kw} kW
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" />
                    </svg>
                  {/if}
                </div>
                <div class="flex flex-inline w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2 mb-1">
                  <div
                    class="{site.ess.current.mode == 1 ? 'bg-green-400' : 'bg-red-400'} h-2.5 rounded-full"
                    style="width: {site.ess.current.mode == 1 ? (site.ess.current.kw / site.ess.ratingInputKW) * 100 : (site.ess.current.kw / site.ess.ratingOutputKW) * 100}%"
                  />
                </div>
              {/if}
            </div>
          </a>
        {/if}
      {/each}
    </div>
  </div></Btype
>
