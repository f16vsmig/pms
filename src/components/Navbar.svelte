<script>
  import { link, location } from "svelte-spa-router";
</script>

<nav class="bg-indigo-500 px-2 sm:px-4 py-1 dark:bg-gray-900">
  <div class="container flex flex-wrap">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>

    <ul class="flex flex-col p-4 mt-4 border bg-indigo-500 text-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-indigo-500 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a use:link href="/pop/dashboard" class="{$location !== '/about' ? 'active' : ''} block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-white md:p-0 dark:text-white" aria-current="page">Home</a>
      </li>
      <li>
        <a
          use:link
          href="/about"
          class="{$location === '/about'
            ? 'active'
            : ''} block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >About</a
        >
      </li>
    </ul>
  </div>
</nav>

<style>
</style>
