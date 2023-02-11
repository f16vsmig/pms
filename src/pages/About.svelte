<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
</script>

<Atype>
  <Navbar slot="navbar" />

  <div class="p-3 text-center" slot="content">
    <h1>건축물대장 Beta (2023/02/11)</h1>
  </div>
</Atype>
