<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/SideMenubar.svelte";
  import Btype from "../layout/Btype.svelte";
</script>

<Btype>
  <Navbar slot="navbar" />
  <Sidebar slot="sidebar" />

  <div slot="content">
    <div class="row">
      <div class="col">
        <img src="https://www.finereport.com/kr/wp-content/uploads/2022/02/insurance-dashboard-1536x1021-1.png" alt="대시보드 샘플" style="width: 80%; height: 70%; object-fit:contain" />
      </div>
    </div>
  </div>
</Btype>
