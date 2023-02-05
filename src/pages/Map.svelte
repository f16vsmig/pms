<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import Map from "../components/Map.svelte";
</script>

<Atype>
  <Navbar slot="navbar" />
  <Map slot="content" />
</Atype>
