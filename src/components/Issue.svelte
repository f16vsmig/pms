<script>
  import { detailElem } from "../store";
  import { link } from "svelte-spa-router";
</script>

<h5>진행중인 이슈 <span class="text-danger">{$detailElem.logs.length}</span></h5>
<table class="table table-hover">
  {#if $detailElem.logs.length == 0 || !$detailElem.logs}
    <h6 class="my-4">현재 진행중인 이슈가 없습니다.</h6>
  {:else}
    <tbody class="table-group-divider">
      {#each $detailElem.logs as log}
        <tr>
          <td>{log.title}</td>
          <td class="text-end fw-light"><a use:link href={"/pop/sites/log/" + log.id}>상세보기></a></td>
        </tr>
      {/each}
    </tbody>
  {/if}
</table>
