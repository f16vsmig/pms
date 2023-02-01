<script>
  import { onMount } from "svelte";
  import { link, location } from "svelte-spa-router";
  import { slide, fade } from "svelte/transition";

  let open = true;

  const mobile = () => /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const animate = mobile() ? slide : fade;

  onMount(() => {
    if (mobile()) {
      open = false;
    }
  });
</script>

<nav class="p-2 dark:bg-gray-900">
  <div class="container flex flex-wrap items-center justify-between">
    <button
      type="button"
      class="inline-flex items-center p-2 ml-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      on:click={() => (open = !open)}
    >
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
        ><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg
      >
    </button>

    {#if open}
      <div class="w-full md:block md:w-auto" transition:animate={{ duration: mobile() ? 100 : 0 }}>
        <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a
              use:link
              href="/home"
              class="{$location === '/home'
                ? 'active'
                : ''} block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</a
            >
          </li>
          <li>
            <a
              use:link
              href="/sites"
              class="{$location === '/sites'
                ? 'active'
                : ''} block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">자산목록</a
            >
          </li>
          <li>
            <a
              use:link
              href="/about"
              class="{$location === '/about'
                ? 'active'
                : ''} block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a
            >
          </li>
        </ul>
      </div>
    {/if}
  </div>
</nav>

<style>
</style>
