<script context="module">
  import { detailElem, modalToggle, rightSideModalScrollTop, roadVeiwBtnUrl } from "../../store";

  /**
   * 지도에서 자산 세부정보 모달창을 띄움
   * @param elem json : {id, address, jibun, name, logs}
   */
  export function detailVeiw(elem) {
    modalToggle.set(true);
    detailElem.set(elem);
    rightSideModalScrollTop.set(0);
    roadVeiwBtnUrl.set("https://map.kakao.com/link/roadview/" + elem.yAxis + "," + elem.xAxis);
    mapLevel.set(4);
    mapCenter.set(new kakao.maps.LatLng(elem.yAxis, elem.xAxis));
  }
</script>

<script>
  import { map, mapLevel, mapCenter, rightSideModal } from "../../store";
  import { slide } from "svelte/transition";
  import Alternative from "../btn/Alternative.svelte";

  export let data;
  let search = "";
  let name = "";

  function handler(dt) {
    $detailElem = dt;
    detailVeiw(dt);
    $map.setLevel($mapLevel);
    $map.setCenter($mapCenter);
    $map.panBy(200, 0);
    if ($rightSideModal) {
      $rightSideModal.scrollTop = 0;
    }
    name = dt.name;
  }
</script>

<div class="p-2 pb-0 w-sm-50 w-xl-60" style="position: absolute; height:57px; top: 0; left: 0; z-index: 50; background-color: rgba(255,255,255, 0.5);" transition:slide={{ duration: 100 }}>
  <div class="whitespace-nowrap pt-1 pb-2 ps-0 ml-20" style="overflow-x: auto; overflow-y: hidden;">
    {#each data as dt}
      {#if search == "" || dt.name.includes(search)}
        <Alternative name={dt.name} active={name == dt.name ? true : false} on:click={handler(dt)} />
      {/if}
    {/each}
  </div>

  <form class="flex-none items-center">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
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
    <button
      type="submit"
      class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <span class="sr-only">검색</span>
    </button>
  </form>
</div>
