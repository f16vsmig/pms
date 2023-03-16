<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let lastPageNo;
  export let currentPage = 1;

  let pageCnt = 8;
  let pages = [];

  const pageArr = () => {
    if (currentPage < 100) {
      pageCnt = 8;
    } else if (currentPage >= 100 && currentPage < 1000) {
      pageCnt = 7;
    } else if (currentPage >= 1000) {
      pageCnt = 6;
    }

    const pageStep = Math.ceil(currentPage / pageCnt);
    const nextStartPage = pageStep * pageCnt - pageCnt + 1;
    const lastPage = Math.min(nextStartPage - 1, lastPageNo);
    console.log("ggg", lastPageNo);
    pages = []; // 페이지 초기화

    for (let i = 0; i < pageCnt; i++) {
      let item = pageStep * pageCnt - pageCnt + i + 1;
      if (item <= lastPageNo) {
        pages.push(item);
      }
    }
    return pages;
  };

  const dispatch = createEventDispatcher();

  function moveTo() {
    dispatch("moveTo", {
      ctn: pageCnt,
      currentPage: currentPage,
    });
  }

  onMount(() => pageArr());
</script>

<nav aria-label="Page navigation" class="flex justify-between">
  <ul class="inline-flex items-center -space-x-px">
    <li>
      <button
        on:click={() => {
          if (pages[0] != 1) {
            currentPage = pages[0] - 1;
          }
          pageArr();
          moveTo();
        }}
        href="#"
        class="block px-3 py-2 ml-0 leading-tight text-gray-500 hover:text-gray-700"
      >
        <span class="sr-only">Previous</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg
        >
      </button>
    </li>

    {#each pages as pageNo}
      <li>
        <button
          on:click={() => {
            if (currentPage != pageNo) {
              currentPage = pageNo;
              moveTo();
            }
          }}
          class="px-3 py-2 leading-tight {currentPage == pageNo ? 'text-blue-500 underline' : 'text-gray-500 hover:text-gray-700'}">{pageNo}</button
        >
      </li>
    {/each}

    <li>
      <button
        on:click={() => {
          if (pages[pages.length - 1] < lastPageNo) {
            currentPage = pages[pages.length - 1] + 1;
          }
          pageArr();
          moveTo();
        }}
        href="#"
        class="block px-3 py-2 ml-0 leading-tight text-gray-500 hover:text-gray-700"
      >
        <span class="sr-only">Next</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg
        >
      </button>
    </li>
  </ul>
</nav>
