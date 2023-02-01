<script>
  import Architecture from "./Architecture.svelte";
  import BarChart from "../assets/chart/Bar.svelte";
  import BubbleChart from "../assets/chart/Bubble.svelte";
  import CalendarChart from "../assets/chart/Calendar.svelte";
  import ColumnChart from "../assets/chart/Column.svelte";
  import RightSideModal from "./RightSlideModal.svelte";
  import WeatherDaily from "./Weather.svelte";

  import { link } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { detailElem, rightSideModalScrollTop, rightSideModal } from "../store";
  import Issue from "./Issue.svelte";
  import Icons from "./Icons.svelte";

  // export let roadViewUrl = "";

  function moveTop() {
    $rightSideModal.scrollTop = 0;
  }
</script>

<RightSideModal>
  <div slot="content">
    {#if $rightSideModalScrollTop > 200}
      <button class="btn btn-sm btn-light" on:click={moveTop} transition:fade style="position: fixed; bottom: 30px; right: 30px; z-index: 999;"><i class="fa-solid fa-angle-up" /></button>
    {/if}

    <h3 class="mt-3">
      {$detailElem.name}
      <span class="ms-3"><a class="fs-6 fw-light text-decoration-none" use:link href={"/pop/sites/" + $detailElem.id}>자세히 <i class="fa-solid fa-angle-right" /></a></span>
    </h3>
    <h6>
      {$detailElem.jibun}
    </h6>

    <Icons />

    <div class="row my-2 p-2">
      <div class="col border rounded pt-3 mb-2"><Issue /></div>
    </div>

    <div class="row mb-2 p-2">
      <div class="col-12 border rounded p-3 mb-2 position-relative"><Architecture /></div>
    </div>

    <div class="row mb-2 p-2">
      <div class="col-12 border rounded p-3 mb-2"><WeatherDaily /></div>
    </div>

    <div class="row mb-2 p-2">
      <div class="col-12 border rounded p-3 mb-2"><BarChart /></div>
      <div class="col-12 border rounded p-3 mb-2"><BubbleChart /></div>
      <div class="col-12 border rounded p-3 mb-2"><CalendarChart /></div>
      <div class="col-12 border rounded p-3 mb-2"><ColumnChart /></div>
    </div>
  </div>
</RightSideModal>
