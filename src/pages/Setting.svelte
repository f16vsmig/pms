<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/SideMenubar.svelte";
  import Btype from "../layout/Btype.svelte";
</script>

<Btype>
  <Navbar slot="navbar" />
  <Sidebar slot="sidebar" />

  <div slot="content">
    <div class="p-3 pe-5">
      <h1>Setting</h1>
    </div>

    <img src="/public/static/img/setting.png" alt="설정 샘플" style="width: 100%; height: 70%; object-fit:contain" />
  </div>
</Btype>
