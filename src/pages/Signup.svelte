<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
  import { submitForm } from "../utils";

  /**
   * 폼 인풋 엘리먼트의 부모 엘리먼트에 'was-validated' 클래스를 추가합니다.(부트스트랩용)
   * @param {Event & {target: HTMLInputElement}} e event
   */
  function validate(e) {
    e.target.parentElement.classList.add("was-validated");
  }

  /**
   * 패스워드가 일치하지 않으면 유효성 검증 오류가 발생합니다.
   * @param {Event & {target: HTMLInputElement}} e event
   */
  function passwordConfirmFn(e) {
    if (password == confirm) {
      e.target.setCustomValidity("");
    } else {
      e.target.setCustomValidity("비밀번호가 일치하지 않습니다.");
    }

    validate(e);
  }

  /**
   * 폼 인풋 엘리먼트의 부모 엘리먼트에 'was-validated' 클래스를 추가합니다.(부트스트랩용)
   * @param {Event & {target: HTMLInputElement}} e event
   */
  function initValidation(e) {
    e.target.parentElement.classList.remove("was-validated");
  }

  /**
   * 폼을 제출합니다.
   */
  function submit() {
    submitForm(form);
  }

  /** @type {HTMLElement} */
  let form;

  /** @type {HTMLElement} */
  let passwordConfirm;

  /** @type {string} */
  let password;

  /** @type {string} */
  let confirm;

  /** @type {string} 문자,숫자,특수문자 포함 8~20자리 */
  const passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&^])[A-Za-z\\d$@$!%*#?&^]{8,20}$";
</script>

<Atype>
  <Navbar slot="navbar" />

  <div slot="content">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title mb-4">회원가입 <i class="bi bi-person-plus-fill" /></h4>

          <form bind:this={form} method="POST" action="/signup">
            <div class="mb-4 form-floating">
              <input on:focus={initValidation} on:blur={validate} type="email" class="form-control" id="email" name="email" placeholder="abc123@gmail.com" required />
              <label for="email">이메일</label>
              <div class="invalid-feedback">이메일 형식에 맞춰 입력하세요.</div>
            </div>

            <div class="mb-2 form-floating">
              <input on:focus={initValidation} on:blur={validate} bind:value={password} type="password" class="form-control" id="password" name="password" placeholder="패스워드" pattern={passwordPattern} required />
              <label for="password">패스워드</label>
              <div class="form-text">문자, 숫자, 특수문자 포함 8~20자리를 입력하세요.(괄호 제외)</div>
              <div class="valid-feedback">사용 가능한 비밀번호 입니다.</div>
              <div class="invalid-feedback">비밀번호 형식에 따라 다시 입력하세요.</div>
            </div>

            <div class="mb-4 form-floating">
              <input on:focus={initValidation} on:blur={passwordConfirmFn} bind:value={confirm} type="password" class="form-control" id="passwordConfirm" name="passwordConfirm" placeholder="패스워드 재확인" pattern={passwordPattern} required />
              <label for="passwordConfirm">패스워드 재입력</label>
              <div class="valid-feedback">비밀번호가 일치합니다.</div>
              <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
            </div>

            <div class="mb-4 form-floating">
              <input type="text" class="form-control" id="organization" name="organization" placeholder="회사명" />
              <label for="organization">회사명</label>
              <div class="form-text">소속된 회사 이름을 입력하세요.(권장)</div>
            </div>

            <div class="form-check mb-4">
              <input on:click={validate} class="form-check-input" type="checkbox" id="agree" required />
              <label class="form-check-label" for="agree">개인정보이용 및 이메일 수신에 동의합니다.(필수) </label>
            </div>

            <div class="d-grid gap-2">
              <button on:click|preventDefault={submit} type="submit" class="btn btn-primary">가입하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</Atype>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

  .card {
    width: 50%;
    min-width: 500px;
    padding: 15px 20px;
    margin: 50px 0;
  }
</style>
