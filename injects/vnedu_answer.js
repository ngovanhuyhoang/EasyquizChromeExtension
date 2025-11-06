const siteConfig = {
  shortName: "VNEDU",
  infoSelector: ".col-span-2",
  btnCustomStyle: "padding: 4px 4px; font-size: 12px;",
  answerColor: "#FFFBF0",
  answerLabelStyle:
    "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
  courseSelector: ".text-md.font-semibold.text-xanh",
  courseSplit: "-",
  titleSelector: ".font-semibold.text-text1",
  titleSplit: "-",
};
let courseName, title;
function waitForElement(e, t = 5e3) {
  return new Promise((n, r) => {
    const o = Date.now(),
      i = setInterval(() => {
        const a = document.querySelector(e);
        a
          ? (clearInterval(i), n(a))
          : Date.now() - o >= t &&
            (clearInterval(i),
            r(
              new Error(`Element with selector "${e}" not found within ${t}ms`)
            ));
      }, 100);
  });
}
const normalizeText = (e) =>
  e
    ? e
        .trim()
        .replace(/^\.+|[\.?!:]+$/g, "")
        .trim()
        .replace(/\.+$/g, "")
        .replace(/\u00a0/g, " ")
        .normalize("NFC")
        .replace(/[ \t]+/g, " ")
        .replace(/\r\n|\r|\n+/g, "\n")
        .replace(/ *\n */g, "\n")
        .replace(/\r\n|\r|\n+/g, "\n")
        .trim()
    : "";
async function getQuizAnswer(e, t, n) {
  return new Promise((r, o) => {
    chrome.runtime.sendMessage(
      {
        type: "get_quiz_answer",
        data: {
          courseName: e,
          question: t,
          school: siteConfig.shortName,
          answerCount: n,
        },
      },
      (e) => {
        if (chrome.runtime.lastError) return o("send_message_error");
        r(e);
      }
    );
  });
}
function createAnswerLabel(e) {
  const t = {
      ai: `cursor: default; padding: 2px 4px; background: #6c757d; color: white; border-radius: 3px; font-size: 12px; ${siteConfig.answerLabelStyle}`,
      user: `cursor: default; padding: 2px 4px; background: #28a745; color: white; border-radius: 3px; font-size: 12px; ${siteConfig.answerLabelStyle}`,
    },
    n = document.createElement("span");
  return (
    (n.style = t[e]),
    (n.textContent = "ai" === e ? "AI" : "✓"),
    (n.title =
      "ai" === e
        ? "Đáp án AI chỉ dùng để tham khảo không chính xác 100%"
        : "Đáp án chính xác đã được xác thực"),
    n
  );
}
function processQuestionText(e) {
  const t = e.querySelector(".text-base.font-semibold.text-text-black");
  return normalizeText(t?.textContent || "")
    .replace(/^Câu \d+:/, "")
    .trim();
}
async function solveQuiz(e, t) {
  e.target.innerText = "Đang giải...";
  const n = processQuestionText(t),
    r = [],
    o = t.querySelectorAll(".items-center.inline-flex");
  if (!o.length) return void alert("Dạng câu hỏi không hỗ trợ");
  o.forEach((e, t) => {
    const n = e
      .querySelector(".text-base.text-text-black>.inline-block")
      ?.textContent.trim();
    let o = e
      .querySelector(".text-base.text-text-black>.uppercase")
      ?.textContent.replace(".", "")
      .trim();
    o || (o = (t + 1).toString()), r.push({ num: o, text: n });
  });
  const i = { text: n, options: r, type: "multichoice" },
    [a, c] = await getQuizAnswer(courseName, i, 1);
  if (!a) return alert(c), void (e.target.innerText = "Giải EZQ");
  if ("require_auth" == c)
    return (
      alert(
        "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích đăng nhập sau đó giải lại"
      ),
      void (e.target.innerText = "Giải EZQ")
    );
  const { answer: l } = c;
  if (!l)
    return alert("Không có đáp án"), void (e.target.style.display = "none");
  (Array.isArray(l) ? l : [l]).forEach((t) => {
    const n = Array.from(o).find((e) => {
      let n = e
        .querySelector(".text-base.text-text-black>.uppercase")
        ?.textContent.replace(".", "")
        .trim();
      return (
        n || (n = (Array.from(o).indexOf(e) + 1).toString()),
        t.num.toLowerCase() === n.toLowerCase()
      );
    });
    if (!n)
      return (
        alert(`Đáp án: ${t.value}`), void (e.target.style.display = "none")
      );
    (n.style.backgroundColor = siteConfig.answerColor),
      ("ai" !== t.type && "user" !== t.type) ||
        n.appendChild(createAnswerLabel(t.type));
  });
}
function main() {
  const e = document.querySelectorAll(".question-wrapper");
  e.length &&
    e.forEach((e) => {
      const t = document.createElement("button");
      (t.style = `${siteConfig.btnCustomStyle} background: orange; border: none; border-radius: 5px; color: #fff;`),
        (t.innerText = "Giải EZQ"),
        t.addEventListener("click", (t) => {
          t.preventDefault(), solveQuiz(t, e);
        }),
        e.querySelector(siteConfig.infoSelector)?.appendChild(t);
    });
}
function initContentScript() {
  waitForElement(siteConfig.infoSelector)
    .then((e) => {
      const t = document.querySelector(siteConfig.courseSelector);
      (courseName =
        t?.textContent.split(siteConfig.courseSplit)[0].trim() ||
        "EMPTY_COURSE_NAME"),
        (title =
          document
            .querySelector(siteConfig.titleSelector)
            ?.textContent.split(siteConfig.titleSplit)[0]
            .trim() || "EMPTY_TITLE"),
        main();
    })
    .catch((e) => {});
}
const checkHrefInterval = setInterval(() => {
  window.location.href.startsWith(
    "https://thpt-bahon.lms.vnedu.vn/app/lam-bai-thi/"
  ) && (clearInterval(checkHrefInterval), initContentScript());
}, 3e3);
