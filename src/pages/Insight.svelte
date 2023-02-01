<script>
  import Btype from "../layout/Btype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/SideMenubar.svelte";
</script>

<Btype>
  <Navbar slot="navbar" />
  <Sidebar slot="sidebar" />

  <div class="p-3 pe-5" slot="content">
    <h1>Insight</h1>
    <img src="/public/static/img/insight.png" alt="인사이트 샘플" style="width: 100%; height: 70%; object-fit:contain" />
  </div>
</Btype>
