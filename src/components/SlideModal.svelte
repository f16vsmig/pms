<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let rightSideModal;
  let rightSideModalScrollTop;

  function moveTop() {
    rightSideModal.scrollTop = 0;
  }

  onMount(() => moveTop());
</script>

<div
  class="modal-container z-50 max-sm:w-full md:w-1/3"
  bind:this={rightSideModal}
  on:scroll={() => {
    rightSideModalScrollTop = rightSideModal.scrollTop;
  }}
>
  <div class="modal-content md:p-3">
    <div class="flex flex-col relative">
      <slot name="content" />
    </div>
  </div>
  {#if rightSideModalScrollTop > 500}
    <button
      transition:fade
      class="text-blue-700 hover:text-blue-500 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 max-sm:bottom-5 bottom-10 md:bottom-3 right-1 z-50"
      on:click={moveTop}
      style="position: fixed; z-index: 999;"
      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
      </svg>맨 위로
    </button>
  {/if}
</div>

<style>
  /* button {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.93);
    top: calc(50% - 50px);
    right: 500px;
    width: 20px;
    height: 50px;
    z-index: 99;
  } */

  .modal-container {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    overflow-y: auto;
    background-color: rgba(255, 255, 255);
  }
</style>
