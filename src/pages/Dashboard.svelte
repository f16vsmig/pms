<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import { mobileView } from "../store";
</script>

<Atype>
  <Navbar slot="navbar" />

  <div class="p-3 pe-5" slot="content">
    <h1>Dashboard {$mobileView}</h1>
  </div>
</Atype>
