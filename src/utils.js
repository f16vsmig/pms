/**
 * 천단위 콤마 형식으로 포맷팅합니다.
 * @param {string} val
 * @param {number} fixed 소수점 표시 자리수, 기본값은 2입니다.
 * @returns 천단위 콤마가 붙은 숫자를 string으로 반환합니다.
 */
export function addComma(val, fixed = 2) {
  return Number(val)
    .toFixed(fixed)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * YYYYMMDD를 YYYY-MM-DD로 변환합니다.
 * @param {string} str YYYYMMDD
 * @returns YYYY-MM-DD
 */
export function toDate(str) {
  return str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8);
}

/**
 * form을 제출하고 서버의 응답에 따라 메시지를 띄우고 리다이렉트 동작합니다.
 * @param {element} formElement
 * @returns 요청결과 경고창 또는 페이지 리다이렉트
 */
export function submitForm(formElement) {
  window.event.preventDefault();

  // 함수 호출에 사용된 버튼을 disable로 상태 변경합니다.
  let btn = window.event.target;
  btn.disable = true;

  // formElement에 정의된 method가 없으면 에러를 던집니다.
  if (formElement.method == "") {
    throw new Error("제출 되는 formElement에 method가 없습니다.");
  }

  // html에서 지정한 유효성 검증을 먼저 수행합니다.
  if (!formElement.checkValidity()) {
    formElement.reportValidity();
    return;
  }

  let formData = new FormData(formElement);
  let action = formElement.action;
  let xhr = new XMLHttpRequest();

  xhr.open(formElement.method, action);

  xhr.onload = function () {
    let data = JSON.parse(xhr.responseText);

    if (xhr.status == 200 || xhr.status == 201) {
      alert(data["message"] + "(" + xhr.status + ")");

      if (data["redirect_url"] == "previous" && document.referrer == "") {
        return close(); // 이전 경로로 이동할 때 이전 경로가 없으면 탭을 닫습니다.
      } else if (data["redirect_url"] == "previous") {
        return (window.location.href = document.referrer); // 이전 경로로 이동합니다.
      } else if (data["redirect_url"] == "refresh") {
        return window.location.reload(); // 페이지를 새로고침 합니다.
      } else if (data["redirect_url"] == "") {
        return;
      } else {
        return (window.location.href = data["redirect_url"]);
      }
    } else {
      return alert(data["message"] + "(" + xhr.status + ")");
    }
  };

  xhr.send(formData);
}

/** Dispatch event on click outside of node */
export function clickOutside(node) {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}

export function toggleBoolean(input) {
  return (input = !input);
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
  return xml;
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

export function xmlStr2Json(xmlStr) {
  return xml2json(parseXML(xmlStr));
}
