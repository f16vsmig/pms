<script>
  import { addComma, toDate } from "../utils";
  export let data = "";

  let visable = false;
  let table;

  // function toDate(str) {
  //   return str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8);
  // }
</script>

<table class="table table-hover" bind:this={table}>
  <tbody class="table-group-divider">
    <tr>
      <td>건물명</td>
      <td class="text-end fw-light">{data.bldNm}</td>
    </tr>
    <tr>
      <td>건물번호</td>
      <td class="text-end fw-light">{data.mgmBldrgstPk}</td>
    </tr>
    <tr>
      <td>건물유형</td>
      <td class="text-end fw-light">{data.regstrKindCdNm != "표제부" ? data.regstrKindCdNm : "집합건축물"}</td>
    </tr>
    <tr>
      <td>번지</td>
      <td class="text-end fw-light">{data.bun}-{data.ji}</td>
    </tr>
    <tr>
      <td>대지위치</td>
      <td class="text-end fw-light">{data.platPlc}</td>
    </tr>
    <tr>
      <td>도로명주소</td>
      <td class="text-end fw-light">{data.newPlatPlc}</td>
    </tr>
    <tr>
      <td>대지구분</td>
      <td class="text-end fw-light">
        {#if data.platGbCd == 0}
          대지
        {:else if data.platGbCd == 1}
          산
        {:else if data.platGbCd == 2}
          블록
        {/if}
      </td>
    </tr>
    <tr>
      <td>대장구분</td>
      <td class="text-end fw-light">{data.regstrGbCdNm}</td>
    </tr>
    <tr>
      <td>건물구분</td>
      <td class="text-end fw-light">{data.regstrKindCdNm}</td>
    </tr>
    <tr>
      <td>대지면적</td>
      <td class="text-end fw-light">{addComma(data.platArea)}</td>
    </tr>
    <tr>
      <td>건축면적</td>
      <td class="text-end fw-light">{addComma(data.archArea)}</td>
    </tr>
    <tr>
      <td>건폐율</td>
      <td class="text-end fw-light">{data.bcRat}</td>
    </tr>
    <tr>
      <td>연면적</td>
      <td class="text-end fw-light">{addComma(data.totArea)}</td>
    </tr>
    {#if visable}
      <tr>
        <td>용적율산정면적</td>
        <td class="text-end fw-light">{addComma(data.vlRatEstmTotArea)}</td>
      </tr>
      <tr>
        <td>용적율</td>
        <td class="text-end fw-light">{data.vlRat}</td>
      </tr>
      <tr>
        <td>구조</td>
        <td class="text-end fw-light">{data.strctCdNm}</td>
      </tr>
      <tr>
        <td>기타구조</td>
        <td class="text-end fw-light">{data.etcStrct}</td>
      </tr>
      <tr>
        <td>주용도</td>
        <td class="text-end fw-light">{data.mainPurpsCdNm}</td>
      </tr>
      <tr>
        <td>기타용도</td>
        <td class="text-end fw-light">{data.etcPurps}</td>
      </tr>
      <tr>
        <td>지붕</td>
        <td class="text-end fw-light">{data.roofCdNm}</td>
      </tr>
      <tr>
        <td>기타지붕</td>
        <td class="text-end fw-light">{data.etcRoof}</td>
      </tr>
      <tr>
        <td>높이</td>
        <td class="text-end fw-light">{data.heit}</td>
      </tr>
      <tr>
        <td>층수</td>
        <td class="text-end fw-light">{data.grndFlrCnt} / 지하{data.ugrndFlrCnt}</td>
      </tr>
      <tr>
        <td>승강기</td>
        <td class="text-end fw-light">{data.rideUseElvtCnt}</td>
      </tr>
      <tr>
        <td>비상용승강기</td>
        <td class="text-end fw-light">{data.emgenUseElvtCnt}</td>
      </tr>
      <tr>
        <td>부속건물</td>
        <td class="text-end fw-light">{data.atchBldCnt}</td>
      </tr>
      <tr>
        <td>부속건물면적</td>
        <td class="text-end fw-light">{data.atchBldArea}</td>
      </tr>
      <tr>
        <td>총 동연면적</td>
        <td class="text-end fw-light">{data.totDongTotArea}</td>
      </tr>
      <tr>
        <td>옥내 기계식주차</td>
        <td class="text-end fw-light">{data.indrMechUtcnt}</td>
      </tr>
      <tr>
        <td>옥외 기계식주차</td>
        <td class="text-end fw-light">{data.oudrMechUtcnt}</td>
      </tr>
      <tr>
        <td>옥외 자주식주차</td>
        <td class="text-end fw-light">{data.oudrAutoUtcnt}</td>
      </tr>
      <tr>
        <td>허가일</td>
        <td class="text-end fw-light">{toDate(data.pmsDay)}</td>
      </tr>
      <tr>
        <td>착공일</td>
        <td class="text-end fw-light">{toDate(data.stcnsDay)}</td>
      </tr>
      <tr>
        <td>사용승인일</td>
        <td class="text-end fw-light">{toDate(data.useAprDay)}</td>
      </tr>
      <tr>
        <td>허가년도</td>
        <td class="text-end fw-light">{data.pmsnoYear}</td>
      </tr>
      <tr>
        <td>허가기관</td>
        <td class="text-end fw-light">{data.pmsnoKikCdNm}</td>
      </tr>
      <tr>
        <td>에너지효율등급</td>
        <td class="text-end fw-light">{data.engrGrade}</td>
      </tr>
      <tr>
        <td>친환경건축등급</td>
        <td class="text-end fw-light">{data.gnBldGrade}</td>
      </tr>
      <tr>
        <td>친환경인증점수</td>
        <td class="text-end fw-light">{data.gnBldCert}</td>
      </tr>
      <tr>
        <td>지능형건축물등급</td>
        <td class="text-end fw-light">{data.itgBldGrade}</td>
      </tr>
      <tr>
        <td>지능형건축물인증점수</td>
        <td class="text-end fw-light">{data.itgBldCert}</td>
      </tr>
      <tr>
        <td>내진설계적용여부</td>
        <td class="text-end fw-light">{data.rserthqkDsgnApplyYn}</td>
      </tr>
      <tr>
        <td>내진능력</td>
        <td class="text-end fw-light">{data.rserthqkAblty}</td>
      </tr>
      <tr>
        <td>생성일자</td>
        <td class="text-end fw-light">{toDate(data.crtnDay)}</td>
      </tr>
    {/if}
  </tbody>
</table>
{#if visable}
  <button
    class="btn btn-light btn-sm mb-4 w-100"
    on:click={() => {
      visable = false;
      table.scrollIntoView({ behavior: "smooth" });
    }}>다시 접기 <i class="fa-solid fa-angle-up" /></button
  >
{:else}
  <button
    class="btn btn-light btn-sm mb-4 w-100"
    on:click={() => {
      visable = true;
    }}>나머지 정보 펼쳐 보기 <i class="fa-solid fa-angle-down" /></button
  >
{/if}
