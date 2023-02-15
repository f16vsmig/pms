<script>
  import { onMount } from "svelte";
  import { addComma, toDate } from "../utils";
  import { roadViewUrl } from "../store";

  export let data = "";

  let visable = false;
  let table;

  // function toDate(str) {
  //   return str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8);
  // }
  onMount(() => {
    console.log("기본정보 테이블 데이터 : ", data);
  });
</script>

<div class="relative overflow-x-auto sm:rounded-lg">
  <table class="w-full text-sm text-left text-gray-500">
    <!-- <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">기본정보</th>
      </tr>
    </thead> -->
    <tbody>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물명</th>
        <td class="px-6 py-4">{data.bldNm}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물번호</th>
        <td class="px-6 py-4">{data.mgmBldrgstPk}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물유형</th>
        <td class="px-6 py-4">{data.regstrKindCdNm != "표제부" ? data.regstrKindCdNm : "집합건축물"}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">번지</th>
        <td class="px-6 py-4">{data.bun}-{data.ji}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">대지위치</th>
        <td class="px-6 py-4">{data.platPlc}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">도로명주소</th>
        <td class="px-6 py-4 flex"
          >{data.newPlatPlc}
          {#if $roadViewUrl}
            <a href={$roadViewUrl} target="_blank" rel="noreferrer" class="text-indigo-600 hover:text-indigo-500 ml-2" title="로드맵 보기"
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pointer-events-none">
                <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </a>
          {/if}
        </td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">대지구분</th>
        <td class="px-6 py-4">
          {#if data.platGbCd == 0}
            대지
          {:else if data.platGbCd == 1}
            산
          {:else if data.platGbCd == 2}
            블록
          {/if}</td
        >
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">대장구분</th>
        <td class="px-6 py-4">{data.regstrGbCdNm}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건물구분</th>
        <td class="px-6 py-4">{data.regstrKindCdNm}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">대지면적</th>
        <td class="px-6 py-4">{addComma(data.platArea)}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건축면적</th>
        <td class="px-6 py-4">{addComma(data.archArea)}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">건폐율</th>
        <td class="px-6 py-4">{data.bcRat}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">연면적</th>
        <td class="px-6 py-4">{addComma(data.totArea)}</td>
      </tr>

      {#if visable}
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">용적율산정면적</th>
          <td class="px-6 py-4">{addComma(data.vlRatEstmTotArea)}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">용적율</th>
          <td class="px-6 py-4">{data.vlRat}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">구조</th>
          <td class="px-6 py-4">{data.strctCdNm}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">기타구조</th>
          <td class="px-6 py-4">{data.etcStrct}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">주용도</th>
          <td class="px-6 py-4">{data.mainPurpsCdNm}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">기타용도</th>
          <td class="px-6 py-4">{data.etcPurps}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지붕</th>
          <td class="px-6 py-4">{data.roofCdNm}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">기타지붕</th>
          <td class="px-6 py-4">{data.etcRoof}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">높이</th>
          <td class="px-6 py-4">{data.heit}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">층수</th>
          <td class="px-6 py-4">{data.grndFlrCnt} / 지하{data.ugrndFlrCnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">승강기</th>
          <td class="px-6 py-4">{data.rideUseElvtCnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">비상용승강기</th>
          <td class="px-6 py-4">{data.emgenUseElvtCnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">부속건물</th>
          <td class="px-6 py-4">{data.atchBldCnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">부속건물면적</th>
          <td class="px-6 py-4">{data.atchBldArea}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">총 동연면적</th>
          <td class="px-6 py-4">{data.totDongTotArea}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">옥내 기계식주차</th>
          <td class="px-6 py-4">{data.indrMechUtcnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">옥외 기계식주차</th>
          <td class="px-6 py-4">{data.oudrMechUtcnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">옥외 자주식주차</th>
          <td class="px-6 py-4">{data.oudrAutoUtcnt}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">허가일</th>
          <td class="px-6 py-4">{toDate(data.pmsDay)}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">착공일</th>
          <td class="px-6 py-4">{toDate(data.stcnsDay)}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">사용승인일</th>
          <td class="px-6 py-4">{toDate(data.useAprDay)}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">허가년도</th>
          <td class="px-6 py-4">{data.pmsnoYear}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">허가기관</th>
          <td class="px-6 py-4">{data.pmsnoKikCdNm}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">에너지효율등급</th>
          <td class="px-6 py-4">{data.engrGrade}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">친환경건축등급</th>
          <td class="px-6 py-4">{data.gnBldGrade}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">친환경인증점수</th>
          <td class="px-6 py-4">{data.gnBldCert}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지능형건축물등급</th>
          <td class="px-6 py-4">{data.itgBldGrade}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">지능형건축물인증점수</th>
          <td class="px-6 py-4">{data.itgBldCert}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">내진설계적용여부</th>
          <td class="px-6 py-4">{data.rserthqkDsgnApplyYn}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">내진능력</th>
          <td class="px-6 py-4">{data.rserthqkAblty}</td>
        </tr>
        <tr class="border-b border-gray-200">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">생성일자</th>
          <td class="px-6 py-4">{toDate(data.crtnDay)}</td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>

<div class="grow flex justify-center">
  {#if visable}
    <button
      class="flex mt-3 mb-10 text-slate-600 text-sm max-sm:ml-3"
      on:click={() => {
        visable = false;
        table.scrollIntoView({ behavior: "smooth" });
      }}
      >접기 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  {:else}
    <button
      class="flex mt-3 mb-10 text-slate-600 text-sm max-sm:ml-3"
      on:click={() => {
        visable = true;
      }}
      >더보기 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  {/if}
</div>
