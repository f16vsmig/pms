<script>
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import Loading from "./assets/etc/Loading.svelte";
  import paths from "./paths";

  let loading = true;

  onMount(async () => {
    loading = false;
  });
</script>

{#if loading}
  <Loading />
{:else}
  <Router routes={paths} />
{/if}

<style global lang="postcss">
  @tailwind base;

  body {
    font-family: "Noto Sans KR", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }

  @tailwind components;
  @tailwind utilities;

  :global(input::-webkit-input-placeholder) {
    line-height: normal !important;
  }
</style>
