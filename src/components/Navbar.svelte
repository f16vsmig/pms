<script>
  import { link, location } from "svelte-spa-router";
  import { detailVeiw } from "../assets/etc/Search.svelte";
  import { mobileView, siteList, rightSideModal, map, modal, siteModal, siteListModal, detailElem } from "../store";

  let open = $mobileView ? false : true;

  let searchInput;
  let searchTerm = "";
  let searchToggle = false;

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

  const startSearch = () => {
    searchToggle = true;
    waitForElment("#simple-search").then((elm) => {
      console.log(elm);
      searchInput.focus();
    });
  };

  // 우편번호 찾기 화면을 넣을 element
  var findAddressPopup;

  function closeDaumPostcode() {
    // iframe을 넣은 element를 안보이게 한다.
    findAddressPopup.style.display = "none";
  }

  function Pin(elem) {
    let geocoder = new kakao.maps.services.Geocoder();
    let address = elem.address;
    console.log("엘리먼트 : ", elem, elem.address);

    return geocoder.addressSearch(address, function (result, status) {
      if (status == kakao.maps.services.Status.OK) {
        // setMarkerLabel(result, label);

        console.log("지오코더 : ", result, status);
        setMarker(elem, result);
        $map.setLevel(4);

        $map.setCenter(new kakao.maps.LatLng(result[0].y, result[0].x));
        // elem.xAxis = result[0].x; // x축 추가
        // elem.yAxis = result[0].y; // y축 추가
      }
    });
  }

  function setMarker(elem, coord) {
    let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);
    // let imageSrc = "/public/icon/pv.png",
    //   imageSize = new kakao.maps.Size(24, 24),
    //   imageOption = { offset: new kakao.maps.Point(16, 28) },
    // markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
      map: $map,
      title: elem.id,
      // image: markerImage,
      position: coords,
      clickable: true,
    });
    console.log("setmarker:", elem);
    // let markerLabel = new kakao.maps.CustomOverlay({
    //   content: makePinLabel(elem),
    //   map: kakaomap,
    //   position: coords,
    //   yAnchor: 0,
    // });

    // markers.push({ marker: marker, label: markerLabel });
    // ms.push(marker);

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

  const cityName = {
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
  };

  function execDaumPostcode() {
    new daum.Postcode({
      oncomplete: function (data) {
        // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        // var addr = data.roadAddress; // 주소 변수
        console.log("5555", data);
        let roadAddressArr = data.roadAddress.split(" ");
        let jibunAddressArr = data.autoJibunAddress == "" ? data.jibunAddress.split(" ") : data.autoJibunAddress.split(" ");
        console.log("6666", roadAddressArr, " / ", jibunAddressArr, " / ", jibunAddressArr[jibunAddressArr.length - 1]);
        console.log("7777", data.autoJibunAddress, data.autoJibunAddress == "");

        let sido = cityName[data.sido];
        let sigungu = data.sigungu;
        let roadname = data.roadname;
        let bname1 = data.bname1;
        let bname2 = data.bname2;
        let bname = data.bname;

        let roadAddress = sido + " " + sigungu + " " + roadname + " " + roadAddressArr[roadAddressArr.length - 1];
        let jibunAddress = bname1 != "" ? sido + " " + sigungu + " " + bname1 + " " + bname2 + " " + jibunAddressArr[jibunAddressArr.length - 1] : sido + " " + sigungu + " " + bname + " " + jibunAddressArr[jibunAddressArr.length - 1];
        console.log("88888", roadAddress, " / ", jibunAddress);
        var site = {
          id: $siteList.length + 1,
          address: roadAddress,
          jibun: jibunAddress,
          name: data.buildingName ? data.buildingName : "N/A",
          owner: "-",
          todos: [],
        };
        $siteList = [...$siteList, site];
        console.log("새로 등록한 사이트", site, site.jibun);
        Pin(site);
        detailVeiw(site);

        $modal = true;
        $siteModal = true;
        $siteListModal = false;

        searchToggle = false;
        findAddressPopup.style.display = "none";
      },

      width: "100%",
      height: "100%",
      maxSuggestItems: 5,
    }).embed(findAddressPopup);

    // iframe을 넣은 element를 보이게 한다.
    findAddressPopup.style.display = "block";

    // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
    // initLayerPosition();
    // findAddressPopup.style.left = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth + "px";
    // findAddressPopup.style.top = ((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth + "px";
  }
</script>

<nav class="bg-white border-b border-gray-100 z-50">
  <div class="flex items-center justify-between">
    <button
      type="button"
      class="flex-none items-center p-2 my-1 ml-2 text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      on:click={() => (open = !open)}
    >
      <span class="sr-only">Open main menu</span>
      {#if open}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      {:else}
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg
        >
      {/if}
    </button>

    <h1 class="flex-none p-1 text-lg md:ml-8 dark:text-white">건축물대장</h1>

    {#if open}
      <!-- <div class="w-full max-sm:w-64 max-sm:absolute max-sm:top-16 max-sm:mx-2 z-50"> -->
      <ul
        class="flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50 z-50 max-sm:absolute max-sm:top-14 max-sm:left-2 md:flex-row md:space-x-8 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
      >
        <li class="max-sm:my-2">
          <a
            use:link
            href="/"
            class="{$location === '/'
              ? 'active'
              : ''} flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">지도보기</a
          >
        </li>
        <li class="max-sm:my-2">
          <a
            use:link
            href="/about"
            class="{$location === '/about'
              ? 'active'
              : ''} flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a
          >
        </li>
      </ul>
    {/if}

    <form class="relative flex-none flex justify-self-end mr-2" role="search">
      <label for="simple-search" class="sr-only">검색</label>
      <div class="flex justify-end">
        {#if !searchToggle}
          <div class="flex-initial inset-y-0 items-center pl-3">
            <!-- <button class="pt-1 pr-2" on:click|preventDefault={startSearch}> -->
            <button
              class="pt-1 pr-2"
              on:click|preventDefault={() => {
                searchToggle = true;
                execDaumPostcode();
              }}
            >
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                ><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg
              >
            </button>
          </div>
        {:else}
          <div class="flex-initial inset-y-0 items-center pl-3 pr-2">
            <button
              style="pt-1 pr-2"
              on:click={() => {
                searchToggle = false;
                closeDaumPostcode();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/if}

        <!-- {:else}
          <div class="flex-initial inset-y-0 items-center pl-3">
            <button class="pt-1 pr-2" on:click|preventDefault={() => (searchToggle = false)}>
            <button class="pt-1 pr-2" on:click|preventDefault={findBuilding}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            bind:this={searchInput}
            on:keyup={(e) => (searchTerm = e.target.value)}
            type="text"
            id="simple-search"
            class="absolute top-0 right-10 border-b-2 rounded-none max-sm:w-64 text-gray-900 text-sm focus:outline-none focus:border-b-indigo-500 p-1 pl-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
            placeholder="Search"
            required
          />
        {/if} -->
      </div>
    </form>
  </div>
  <div bind:this={findAddressPopup} class="bg-white py-2 border max-sm:w-full md:w-96 md:h-[500px] md:right-0 h-96 top-10" style="display: none; position: fixed; overflow: hidden; z-index: 999; -webkit-overflow-scrolling: touch" />
</nav>

<style>
  a.active {
    font-weight: 500;
    color: blue;
  }
</style>
