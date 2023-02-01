<div class="h-screen">
  <div class="navbar">
    <slot name="navbar" />
  </div>
  <div class="flex">
    <div class="flex-initial w-fit">
      <slot name="sidebar" />
    </div>
    <div class="grow">
      <slot name="content" />
    </div>
  </div>
</div>

<style>
  div.navbar {
    height: 60px;
  }

  div.flex {
    height: calc(100vh - 60px);
    max-height: calc(100vh - 60px);
  }

  div.grow {
    overflow-y: auto;
  }
</style>
