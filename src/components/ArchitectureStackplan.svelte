<script>
  import { onMount } from "svelte";

  import { mgmBldrgstPk } from "../store";
  import { addComma } from "../utils";

  export let brFlrOulnInfo;

  let floorAreaArr = {};

  function floorTotalArea() {
    for (let i = 0; i < brFlrOulnInfo.length; i++) {
      let info = brFlrOulnInfo[i];
      if (i == 0 || info.flrNoNm != brFlrOulnInfo[i - 1].flrNoNm) {
        floorAreaArr[info.flrNoNm] = info.area;
      } else {
        floorAreaArr[info.flrNoNm] = floorAreaArr[info.flrNoNm] + info.area;
      }
    }
    return;
  }

  onMount(() => {
    floorTotalArea();
  });
</script>

<div class="row px-2 mb-4">
  {#each brFlrOulnInfo as fl, id}
    {#if fl.mgmBldrgstPk == $mgmBldrgstPk}
      {#if id == 0 || fl.flrNoNm != brFlrOulnInfo[id - 1].flrNoNm}
        <div class="col-12 mt-3 px-1">
          <span class="me-3">{fl.flrNoNm}</span>
          <span class="me-1 text-muted" style="font-size: 13px;"
            ><i class="fa-solid fa-vector-square" />
            {addComma(floorAreaArr[fl.flrNoNm])} m2</span
          >
        </div>
      {/if}
      <div class="col fw-light px-1 my-1">
        <button class="btn btn-sm btn-outline-secondary w-100">
          {fl.mainPurpsCdNm}
          <span class="{fl.flrNoNm} {fl.areaExctYn == 1 ? 'text-muted' : ''}">({addComma(fl.area)})</span>
        </button>
      </div>
    {/if}
  {/each}
</div>
