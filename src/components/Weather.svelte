<script>
  import { detailElem } from "../store";
  import { slide, fade } from "svelte/transition";

  let baseDatetime = "";
  let junggiVisable = false;

  const skyCode = {
    1: "맑음",
    3: "구름 많음",
    4: "흐림",
  };
  const infoCode = {
    전국: "108",
    강원: "105",
    강원도: "105",
    서울: "109",
    서울특별시: "109",
    경기: "109",
    경기도: "109",
    인천: "109",
    인천광역시: "109",
    충북: "131",
    충청북도: "131",
    대전: "133",
    대전광역시: "133",
    세종: "133",
    세종특별자치시: "133",
    충남: "133",
    충청남도: "133",
    전북: "146",
    전라북도: "146",
    광주: "156",
    광주광역시: "156",
    전남: "156",
    전라남도: "156",
    대구: "143",
    대구광역시: "143",
    경북: "143",
    경상북도: "143",
    부산: "159",
    부산광역시: "159",
    울산: "159",
    울산광역시: "159",
    경남: "159",
    경상남도: "159",
    제주: "184",
    제주도: "184",
    제주특별자치도: "184",
  };

  // 좌표변환api
  let geocoder = new kakao.maps.services.Geocoder();

  let promise;
  async function getWeatherForcate(address) {
    let resp;
    let json;
    let convert;
    let url;

    url = await weatherApiUrl(address);
    resp = await makeRequest("GET", url);
    json = await JSON.parse(resp);
    convert = dailyWeatherData(json.response.body.items.item);

    return toWeatherData(convert);
  }

  function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send();
    });
  }

  function weatherApiUrl(address) {
    let url = "api/getWeatherData"; /*URL*/
    let queryParams = "";

    return new Promise(function (resolve, reject) {
      geocoder.addressSearch(address, function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          let rs = dfs_xy_conv(result[0].y, result[0].x);

          queryParams = "?" + encodeURIComponent("nx") + "=" + encodeURIComponent(rs.x); /**/
          queryParams += "&" + encodeURIComponent("ny") + "=" + encodeURIComponent(rs.y); /**/
          resolve(url + queryParams);
        } else {
          reject("카카오 주소변환에 오류가 발생했습니다.");
        }
      });
    });
  }

  // 주소지 좌표 -> 기상청 날씨예보 기준 좌표로 변환
  function dfs_xy_conv(v1, v2) {
    //
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    var rs = {};

    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return rs;
  }

  function dailyWeatherData(data) {
    let result = {};

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let fcstDate = item.fcstDate;
      let fcstTime = item.fcstTime;

      if (i == 0 || data[i].fcstDate != data[i - 1].fcstDate) {
        result[fcstDate] = {
          SKY: {},
          PTY: {},
          POP: {},
          PCP: {},
          SNO: {},
        };
      }

      if (item.category == "SKY") {
        result[fcstDate].SKY[fcstTime] = item.fcstValue;
      }

      if (item.category == "PTY") {
        result[fcstDate].PTY[fcstTime] = item.fcstValue;
      }

      if (item.category == "POP") {
        result[fcstDate].POP[fcstTime] = item.fcstValue;
      }

      if (item.category == "SNO") {
        result[fcstDate].SNO[fcstTime] = item.fcstValue;
      }

      if (item.category == "PCP") {
        result[fcstDate].PCP[fcstTime] = item.fcstValue;
      }

      if (item.category == "TMX") {
        result[fcstDate].TMX = Number(item.fcstValue);
        result[fcstDate].TMXH = item.fcstTime;
      }

      if (item.category == "TMN") {
        result[fcstDate].TMN = Number(item.fcstValue);
        result[fcstDate].TMNH = item.fcstTime;
      }

      if (i == 0) {
        result[fcstDate].TMP = Number(item.fcstValue);
        result[fcstDate].TMPH = item.fcstTime;
        result[fcstDate].baseDate = item.baseDate;
        result[fcstDate].baseTime = item.baseTime;
      }
    }

    return result;
  }

  // 날씨조회 결과를 html에 표시
  function toWeatherData(input) {
    let result = [];

    Object.values(input).forEach((data) => {
      let weather = {};

      // 날씨 상태 표시
      if (Object.values(data.PTY).includes("1")) {
        weather["status"] = "비";
        weather["emoji"] = "🌧️";
      } else if (Object.values(data.PTY).includes("2")) {
        weather["status"] = "비/눈";
        weather["emoji"] = "🌧️/☃";
      } else if (Object.values(data.PTY).includes("3")) {
        weather["status"] = "눈";
        weather["emoji"] = "☃";
      } else if (Object.values(data.PTY).includes("4")) {
        weather["status"] = "소나기";
        weather["emoji"] = "🌂";
      } else if (Object.values(data.SKY).includes("4")) {
        weather["status"] = "흐림";
        weather["emoji"] = "🌤";
      } else if (Object.values(data.SKY).includes("3")) {
        weather["status"] = "구름많음";
        weather["emoji"] = "☁️";
      } else {
        weather["status"] = "맑음";
        weather["emoji"] = "☀️";
      }

      // 기온 표시
      if (typeof data.TMP !== "undefined") {
        weather["temp"] = data.TMP + "&deg;C";
      } else if (typeof data.TMX !== "undefined") {
        weather["temp"] = data.TMN + "/" + data.TMX + "&deg;C";
      } else {
        weather["temp"] = "-";
      }

      // 기상예측일시 표시
      if (typeof data.baseDate !== "undefined") {
        let datetime = String(data.baseDate.slice(4, 6)) + "/" + String(data.baseDate.slice(6, 8)) + " " + String(data.baseTime.slice(0, 2)) + ":" + String(data.baseTime.slice(2, 5)) + " 예보 기준";
        baseDatetime = datetime;
      }

      result.push(weather);
    });

    return result;
  }

  let promise2;
  // 예보멘트 불러오기
  async function getMidFcstInfoService(address) {
    junggiVisable = false; // 날씨안내창 닫기
    // let weatherInfoService = ""; // 날씨안내 초기화
    let resp;
    let json;

    const city = address.split(" ")[0];

    let today = new Date();
    let month = today.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = today.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let yyyymmdd = String(today.getFullYear()) + String(month) + String(day);
    let hhmm = "0600";
    let dateParam = yyyymmdd + hhmm;

    let url = "api/getMidFcstInfoService"; /*URL*/

    let queryParams = "?" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /**/
    queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10"); /**/
    queryParams += "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("json"); /**/
    queryParams += "&" + encodeURIComponent("stnId") + "=" + encodeURIComponent(infoCode[city]); /**/
    queryParams += "&" + encodeURIComponent("date") + "=" + encodeURIComponent(dateParam);

    url += queryParams;
    resp = await makeRequest("GET", url);
    json = await JSON.parse(resp);

    return json.response.body.items.item[0].wfSv;
  }

  $: promise = getWeatherForcate($detailElem.address);
  $: promise2 = getMidFcstInfoService($detailElem.address);
