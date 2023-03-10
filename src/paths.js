import About from "./pages/About.svelte";
import PermissionMap from "./pages/PermissionMap.svelte";
// import Dashboard from "./pages/Dashboard.svelte";
// import Insight from "./pages/Insight.svelte";
// import Setting from "./pages/Setting.svelte";
// import Sites from "./pages/Sites.svelte";
// import SitesDetailView from "./pages/SiteDetail.svelte";
// import Log from "./pages/Log.svelte";
// import Login from "./pages/Signin.svelte";
// import Signup from "./pages/Signup.svelte";

const routes = {
  "/": PermissionMap,
  "/map": PermissionMap,
  "/about": About,
  // "/login": Login,
  // "/signup": Signup,
  // "/home": Dashboard,
  // "/sites": Sites,
  // "/pop": Dashboard,
  // "/pop/dashboard": Dashboard,
  // "/pop/map": Map,
  // "/pop/sites": Sites,
  // "/pop/sites/:id": SitesDetailView,
  // "/pop/sites/log/:id": Log,
  // "/pop/insight": Insight,
  // "/pop/setting": Setting,
};

export default routes;
