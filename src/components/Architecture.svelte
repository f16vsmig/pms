<script>
  import ArchitectureLayout from "./ArchitectureLayout.svelte";
  import StackPlan from "./ArchitectureStackplan.svelte";
  import Loading from "../assets/etc/Loading.svelte";
  import { detailElem, mgmBldrgstPk } from "../store";

  let platGbCd = 0; // 0:대지 1:산 2:블록
  let sigunguCd = ""; // 시군구코드
  let bjdongCd = ""; //  법정동코드
  let bun = "0000"; // 번
  let ji = "0000"; // 지
  let startDate = ""; // YYYYMMDD
  let endDate = ""; // YYYYMMDD
  let numOfRows = 100; // 페이지당 목록 수
  let pageNo = 1; // 페이지번호
  let brTitleInfo; // 건축물대장 표제부
  let brFlrOulnInfo; // 건축층별정보
  let floorInfoTitle; // 층 정보 제목, 창 접기시 스크롤 위치 이동에 사용

  function parseXml(xmlString) {
    var parser = new window.DOMParser();
    // attempt to parse the passed-in xml
    var dom = parser.parseFromString(xmlString, "application/xml");
    if (isParseError(dom)) {
      throw new Error("Error parsing XML");
    }
    return dom;
  }

  function parseXML(data) {
    var xml, tmp;
    if (!data || typeof data !== "string") {
      return null;
    }
    try {
      if (window.DOMParser) {
        // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
      } else {
        // IE
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(data);
      }
    } catch (e) {
      xml = undefined;
    }
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      throw new Error("Invalid XML: " + data);
    }
    // console.log("xml 변환 결과 : ", xml);
    return xml;
  }

  function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    // console.log("json 변환 결과 : ", obj);
    return obj;
  }

  function isParseError(parsedDocument) {
    // parser and parsererrorNS could be cached on startup for efficiency
    var parser = new DOMParser(),
      errorneousParse = parser.parseFromString("<", "application/xml"),
      parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

    if (parsererrorNS === "http://www.w3.org/1999/xhtml") {
      // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
      return parsedDocument.getElementsByTagName("parsererror").length > 0;
    }

    return parsedDocument.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0;
  }

  function xml2json(xml) {
    try {
      var obj = {};
      if (xml.children.length > 0) {
        for (var i = 0; i < xml.children.length; i++) {
          var item = xml.children.item(i);
          var nodeName = item.nodeName;

          if (typeof obj[nodeName] == "undefined") {
            obj[nodeName] = xml2json(item);
          } else {
            if (typeof obj[nodeName].push == "undefined") {
              var old = obj[nodeName];

              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xml2json(item));
          }
        }
      } else {
        obj = xml.textContent;
      }
      return obj;
    } catch (e) {
      console.log(e.message);
    }
  }

  const cityName = {
    강원: "강원도",
    강원도: "강원도",
    서울: "서울특별시",
    서울특별시: "서울특별시",
    경기: "경기도",
    경기도: "경기도",
    인천: "인천광역시",
    인천광역시: "인천광역시",
    충북: "충청북도",
    충청북도: "충청북도",
    대전: "대전광역시",
    대전광역시: "대전광역시",
    세종: "세종특별자치시",
    세종특별자치시: "세종특별자치시",
    충남: "충청남도",
    충청남도: "충청남도",
    전북: "전라북도",
    전라북도: "전라북도",
    광주: "광주광역시",
    광주광역시: "광주광역시",
    전남: "전라남도",
    전라남도: "전라남도",
    대구: "대구광역시",
    대구광역시: "대구광역시",
    경북: "경상북도",
    경상북도: "경상북도",
    부산: "부산광역시",
    부산광역시: "부산광역시",
    울산: "울산광역시",
    울산광역시: "울산광역시",
    경남: "경상남도",
    경상남도: "경상남도",
    제주: "제주특별자치도",
    제주도: "제주특별자치도",
    제주특별자치도: "제주특별자치도",
  };

  // 건물 기본개요 조회
  async function getBrBasisOulnInfo() {
    let url = "/api/getBrBasisOulnInfo";
    url += "?sigunguCd=" + sigunguCd;
    url += "&bjdongCd=" + bjdongCd;
    url += "&platGbCd=" + platGbCd;
    url += "&bun=" + bun;
    url += "&ji=" + ji;
    // url += "&startDate=" + startDate;
    // url += "&endDate=" + endDate;
    url += "&numOfRows=" + numOfRows;
    url += "&pageNo=" + pageNo;

    return fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((xmlStr) => {
        return parseXML(xmlStr);
      })
      .then((xml) => {
        return xml2json(xml);
      })
      .then((json) => {
        console.log("json : ", json);
        return (brTitleInfo = json.response.body.items.item);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // 건축물대장 표제부 api
  async function getBrTitleInfo() {
    // let url = "/api/getBrTitleInfo";
    let url = "http://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo";
    url += "?sigunguCd=" + sigunguCd;
    url += "&bjdongCd=" + bjdongCd;
    url += "&platGbCd=" + platGbCd;
    url += "&bun=" + bun;
    url += "&ji=" + ji;
    url += "&numOfRows=" + numOfRows;
    url += "&pageNo=" + pageNo;
    url += "&serviceKey=" + apiKey;

    return fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((xmlStr) => {
        console.log("건축물대장xml : ", xmlStr);
        // return parseXml(xmlStr);
        return parseXML(xmlStr);
      })
      .then((xml) => {
        console.log("건축물대장xml2 : ", xml);
        // return xml2json(xml);
        return xml2json(xml);
      })
      .then((json) => {
        let data = json.response.body.items.item;
        console.log("json : ", data);
        if (Array.isArray(data)) {
          return data.sort(sortACN("mgmBldrgstPk"));
        }
        return data;
      })
      .then((data) => {
        brTitleInfo = data;
        console.log("==", brTitleInfo);
        if (Array.isArray(data)) {
          return ($mgmBldrgstPk = data[0].mgmBldrgstPk);
        }
        console.log("오류체크: ", data);
        return ($mgmBldrgstPk = data.mgmBldrgstPk); // 여기서 문제가 자꾸 생기나?
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  let promise;
  export let elem;
  async function prepare(jibun) {
    console.log("jibun", jibun, elem);
    setBunJi(jibun);
    console.log(setBunJi(jibun), sigunguCd, bjdongCd, bun, ji);
    await getStanReginCd(jibun);
    await getBrTitleInfo();
    await getBrFlrOulnInfo();

    return;
  }

  const apiKey = "GO8tFIo30%2BUG6NoXSzlVzxv2j8eQFigKu9a8RJ9qY47kAnl2u27pVjWIDlvlZ09Yo3NNJeyRt3UJovtQ5Z11ew%3D%3D";

  // 건물 층정보 api 조회
  async function getBrFlrOulnInfo() {
    // let url = "/api/getBrFlrOulnInfo"; // 내부 api
    let url = "http://apis.data.go.kr/1613000/BldRgstService_v2/getBrFlrOulnInfo";
    url += "?sigunguCd=" + sigunguCd;
    url += "&bjdongCd=" + bjdongCd;
    url += "&bun=" + bun;
    url += "&ji=" + ji;
    url += "&numOfRows=" + "200";
    url += "&serviceKey=" + apiKey;

    console.log("건축물대장 api 요청 url : ", url);

    return fetch(url)
      .then((resp) => {
        console.log("건축물대장 : ", resp);
        return resp.text();
      })
      .then((xmlStr) => {
        return parseXML(xmlStr);
      })
      .then((xml) => {
        console.log("건축물대장xml : ", xml);
        return xml2json(xml);
      })
      .then((json) => {
        console.log("건축물대장json : ", json);
        return json.response.body.items.item;
      })
      .then((data) => {
        return sortBrFlr(data);
      })
      .then((data) => {
        return (brFlrOulnInfo = data.sort(sortACN("mgmBldrgstPk")));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  function sortBrFlr(flrArr) {
    let jisang = [];
    let jiha = [];

    for (let i = 0; i < flrArr.length; i++) {
      let flr = flrArr[i];
      flr.flrNo = Number(flr.flrNo); // 층번호를 string -> number로 변경
      flr.area = Number(flr.area); // 층면적을 string -> number로 변경
      if (flr.flrGbCd == 20) {
        jisang.push(flr);
      } else if (flr.flrGbCd == 10) {
        jiha.push(flr);
      }
    }

    jisang = jisang.sort(sortDESC("area")).sort(sortDESC("flrNo"));
    jiha = jiha.sort(sortDESC("area")).sort(sortACN("flrNo"));

    return jisang.concat(jiha);
  }

  // 순서대로 정렬
  function sortACN(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }

  // 반대로 정렬
  function sortDESC(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
      return 0;
    };
  }

  async function getStanReginCd(jibun) {
    // 지번 주소에서 번지수를 지우고 주소 생성
    let jibunArr = jibun.split(" ");
    let dong = jibun.replaceAll(jibunArr[jibunArr.length - 1], "");
    console.log("법정동 api 과정", jibun, jibunArr, dong);
    // 법정동 코드 호출을 위한 url 생성
    // let url = "/api/getStanReginCd";
    let url = "http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList";
    url += "?type=json";
    url += "&flag=Y";
    url += "&locatadd_nm=" + encodeURIComponent(dong);
    url += "&serviceKey=" + apiKey;
    console.log("법정동 api 요청 url : ", url);

    // url로 요청하고 json 반환
    return fetch(url)
      .then((resp) => {
        console.log("법정동api : ", resp);
        return resp.json();
      })
      .then((code) => {
        console.log("법정동api_code : ", code);
        let cd = code.StanReginCd[1].row[0];
        console.log("법정동api_code : ", cd);
        sigunguCd = cd.sido_cd + cd.sgg_cd;
        bjdongCd = cd.umd_cd + cd.ri_cd;
        return;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  function setBunJi(jibun) {
    // 입력된 지번주소로 번지 할당
    let jibunArr = jibun.split(" ");
    let bunji = jibunArr[jibunArr.length - 1];
    if (bunji.includes("-")) {
      bun = String(bunji.split("-")[0]).padStart(4, "0");
      ji = String(bunji.split("-")[1]).padStart(4, "0");
    } else {
      bun = String(bunji).padStart(4, "0");
      ji = "0000"; // 초기화를 안하면 잘못된 번지가 입력됨
    }

    return;
  }

  let details;
  let summary;

  $: promise = prepare(elem.jibun);
  // $: promise = prepare(elem);
</script>

{#await promise}
  <Loading />
{:then}
  {#if Array.isArray(brTitleInfo)}
    <details bind:this={details} class="relative px-2 text-slate-700">
      <summary
        bind:this={summary}
        on:click={() => {
          if (!details.open) {
            document.body.style.overflow = "hidden";
            document.getElementsByClassName("modal-container")[0].style.overflow = "hidden";
          } else {
            document.body.style.overflow = "auto";
            document.getElementsByClassName("modal-container")[0].style.overflow = "auto";
          }
        }}
        class="mb-2 hover:text-indigo-600 cursor-pointer">건축물대장 번호 : {$mgmBldrgstPk}</summary
      >
      <ul class="absolute top-full border-2 border-slate-200 rounded-sm p-3 bg-white max-h-96 w-5/6 overflow-auto z-20">
        {#each brTitleInfo as d, id}
          <li class="page-item hover:text-indigo-600 cursor-pointer my-2">
            <button
              class="page-link {d.mgmBldrgstPk == $mgmBldrgstPk ? 'text-indigo-600' : ''}"
              on:click={() => {
                $mgmBldrgstPk = d.mgmBldrgstPk;
                details.open = false;
                document.body.style.overflow = "auto";
                document.getElementsByClassName("modal-container")[0].style.overflow = "auto";
              }}>{d.mgmBldrgstPk} {d.bldNm == "" ? "" : "(" + d.bldNm + ")"}</button
            >
          </li>
        {/each}
      </ul>
    </details>

    <!-- <nav aria-label="Page navigation example" style="position: absolute; top: 12px; right: 10px; max-width: 300px; overflow-x: auto;">
      <ul class="pagination pagination-sm">
        {#each brTitleInfo as d, id}
          <li class="page-item {d.mgmBldrgstPk == $mgmBldrgstPk ? 'active' : ''}">
            <button
              class="page-link"
              on:click={() => {
                $mgmBldrgstPk = d.mgmBldrgstPk;
              }}>{id + 1}</button
            >
          </li>
        {/each}
      </ul>
    </nav>  -->
  {/if}

  <ArchitectureLayout data={brTitleInfo} />

  <!-- <h6 bind:this={floorInfoTitle} class="pl-2">층별 정보</h6> -->
  <StackPlan {brFlrOulnInfo} />
  <blockquote cite="https://www.data.go.kr" class="text-secondary my-5 text-sm text-slate-700 ml-2">
    국토교통부 건축물대장정보서비스 | <cite class="text-muted">공공데이터포털</cite>
  </blockquote>
{:catch error}
  <p style="color: red">Error 발생</p>
  <p style="color: red">{error.message}</p>
{/await}

<style>
  details summary::-webkit-details-marker {
    font-size: 8px;
    margin-right: 5px;
  }
</style>
