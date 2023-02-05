<script>
  import Navbar from "../components/Navbar.svelte";
  import Atype from "../layout/Atype.svelte";

  import { link, location } from "svelte-spa-router";
  import { fade, fly, slide } from "svelte/transition";

  import Form from "../components/Form.svelte";
  import Alternative from "../assets/btn/Alternative.svelte";

  import { clickOutside } from "../utils";

  import { mobileView } from "../store";

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

  // 엘리먼트가 로딩될 때까지 기다립니다.
  function waitForElment(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  let searchTerm = "";
  let searchToggle = false;
  let searchInput;

  const startSearch = () => {
    searchToggle = true;
    waitForElment("#simple-search").then((elm) => {
      searchInput.focus();
    });
  };

  let modalForm = false;

  function removeModal() {
    modalForm = false;
    console.log("모달 제거 동작");
  }

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

<Atype>
  <Navbar slot="navbar" />

  <div slot="content">
    <div class="flex max-sm:flex-col-reverse justify-between my-4 max-sm:px-3 md:px-10">
      <div class="sm:flex-auto md:flex-none md:w-96">
        <h3 class="text-lg max-sm:pt-5">
          <span class="text-red-700">{siteList.data.length}</span>개의 자산이 있습니다.
          <span class="ml-2 md:ml-3">
            {#if $mobileView}
              <button class="border-0 font-light text-base hover:text-indigo-500" on:click={() => (modalForm = true)}>추가하기</button>
            {:else}
              <Alternative name={"+ 새로 등록하기"} on:click={() => (modalForm = true)} />
            {/if}
          </span>
        </h3>
      </div>

      <form class="hidden md:flex md:flex-initial md:ml-4" role="search">
        <div>
          <label for="simple-search" class="sr-only">검색</label>
          <div class="flex justify-end md:w-72">
            {#if !searchToggle}
              <div class="flex-initial inset-y-0 items-center pl-3">
                <button class="pt-1 pr-2" on:click|preventDefault={startSearch}>
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                    ><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg
                  >
                </button>
              </div>
            {:else}
              <input
                bind:this={searchInput}
                on:keyup={(e) => (searchTerm = e.target.value)}
                type="text"
                id="simple-search"
                class="flex-none border-b-2 text-gray-900 text-sm focus:outline-none focus:border-b-indigo-500 block p-1 pl-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
                placeholder="Search"
                required
              />
              <div class="flex-initial inset-y-0 items-center pl-3">
                <button class="pt-1 pr-2" on:click|preventDefault={() => (searchToggle = false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </form>

      <!-- 모달폼 영역 -->
      {#if modalForm}
        <div transition:fade={{ duration: 100 }} class="flex fixed items-center justify-center w-full h-full top-0 left-0 z-50" style="overflow: hidden; background-color: rgba(0, 0, 0, 0.6);">
          <div class="bg-white border rounded p-4 relative" style="max-width: 700px; max-height:90%; overflow-y: auto;" use:clickOutside on:click_outside={removeModal}>
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

    <div class="flex flex-col md:flex-row md:flex-wrap px-0 md:px-5">
      {#each siteList.data as site, i}
        {#if searchTerm == "" || site.name.includes(searchTerm) || site.address.includes(searchTerm) || site.owner.includes(searchTerm)}
          <a use:link href={"/pop/sites/" + site.id} class="flex-col mb-5 bg-white border rounded-lg shadow-md md:flex-row md:w-96 md:mx-5 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="flex justify-between p-4 leading-normal">
              <h5 class="text-lg md:text-2xl tracking-tight text-gray-900 dark:text-white {searchTerm != '' && site.name.includes(searchTerm) ? 'text-red-500' : ''}">
                {site.name}
              </h5>
              <span class="font-normal dark:text-gray-400 {searchTerm != '' && site.address.includes(searchTerm) ? 'text-red-500' : 'text-gray-600'}">{site.owner}</span>
            </div>

            <div class="flex flex-col p-4">
              <h5 class="mb-1 md:text-3xl tracking-tight font-light">서울특별시 동작구 매봉로99</h5>
              <h5 class="mb-1 md:text-3xl tracking-tight font-light">B5F / 12F</h5>
              <h5 class="mb-1 md:text-3xl tracking-tight font-light">3,200 m2</h5>
            </div>
          </a>
        {/if}
      {/each}
    </div>

    <div class="w-full flex py-3 fixed bottom-0 border-t-2 bg-white">
      <div class="w-1/2 text-center">
        <a use:link href="/sites" class="w-3"
          ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block w-6 h-6 mx-auto pointer-events-none">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </a>
      </div>

      <div class="w-1/2 text-center">
        <a use:link href="/map" class="w-3"
          ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="block w-6 h-6 mx-auto pointer-events-none">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</Atype>
