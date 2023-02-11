<script>
  import { onMount } from "svelte";

  import { mgmBldrgstPk } from "../store";
  import { addComma } from "../utils";

  export let brFlrOulnInfo;

  let floorAreaArr = {};

  function floorTotalArea(pk) {
    let floorArea = {};
    console.log("brflroulninfo : ", brFlrOulnInfo);
    for (let i = 0; i < brFlrOulnInfo.length; i++) {
      let info = brFlrOulnInfo[i];
      if ((i == 0 || info.flrNoNm != brFlrOulnInfo[i - 1].flrNoNm) && pk == info.mgmBldrgstPk) {
        console.log("info1:", info);
        console.log("info1:", info, info.area);
        floorArea[info.flrNoNm] = info.area;
      } else if (pk == info.mgmBldrgstPk) {
        console.log("info2:", info, info.area);
        floorArea[info.flrNoNm] = floorArea[info.flrNoNm] ? floorArea[info.flrNoNm] + info.area : info.area;
      }
    }
    console.log("fff:", floorArea);
    return floorArea;
  }

  $: floorAreaArr = floorTotalArea($mgmBldrgstPk);

  // onMount(() => {
  // floorTotalArea($mgmBldrgstPk);
  // console.log("floorAreaArr : ", floorAreaArr);
  // });
</script>

<div class="flex-col flex-wrap px-2 mb-4">
  {#each brFlrOulnInfo as fl, id}
    {#if fl.mgmBldrgstPk == $mgmBldrgstPk}
      {#if id == 0 || fl.flrNoNm != brFlrOulnInfo[id - 1].flrNoNm || fl.mgmBldrgstPk != brFlrOulnInfo[id - 1].mgmBldrgstPk}
        <div class="grow mt-3 px-1 text-sm flex justify-between font-light">
          <span class="flex-none me-3">{fl.flrNoNm}</span>
          <span class="flex-none me-1 text-muted flex text-sm"
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 mr-1">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
              />
            </svg>
            {addComma(floorAreaArr[fl.flrNoNm])} m2
          </span>
        </div>
      {/if}
      <div class="flex-none fw-light px-1 my-1">
        <button
          type="button"
          class="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >{fl.mainPurpsCdNm}
          <span class="{fl.flrNoNm} {fl.areaExctYn == 1 ? 'text-muted' : ''}">({addComma(fl.area)})</span></button
        >
      </div>
    {/if}
  {/each}
</div>
