const e = {};
function t(e) {
  return (
    e.stopPropagation
      ? e.stopPropagation()
      : window.event && (window.event.cancelBubble = !0),
    e.preventDefault(),
    !1
  );
}
chrome.runtime.onMessage.addListener(function (t, n, o) {
  var i;
  let d = document.createElement("em"),
    c = document.createElement("table");
  if ((c.setAttribute("style", "width: 100%;"), "quiz_data" === t.type)) {
    if (
      ((c.innerHTML = t.html),
      null == (i = document.getElementById("loading")) || i.remove(),
      t.online)
    ) {
      const e = document.createElement("h2");
      (e.innerHTML =
        '\n\t\t\t\t<span>Thiếu câu hỏi? </span>\n\t\t\t\t<a href="chrome-extension://bookcfenenijcoedjlpfknknlgfimopp/online.html">Đóng góp thêm tại đây</a>\n\t\t\t'),
        document.getElementById("mySection").appendChild(e);
    } else {
      const e = document.createElement("p");
      e.setAttribute(
        "style",
        "color: red; text-align: right; padding: 11px 14px 5px 10px; font-size: 15px;"
      ),
        (e.innerHTML =
          "Gỡ My Fpoly Extension để không bị tắt khi sử dụng<br />Quiz đáp án đúng sẽ được tô đỏ. Không làm bài quá nhanh"),
        document.getElementById("mySection").appendChild(e);
    }
    document.getElementById("mySection").appendChild(c), o({ farewell: "OK" });
  } else if ("quiz_lms" == t.type) {
    const { ques: n, ans: o, seq: i } = t;
    if (!e[i]) {
      const e = document.createElement("div");
      d.innerText = o;
      const t = document.createElement("tr");
      t.innerHTML = `<td style='width:2.5rem; text-align:center;'>${i}</td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></td><td>${n}</td>`;
      const c = document.createElement("tr");
      (c.innerHTML = `<td></td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></td><td>${d.outerHTML}</td>`),
        e.appendChild(t),
        e.appendChild(c),
        document.querySelector("table").appendChild(e);
    }
    e[i] = 1;
  }
  return !0;
}),
  document.addEventListener("DOMContentLoaded", function (e) {
    (document.body.oncopy = function (e) {
      e.preventDefault();
    }),
      document.addEventListener(
        "keydown",
        function (e) {
          !e.ctrlKey || ("c" != e.key && "u" != e.key && "I" != e.key) || t(e),
            ("F12" == e.key) | ("F5" == e.key) && t(e);
        },
        !1
      ),
      document.addEventListener(
        "contextmenu",
        function (e) {
          e.preventDefault();
        },
        !1
      );
  });
