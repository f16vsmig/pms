<script>
  import { modalFormToggle } from "../store";
  import Form from "./Form.svelte";

  export let form;
</script>

{#if $modalFormToggle}
  <div class="centering" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 900; background-color: rgba(0, 0, 0, 0.6);">
    <div class="bg-white border rounded p-4 position-relative" style="min-width: 500px; max-width: 700px; max-height:90%; overflow-y: auto;">
      <button type="button" class="btn btn-light bg-white border-0 mx-1 position-absolute" style="top: 5px; right: 5px;" on:click={() => ($modalFormToggle = false)}>
        <i class="fa-solid fa-xmark" />
      </button>

      <Form {form} />
    </div>
  </div>
{/if}
