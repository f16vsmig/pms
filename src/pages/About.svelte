<script>
  import Atype from "../layout/Atype.svelte";
  import Navbar from "../components/Navbar.svelte";
</script>

<Atype>
  <Navbar slot="navbar" />
  <div class="p-3 text-center" slot="content">
    <div class="mt-10 flex flex-col">
      <h1 class="text-3xl mb-10">간편한 모바일 건축물대장 열람</h1>
      <p class="text-slate-600">건축물대장 한 번 열어 보려고 회원가입 하고</p>
      <p class="text-slate-600">이런저런 보안프로그램 깔고...</p>
      <p class="text-slate-600 mb-10">불편한건 이제 그만 <span class="text-3xl">🙅🏻‍♀️</span></p>

      <p class="text-slate-600 mb-36">건축물대장 열람은 쉽고 빠르게 <strong>건물대장</strong>에서!</p>

      <h1 class="text-3xl mb-10">지도와 함께 건물정보</h1>

      <div class="grow w-100 flex justify-center">
        <figure class="max-w-lg mb-36">
          <img class="h-auto max-w-full rounded-lg" src="/public/img/desktop.png" alt="" />
          <figcaption class="mt-2 text-sm text-center text-gray-500">PC 버전</figcaption>
        </figure>
      </div>

      <h1 class="text-3xl mb-10">어디서든 모바일로 건물정보</h1>
      <div class="grow w-100 flex justify-center">
        <figure class="max-w-xs mb-24">
          <img class="h-auto max-w-full rounded-lg" src="/public/img/mobile1.png" alt="" />
          <figcaption class="mt-2 text-sm text-center text-gray-500">모바일 버전</figcaption>
        </figure>
      </div>

      <h1 class="text-lx font-thin">- 2023년 2월 11일 건축물대장 Beta 오픈</h1>
      <h1 class="text-lx mb-36 font-thin">gunmuldaejang@gmail.com</h1>
    </div>
  </div>
</Atype>
