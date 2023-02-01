<script>
  import ArchitectureBasis from "./ArchitectureBasis.svelte";
  import { mgmBldrgstPk } from "../store";

  export let data = "";
</script>

{#if Array.isArray(data)}
  {#each data as d}
    {#if d.mgmBldrgstPk == $mgmBldrgstPk}
      <ArchitectureBasis data={d} />
    {/if}
  {/each}
{:else}
  <ArchitectureBasis {data} />
{/if}
