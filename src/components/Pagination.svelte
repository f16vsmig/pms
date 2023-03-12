<script>
  import { createEventDispatcher } from "svelte";

  export let lastPageNo;
  export let currentPage = 1;
  const pageCnt = 8;

  const pageArr = () => {
    const startPage = Math.ceil(currentPage / pageCnt);
    const nextStartPage = startPage + pageCnt;
    const lastPage = Math.min(nextStartPage - 1, lastPageNo);

    let pages = [];
    for (let i = 0; i < lastPage; i++) {
      let item = i + 1;
      pages.push(item);
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
</script>

<nav aria-label="Page navigation" class="flex justify-between">
  <ul class="inline-flex items-center -space-x-px">
    <li>
      <button href="#" class="block px-3 py-2 ml-0 leading-tight text-gray-500 hover:text-gray-700">
        <span class="sr-only">Previous</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg
        >
      </button>
    </li>

    {#each pageArr() as pageNo}
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
      <button href="#" class="block px-3 py-2 ml-0 leading-tight text-gray-500 hover:text-gray-700">
        <span class="sr-only">Next</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg
        >
      </button>
    </li>
  </ul>
</nav>
