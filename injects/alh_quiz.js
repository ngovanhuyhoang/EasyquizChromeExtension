var CanNotSolveQuizMessage = "Giải quiz không thành công";
const script = document.querySelector(
    "body > script:nth-child(10)"
  ).textContent,
  match = script.match(/userQuizId\s*=\s*"([^"]+)"/),
  userQuizId = match ? match[1] : null;
async function getQuiz(e) {
  try {
    const t = await fetch(`https://api.quizpoly.xyz/alh/get-quiz/${e}`);
    return await t.json();
  } catch (t) {
    return null;
  }
}
async function getUserInfo() {
  try {
    const e = await fetch("https://lms.languagehub.vn/profile"),
      t = await e.text(),
      n = new DOMParser().parseFromString(t, "text/html"),
      a = n.getElementsByName("code")[0]?.value,
      i = n.getElementsByName("full_name")[0]?.value;
    return { studentCode: a, name: i };
  } catch (e) {}
}
async function sendUserUsing(e, t, n, a) {
  chrome.runtime.sendMessage({
    type: "send_user_using_alh",
    domain: window.location.host,
    data: { ...e, getQuizType: t, subjectName: n, quizNumber: a },
  });
}
function getQuizName() {
  let e, t, n;
  try {
    return (
      (e =
        document
          .querySelector(".learning-page-navbar-title > .text-primary")
          ?.textContent.trim() || ""),
      (t =
        document
          .querySelector(".learning-page-navbar-title > .text-dark-blue")
          ?.textContent.trim() || ""),
      (n =
        document
          .querySelector(".tab-item-quiz.active span.d-block")
          ?.textContent.trim() || ""),
      e && (e = e.replace(":", "")),
      { subjectName: e, quizNumber: `${t} - ${n}`, quizUnit: t, quizSub: n }
    );
  } catch (a) {
    return { subjectName: e, quizNumber: quizNumber, quizUnit: t, quizSub: n };
  }
}
const generateLog = async function (e, t) {
  const n = `qt_${userQuizId}_${e}_${new Date()
      .toLocaleDateString()
      .replaceAll("/", "")}`,
    a = await new Promise((e, t) => {
      fetch("https://api.ipify.org?format=json")
        .then((t) => {
          e(t.json());
        })
        .catch(() => {
          t({ ip: "" });
        });
    }),
    i = new Date(),
    u = Math.floor(4 * Math.random() + 5),
    s = Math.floor(60 * Math.random()),
    o = new Date(i.getTime() - 1e3 * (60 * u + s)),
    r = `${a.ip} | `,
    c = {
      getContent: `${r}${o.toLocaleDateString()} ${o.toLocaleTimeString()} | Tải nội dung bài Quiz`,
      submitQuiz: `${r}${i.toLocaleDateString()} ${i.toLocaleTimeString()} | Gửi bài quiz`,
      receivedResult: `${r}${i.toLocaleDateString()} ${i.toLocaleTimeString()} | Nhận kết quả bài quiz: ${t}`,
    };
  localStorage.setItem(n, JSON.stringify(c));
};
async function solveQuiz(e) {
  chrome.runtime.sendMessage({ type: "solve_alh_quiz", data: e }, async (t) => {
    const [n, a] = t;
    if (!n) return alert(a);
    if (!a.isPassed || !a.score) return;
    (document.querySelector(
      ".subsection-action"
    ).innerHTML = `<div class="d-flex justify-content-end align-items-center mb-3 mr-3 subsection-action quiz">\n      <div class="mr-2 score-wrap font-16 ">\n        (<span class="font-weight-bold">Score:</span>\n          <span class="score">${a.score}</span>)\n      </div>\n    </div>`),
      await generateLog(e.quizzesId, a.score),
      document
        .querySelector(".tab-item-quiz.active .chapter-icon")
        .classList.add("bg-passed"),
      document
        .querySelector(".tab-item-quiz.active .flex-grow-1 > span")
        .classList.add("text-passed");
    sendUserUsing(await getUserInfo(), "alh-quiz", e.subjectName, e.quizNumber);
  });
}
function getQuizzesData() {
  if (document.querySelector(".text-lesson-content")) {
    const e = document
        .querySelector(".text-lesson-content")
        .id.split("text-lesson-content")[1],
      t =
        document
          .querySelector("[data-class-id]")
          ?.getAttribute("data-class-id") || "",
      n =
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || "",
      {
        subjectName: a,
        quizNumber: i,
        quizUnit: u,
        quizSub: s,
      } = getQuizName();
    return {
      quizzesId: e,
      quizUnit: u,
      quizNumber: i,
      quizSub: s,
      subjectName: a,
      classId: t,
      token: n,
      url: window.location.href,
    };
  }
  return null;
}
document.addEventListener("keydown", async (e) => {
  if (e.altKey && "h" === e.key.toLowerCase()) {
    e.preventDefault();
    const t = await getQuizzesData();
    t && t.quizSub && solveQuiz(t);
  }
});