</script>

<div class="row mb-3">
  <div class="col">
    <h5>날씨</h5>
  </div>

  <div class="col text-end" transition:fade>{baseDatetime}</div>
</div>

{#await promise}
  <p>Loading...</p>
{:then result}
  <div class="row text-center pb-3 mb-3" transition:fade>
    {#each result as weather, id}
      <div class="col {id == 0 ? 'border-end' : ''}">
        <h6 class="fw-light">{id == 0 ? "현재" : id + "일 후"}</h6>
        <div class="fs-1">{weather.emoji}</div>
        <div class="fw-light">{weather.status}</div>
        <div class="fw-light">{@html weather.temp}</div>
      </div>
    {/each}
  </div>
{/await}

{#await promise2}
  <button class="btn btn-primary btn-sm disabled">중기예보 <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" /></button>
{:then result}
  {#if junggiVisable}
    <button
      class="btn btn-primary btn-sm"
      on:click={() => {
        junggiVisable = !junggiVisable;
      }}>중기예보 <i class="fa-solid fa-angle-up" /></button
    >
  {:else}
    <button
      class="btn btn-primary btn-sm"
      on:click={() => {
        junggiVisable = !junggiVisable;
      }}>중기예보 <i class="fa-solid fa-angle-down" /></button
    >
  {/if}
  {#if junggiVisable}
    <div class="row pt-3 mb-3">
      <div class="col" transition:slide={{ duration: 100 }}>{result}</div>
    </div>
  {/if}
{/await}

<blockquote cite="https://www.data.go.kr/data/15059468/openapi.do" class="text-secondary mt-4">
  기상청 예보조회서비스 | <cite class="text-muted">공공데이터포털</cite>
</blockquote>
