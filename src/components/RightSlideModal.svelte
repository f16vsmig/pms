<script>
  let rightSideModal;
  let rightSideModalScrollTop;

  function moveTop() {
    rightSideModal.scrollTop = 0;
  }
</script>

<div
  class="modal-container"
  bind:this={rightSideModal}
  on:scroll={() => {
    rightSideModalScrollTop = rightSideModal.scrollTop;
    console.log(rightSideModalScrollTop);
  }}
>
  <div class="modal-content p-3">
    <div class="flex flex-col relative">
      <slot name="content" />
    </div>
  </div>
  {#if rightSideModalScrollTop > 200}
    <button
      class="text-blue-700 boder border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
      on:click={moveTop}
      style="position: fixed; bottom: 30px; right: 30px; z-index: 999;"
      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
      </svg>
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
    z-index: 100;
    width: 500px;
    height: 100%;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.93);
  }
</style>
