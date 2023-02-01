<script>
  import { pop } from "svelte-spa-router";
  import { fly } from "svelte/transition";

  export let params = {};
</script>

<div class="w-100 h-100 bg-white p-3 pe-5" style="position: absolute; left:0; top:0; z-index:100; max-width: 100%; max-height:100%; overflow-y: auto;" transition:fly={{ x: 2000, duration: 400 }}>
  <div class="row">
    <div class="col-auto">
      <button on:click={pop} type="button" class="btn btn-light bg-white rounded-circle" style="position: sticky; top: 5px; width: 38px; height: 38px;"><i class="fa-solid fa-angle-left" /></button>
    </div>

    <div class="col pe-3" style="height: 100%">
      <div class="row" style="height: 100%; overflow-y : auto">
        <div class="col-12">
          <h1>{params.id} 상세정보 보기</h1>
        </div>
      </div>
    </div>
  </div>
</div>
