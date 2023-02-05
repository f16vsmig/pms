<script>
  import { link, location } from "svelte-spa-router";
  import { mobileView } from "../store";

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
</script>

<nav class="dark:bg-gray-900 z-50">
  <div class="flex flex-wrap items-center justify-between">
    <button
      type="button"
      class="flex-none items-center p-2 mt-2 ml-2 text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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

    <a href="/" class="flex-none p-1 text-lg md:ml-8 dark:text-white">자산관리시스템</a>

    {#if open}
      <!-- <div class="w-full max-sm:w-64 max-sm:absolute max-sm:top-16 max-sm:mx-2 z-50"> -->
      <ul
        class="flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50 max-sm:absolute max-sm:top-14 max-sm:left-2 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
      >
        <li class="max-sm:my-2">
          <a
            use:link
            href="/"
            class="{$location === '/'
              ? 'active'
              : ''} flex-initial py-2 pl-3 pr-4 max-sm:rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</a
          >
        </li>
        <li class="max-sm:my-2">
          <a
            use:link
            href="/sites"
            class="{$location === '/sites'
              ? 'active'
              : ''} flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">자산목록</a
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
          <div class="flex-initial inset-y-0 items-center pl-3">
            <button class="pt-1 pr-2" on:click|preventDefault={() => (searchToggle = false)}>
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
            class="absolute w-64 top-0 right-10 border-b-2 text-gray-900 text-sm focus:outline-none focus:border-b-indigo-500 p-1 pl-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
            placeholder="Search"
            required
          />
        {/if}
      </div>
    </form>
  </div>
</nav>

<style>
  a.active {
    font-weight: 500;
    color: blue;
  }
</style>
