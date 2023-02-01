<script>
  import Navbar from "../components/Navbar.svelte";
  import Atype from "../layout/Btype.svelte";
</script>

<Atype>
  <Navbar slot="navbar" />

  <div slot="content">
    <div class="p-3 pe-5">
      <h1>Setting</h1>
    </div>
  </div>
</Atype>
