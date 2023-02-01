<script>
  import { pop } from "svelte-spa-router";
  import { fly } from "svelte/transition";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/SideMenubar.svelte";
  import Btype from "../layout/Btype.svelte";

  import Loading from "../assets/etc/Loading.svelte";
  import BarChart from "../assets/chart/Bar.svelte";
  import BubbleChart from "../assets/chart/Bubble.svelte";
  import CalendarChart from "../assets/chart/Calendar.svelte";
  import ColumnChart from "../assets/chart/Column.svelte";
  import { link } from "svelte-spa-router";
  import { detailElem } from "../store";
  import Issue from "../components/Issue.svelte";
  import Icons from "../components/Icons.svelte";

  export let params = {};

  let data = {
    id: 2,
    address: "서울 종로구 종로 33",
    name: "그랑서울",
    logs: [
      {
        id: 15,
        title: "본죽 천장 누수 발생",
        status: 1,
      },
      {
        id: 21,
        title: "로비 회전문 고장",
        status: 1,
      },
    ],
  };

  $detailElem = data;

  let promise = getData();
  async function getData() {
    await timeout(2000);
    let result = data;

    return result;
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<Btype>
  <Navbar slot="navbar" />
  <Sidebar slot="sidebar" />

  <div class="row m-0" slot="content" transition:fly={{ x: 2000, duration: 200, opacity: 100 }}>
    <div class="col-auto ps-1 pt-4">
      <button on:click={pop} type="button" class="btn btn-light bg-white rounded-circle border-0" style="position: sticky; top: 5px; width: 38px; height: 38px;"><i class="fa-solid fa-angle-left" /></button>
    </div>

    <div class="col px-0 py-3 pe-5">
      <div class="row mb-3">
        <span class="col-auto fs-2">{$detailElem.name} {params.id}번</span>
        <span class="col-auto align-text-top">{$detailElem.address}</span>
        <span class="col-auto ms-3"><Icons /></span>
      </div>

      {#await promise}
        <Loading />
      {:then result}
        <div class="row">
          <div class="col-6 mb-4">
            <div class="border rounded p-3" style="height: 350px;">
              <Issue />
            </div>
          </div>

          <div class="col-6 mb-4">
            <div class="border rounded p-3" style="height: 350px;">
              <BarChart />
            </div>
          </div>

          <div class="col-6 mb-4">
            <div class="border rounded p-3" style="height: 350px;">
              <BubbleChart />
            </div>
          </div>

          <div class="col-6 mb-4">
            <div class="border rounded p-3" style="height: 350px;">
              <CalendarChart />
            </div>
          </div>

          <div class="col-12 mb-4">
            <div class="border rounded p-3" style="height: 350px;">
              <ColumnChart />
            </div>
          </div>
        </div>
      {/await}
    </div>
  </div>
</Btype>
