<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import PermissionMap from "../components/PermissionMap.svelte";
</script>

<Atype>
  <Navbar slot="navbar" />
  <PermissionMap slot="content" />
</Atype>
