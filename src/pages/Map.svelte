<script>
  import Btype from "../layout/Btype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/SideMenubar.svelte";
  import Map from "../components/Map.svelte";
</script>

<Btype>
  <Navbar slot="navbar" />

  <Sidebar slot="sidebar" />

  <Map slot="content" />
</Btype>
