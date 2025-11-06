let e = "",
  t = "";
function n(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
chrome.storage.local.get(
  ["subjectName_", "user"],
  ({ subjectName_: n, user: a }) => {
    (e = n),
      (t = a && a.email && a.email.split("@")[0]),
      DOM.find("h1").value(e),
      DOM.find("#note>span").value(t);
  }
),
  chrome.runtime.onMessage.addListener(function (n, a, s) {
    return chrome.runtime.lastError
      ? alert(
          `Có lỗi xảy ra, thử lại hoặc báo lỗi admin: ${chrome.runtime.lastError}`
        )
      : ("online_data" == n.type &&
          ((e = n.subject),
          t || (t = n.studentCode),
          DOM.find("h1").value(e),
          DOM.find("#note>span").value(t)),
        !0);
  });
const a = DOM.find("form"),
  s = DOM.find("form>div"),
  l =
    '\n  <div>\n    <label for="ques" class="block text-sm font-medium text-gray-600 my-2">\n      Câu hỏi\n    </label>\n    <textarea type="text" name="ques" \n      class="px-4 py-2 text-base w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" rows="1"></textarea>\n    <label for="ans" class="block text-sm font-medium text-gray-600 my-2">\n      Đáp án\n    </label>\n    <textarea type="text" name="ans"\n    class="px-4 py-2 text-base w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" rows="1"></textarea>\n  </div>\n',
  r = DOM.create(
    '\n  <div id="note" class="self-start text-base">\n  Cố tình gửi đáp án lung tung, sai sẽ bị ban acc<br>\n  Gửi đáp án với tư cách là\n  <span class="text-blue-400"></span>\n  </div>\n'
  ),
  i = DOM.create(
    '\n  <div id="message" class="self-start text-base text-blue-400 font-semibold">\n  </div>\n'
  ),
  o = DOM.create(
    '\n  <button class="bg-yellow-400 text-white text-base py-2 rounded-xl float-right w-full">\n    Gửi đáp án\n  </button>\n'
  );
o.on("click", ["target"], (a) => {
  a.set("disabled", !0);
  const s = DOM.findAll("textarea[name=ques]")
    .map((e, t) => [e, DOM.findAll("textarea[name=ans]")[t]])
    .map(([e, t]) => ({ ques: n(e.value().trim()), ans: n(t.value().trim()) }))
    .filter((e) => e.ques && e.ans);
  s.length
    ? (async function (n) {
        try {
          const a = { subjectName: e, contribute: t, quizzes: n },
            s = await fetch("https://api.quizpoly.xyz/quizpoly/online/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              referrerPolicy: "origin",
              credentials: "include",
              body: JSON.stringify(a),
            });
          await s.json(),
            setTimeout(() => {
              i.value("Gửi đáp án thành công!"),
                [...document.querySelectorAll("textarea")].map(
                  (e) => (e.value = "")
                ),
                o.set("disabled", !1);
            }, 2e3);
        } catch (a) {
          i.value(`Lỗi: ${a.message}`), o.set("disabled", !1);
        }
      })(s)
    : (alert("Bạn chưa nhập câu nào!"), a.set("disabled", !1));
});
const c = DOM.create(
  '\n  <div class="bg-blue-400 text-white px-3 py-1.5 rounded-xl float-right mt-5 cursor-pointer">\n    Thêm câu hỏi\n  </div>\n'
);
c.on("click", () => s.append(l)), s.append(l, l, l);
const u = DOM.create('<div class="flex flex-col items-end space-y-4"></div>');
u.append(c, r, i, o), a.after(u);
