<script>
  import { link } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import { sidebarVisable } from "../store";
</script>

<aside aria-label="Sidebar" class="h-full">
  <div class="h-full py-4 pl-1 pr-3 ml-2 text-slate-600 dark:bg-gray-800">
    <ul class="space-y-1">
      <li class="menu active" use:active={"/pop/dashboard"}>
        <a use:link href="/pop/dashboard" class="flex pl-2.5 items-center p-2 text-base">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>

          {#if $sidebarVisable}
            <span class="pl-2 pr-6 w-24">대시보드</span>
          {/if}
        </a>
      </li>

      <li class="menu" use:active={"/pop/sites/*"}>
        <a use:link href="/pop/sites/" class="flex pl-2.5 items-center p-2 text-base font-normal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>

          {#if $sidebarVisable}
            <span class="pl-2 pr-6">자원목록</span>
          {/if}
        </a>
      </li>

      <li class="menu" use:active={"/pop/map"}>
        <a use:link href="/pop/map" class="flex pl-2.5 items-center p-2 text-base font-normal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>

          {#if $sidebarVisable}
            <span class="pl-2 pr-6">지도보기</span>
          {/if}
        </a>
      </li>

      <li class="menu" use:active={"/pop/insight"}>
        <a use:link href="/pop/insight" class="flex pl-2.5 items-center p-2 text-base font-normal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>

          {#if $sidebarVisable}
            <span class="pl-2 pr-6">인사이트</span>
          {/if}
        </a>
      </li>
    </ul>

    <ul class="space-y-1 mt-10">
      <li class="menu" use:active={"/pop/setting"}>
        <a use:link href="/pop/setting" class="flex pl-2.5 items-center p-2 text-base font-normal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          {#if $sidebarVisable}
            <span class="pl-2 pr-6">설정</span>
          {/if}
        </a>
      </li>
    </ul>
    <a
      href={null}
      class="inline-flex items-center py-2.5 pl-2.5 mr-2 mb-2 mt-56 text-sm font-medium text-gray-500 hover:text-blue-600 cursor-pointer"
      on:click|preventDefault={() => {
        $sidebarVisable = !$sidebarVisable;
      }}
    >
      {#if $sidebarVisable}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      {/if}
    </a>
  </div>
</aside>

<style>
  li.menu {
    color: black;
  }

  li.menu:hover {
    background-color: rgb(238, 238, 238);
    border-radius: 5px;
  }

  li.menu.active {
    background-color: rgb(100, 102, 233);
    color: rgb(255, 255, 255);
    border-radius: 5px;
  }
</style>
