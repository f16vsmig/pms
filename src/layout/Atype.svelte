<div class="h-screen">
  <div class="navbar">
    <slot name="navbar" />
  </div>

  <div class="content">
    <slot name="content" />
  </div>
</div>

<style>
  div.content {
    height: calc(100vh - 52px);
  }
</style>
