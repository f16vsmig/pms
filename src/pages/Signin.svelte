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
          <h4 class="card-title mb-5">🎮 로그인</h4>
          <form bind:this={form} method="post" action="/login">
            <div class="mb-3">
              <label for="email">이메일</label>
              <input type="email" class="form-control" id="email" name="email" placeholder="abc123@gmail.com" />
            </div>
            <div class="mb-3">
              <label for="password">패스워드</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="password" />
            </div>
            <div class="d-flex justify-content-between mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="saveEmailCheck" />
                <label class="form-check-label fw-light" for="saveEmailCheck"> 이메일 저장하기 </label>
              </div>
            </div>
            <div class="d-grid gap-2 my-5">
              <button
                on:click|preventDefault={() => {
                  submitForm(form);
                }}
                type="submit"
                class="btn btn-primary px-4">로그인</button
              >
            </div>
          </form>
          <div class="my-5 text-center">
            <a use:link href="/signup" class="card-link mx-4 text-decoration-none">회원가입</a>
            <span class="text-muted">|</span>
            <a href="/" class="card-link mx-4 text-decoration-none">아이디 찾기</a>
            <span class="text-muted">|</span>
            <a href="/" class="card-link mx-4 text-decoration-none">비밀번호 찾기</a>
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
