function e(e, t) {
  chrome.runtime.sendMessage({ type: e, target: "background", data: t });
}
function t(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
chrome.runtime.onMessage.addListener(async function (r) {
  if ("offscreen" !== r.target) return !1;
  switch (r.type) {
    case "get_quiz_score":
      !(function ({
        quizSelf: r,
        htmlString: n,
        quizId: s,
        domain: a,
        passTime: i,
        subjectName: u,
      }) {
        let o = [],
          c = "",
          l = {};
        const d = t(n),
          f = d.querySelectorAll("tbody >tr > td:nth-of-type(5)"),
          m = d.querySelectorAll("tbody >tr > td:nth-of-type(1)"),
          y = d.querySelectorAll("tbody >tr > td:nth-of-type(4)");
        f.length &&
          (f.forEach((e, t) => {
            l[m[t].innerText] = +e.innerText;
          }),
          (o = Object.keys(r)
            .map((e) => {
              const t = parseInt(y[e - 1].innerText);
              if (l[e] === t) return r[e];
            })
            .filter((e) => void 0 !== e)),
          (c = `${o.length} Of ${Object.keys(l).length}`),
          e("get_quiz_score_result", {
            quizzes: o,
            score: c,
            quizId: s,
            domain: a,
            passTime: i,
            subjectName: u,
            quizSelf: r,
          }));
      })(r.data);
      break;
    case "get_quiz_percent":
      !(function ({ htmlString: r, subjectName: n, quizSelf: s }) {
        const a = t(r);
        e("get_quiz_persent_result", {
          percent: parseInt(
            a.querySelector(
              "table.table > tbody > tr:nth-last-child(1) > td:nth-of-type(6)"
            ).textContent
          ),
          subjectName: n,
          quizSelf: s,
        });
      })(r.data);
      break;
    default:
      return !1;
  }
  return !0;
});
