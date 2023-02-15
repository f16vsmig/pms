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

  let openFloor = "";
</script>

<div class="flex-col flex-wrap mb-4">
  {#each brFlrOulnInfo as fl, id}
    {#if fl.mgmBldrgstPk == $mgmBldrgstPk}
      {#if id == 0 || fl.flrNoNm != brFlrOulnInfo[id - 1].flrNoNm || fl.mgmBldrgstPk != brFlrOulnInfo[id - 1].mgmBldrgstPk}
        <div class="grow mt-3 px-1 text-sm font-light {openFloor == fl.flrNoNm ? 'text-indigo-600' : ''}">
          <button
            class="flex w-full my-1"
            on:click={() => {
              if (openFloor == fl.flrNoNm) {
                openFloor = "";
              } else {
                openFloor = fl.flrNoNm;
              }
            }}
          >
            <span class="basis-2/12 w-16 flex text-sm pl-1"
              >{fl.flrNoNm}

              {#if openFloor == fl.flrNoNm}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              {/if}
            </span>
            <span class="basis-6/12 text-muted flex text-sm justify-center">
              {fl.mainPurpsCdNm}
            </span>
            <span class="basis-4/12 text-muted flex justify-end text-sm pr-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 pr-1">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                />
              </svg>
              {addComma(floorAreaArr[fl.flrNoNm])} m2
            </span>
          </button>
          {#if openFloor != fl.flrNoNm}
            <hr />
          {/if}
        </div>
      {/if}
      <div class="{openFloor != fl.flrNoNm ? 'hidden' : ''} grow flex bg-slate-50 fw-light px-1 py-1.5 font-light">
        <span class="basis-2/12 flex text-sm pl-1" />
        <span class="basis-6/12 text-muted flex text-sm justify-center">
          {fl.mainPurpsCdNm}
        </span>
        <span class="basis-4/12 text-end pr-1 text-muted {fl.areaExctYn == 1 ? 'text-red-200' : ''} text-sm">
          {addComma(fl.area)} m2
        </span>
      </div>
    {/if}
  {/each}
</div>
