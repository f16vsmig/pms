<script>
  export let form;
</script>

<form method="POST" action={form.action}>
  <div class="mb-5 text-xl"><h3>{form.title}</h3></div>
  {#each form.inputElements as f}
    <div class="mb-6">
      <label for={"id-" + f.name} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{f.label}</label>

      <input
        type={f.type}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={"id-" + f.name}
        name={f.name}
        placeholder={f.placeholder}
      />
    </div>
  {/each}
</form>
