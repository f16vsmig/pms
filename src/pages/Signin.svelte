<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import { submitForm } from "../utils";
  import { link } from "svelte-spa-router";

  let form;
</script>

<Atype>
  <Navbar slot="navbar" />

  <div slot="content">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title mb-5">๐ฎ ๋ก๊ทธ์ธ</h4>
          <form bind:this={form} method="post" action="/login">
            <div class="mb-3">
              <label for="email">์ด๋ฉ์ผ</label>
              <input type="email" class="form-control" id="email" name="email" placeholder="abc123@gmail.com" />
            </div>
            <div class="mb-3">
              <label for="password">ํจ์ค์๋</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="password" />
            </div>
            <div class="d-flex justify-content-between mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="saveEmailCheck" />
                <label class="form-check-label fw-light" for="saveEmailCheck"> ์ด๋ฉ์ผ ์ ์ฅํ๊ธฐ </label>
              </div>
            </div>
            <div class="d-grid gap-2 my-5">
              <button
                on:click|preventDefault={() => {
                  submitForm(form);
                }}
                type="submit"
                class="btn btn-primary px-4">๋ก๊ทธ์ธ</button
              >
            </div>
          </form>
          <div class="my-5 text-center">
            <a use:link href="/signup" class="card-link mx-4 text-decoration-none">ํ์๊ฐ์</a>
            <span class="text-muted">|</span>
            <a href="/" class="card-link mx-4 text-decoration-none">์์ด๋ ์ฐพ๊ธฐ</a>
            <span class="text-muted">|</span>
            <a href="/" class="card-link mx-4 text-decoration-none">๋น๋ฐ๋ฒํธ ์ฐพ๊ธฐ</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</Atype>

<style>
  .container {
    /* height: calc(100vh - 57px - 250px); */
    display: flex;
    /* align-items: center; */
    justify-content: center;
  }

  .card {
    width: 400px;
    padding: 15px 20px;
    margin: 50px 0;
  }
</style>
