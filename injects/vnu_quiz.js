function getDynamicShortName() {
  const e = window.location.hostname.match(/portal\.([^.]+)\.vnu\.edu\.vn/);
  return e && e[1] ? `VNU-${e[1].toUpperCase()}` : "VNU";
}
const siteConfig = {
  shortName: getDynamicShortName(),
  infoSelector: ".header",
  btnCustomStyle: "margin-left: 10px; padding: 4px 8px; font-size: 12px;",
  answerColor: "#FFFBF0",
  answerLabelStyle:
    "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
  courseSelector: "h2",
  courseSplit: "Results for",
  titleSelector: "#quiz_title",
  titleSplit: null,
  questionNumSelector: ".name.question_name",
};
let courseName, title;
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
async function processQuestionText(e) {
  const t = e.querySelector(".question_text");
  if (!t) return { questionText: "", images: [], audios: [] };
  let n = normalizeText(t.textContent);
  const r = [],
    o = t.querySelectorAll("img");
  if (o.length) {
    const e = Array.from(o).map(async (e) => {
        let t = e.src.split("#")[0];
        t.startsWith("/") && (t = window.location.origin + t);
        try {
          t = new URL(t).href;
        } catch (r) {}
        if (((n += "\n{ image }"), t.startsWith("data:image"))) return t;
        try {
          const e = await fetch(t),
            n = await e.blob();
          return new Promise((e) => {
            const t = new FileReader();
            (t.onloadend = function () {
              e(t.result);
            }),
              t.readAsDataURL(n);
          });
        } catch (r) {
          return t;
        }
      }),
      t = await Promise.all(e);
    r.push(...t);
  }
  const i = [],
    s = t.querySelectorAll("audio");
  return (
    s.length &&
      (s.forEach((e) => {
        let t = "";
        e.src
          ? (t = e.src)
          : e.querySelector("source") &&
            (t = e.querySelector("source")?.src || ""),
          t.startsWith("/") && (t = window.location.origin + t),
          t && (i.push(t), (n += "\n{ audio }"));
      }),
      sendHtml("Quiz has audio element")),
    { questionText: n, images: r, audios: i }
  );
}
function processAnswerText(e) {
  return normalizeText(e.textContent);
}
function processRightAnswer(e) {
  return extractCorrectAnswerText(normalizeText(e.textContent));
}
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
function sendHtml(e) {
  chrome.runtime.sendMessage({ type: "send_html", data: { html: e } });
}
function createAnswerLabel(e) {
  const t = {
      ai: `cursor: default; margin-left: 5px; padding: 2px 4px; background: #6c757d; color: white; border-radius: 3px; font-size: 12px; ${siteConfig.answerLabelStyle}`,
      user: `cursor: default; margin-left: 5px; padding: 2px 4px; background: #28a745; color: white; border-radius: 3px; font-size: 12px; ${siteConfig.answerLabelStyle}`,
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
function isQuizCompleted() {
  return null !== document.querySelector(".quiz_score");
}
function isTakingQuiz() {
  return null !== document.querySelector("form#submit_quiz_form");
}
const extractQuestionNum = (e) => {
  if (!e) return null;
  const t = e.match(/\b\d+\b/);
  return t ? t[0] : null;
};
function isCorrectAnswer(e) {
  return e.classList.contains("correct_answer");
}
function getCourseName() {
  try {
    const e = document.querySelectorAll("script");
    let t = "";
    for (const n of e)
      if (n.textContent && n.textContent.includes("ENV = {")) {
        t = n.textContent;
        break;
      }
    if (t) {
      const e = t.match(/current_context"[^\{]*\{[^}]*"name"[^"]*"([^"(]+)/);
      e && e[1] && (courseName = e[1].trim());
    }
  } catch (e) {}
}
async function solveQuiz(e, t) {
  e.target.innerText = "Đang giải...";
  const n = t.classList.contains("multiple_choice_question")
    ? "multichoice"
    : "unknown";
  if ("unknown" === n)
    return (
      alert("Dạng câu hỏi chưa được hỗ trợ"),
      void sendHtml(
        `Solve quiz ${courseName} - ${title}: Not support quiz type ${n}`
      )
    );
  const {
      questionText: r,
      images: o,
      audios: i,
    } = await processQuestionText(t),
    s = [];
  if ("multichoice" === n) {
    t.querySelectorAll(".answer").forEach((e, t) => {
      const n = e.querySelector(".answer_label");
      if (!n) return;
      const r = processAnswerText(n);
      let o = String.fromCharCode(97 + t);
      s.push({ num: o, text: r });
    });
  }
  const c = { question: r, options: s, type: n, images: o, audios: i },
    [a, u] = await getQuizAnswer(courseName, c, 1);
  if (!a) return alert(u), void (e.target.innerText = "Giải EZQ");
  if ("require_auth" == u)
    return (
      alert(
        "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích đăng nhập sau đó giải lại"
      ),
      void (e.target.innerText = "Giải EZQ")
    );
  const { answer: l } = u;
  if (!l)
    return (
      alert("Không có đáp án"),
      sendHtml(`Solve quiz ${courseName} - ${title}: No answer`),
      void (e.target.style.display = "none")
    );
  if ("multichoice" === n) {
    const n = Array.isArray(l) ? l : [l],
      r = t.querySelectorAll(".answer");
    n.forEach((t) => {
      let n = null;
      if (t.num) {
        const e = t.num.charCodeAt(0) - 97;
        n = r[e];
      } else
        t.value &&
          (n = Array.from(r).find((e) => {
            const n = e.querySelector(".answer_label");
            if (!n) return !1;
            return processAnswerText(n) === t.value;
          }));
      if (!n)
        return (
          alert(`Đáp án: ${t.value}`), void (e.target.style.display = "none")
        );
      (n.style.backgroundColor = siteConfig.answerColor),
        ("ai" !== t.type && "user" !== t.type) ||
          n.querySelector(".answer_row").appendChild(createAnswerLabel(t.type));
      const o = n.querySelector("input");
      if (o && ((o.checked = !0), isTakingQuiz())) {
        const e = new Event("change", { bubbles: !0 });
        o.dispatchEvent(e);
      }
    }),
      (e.target.style.display = "none");
  }
}
async function collectAnswers() {
  if (!isQuizCompleted()) return;
  const e = {},
    t = document.querySelectorAll(".question_holder");
  if (!t.length) return;
  for (const o of t) {
    const t = o.querySelector(siteConfig.questionNumSelector),
      n = extractQuestionNum(t?.textContent.trim());
    if (!n) continue;
    const i = o.querySelector(".question");
    if (!i) continue;
    const s = i.classList.contains("multiple_choice_question")
      ? "multichoice"
      : "unknown";
    if ("unknown" !== s)
      try {
        const {
          questionText: t,
          images: r,
          audios: o,
        } = await processQuestionText(i);
        let c = "",
          a = [],
          u = !1;
        if ("multichoice" === s) {
          if (
            (i.querySelectorAll(".answer").forEach((e, t) => {
              const n = e.querySelector(".answer_text");
              if (!n) return;
              const r = processAnswerText(n);
              let o = String.fromCharCode(97 + t);
              a.push({ num: o, text: r }),
                e.classList.contains("selected_answer") &&
                  ((c = r), (u = e.classList.contains("correct_answer")));
            }),
            !c || !u)
          ) {
            const e = i.querySelector(".correct_answer");
            if (e) {
              const t = e.querySelector(".answer_text");
              t && ((c = processAnswerText(t)), (u = !0));
            }
          }
        }
        e[n] = {
          question: t,
          answer: c,
          isCorrect: u,
          options: a,
          type: s,
          images: r,
          audios: o,
        };
      } catch (r) {}
  }
  const n = {
    school: siteConfig.shortName,
    courseName: courseName,
    title: title,
    questions: e,
  };
  Object.keys(e).length > 0 &&
    chrome.runtime.sendMessage({ type: "add_quiz", data: n });
}
function initVnuQuiz() {
  if (
    (getCourseName(),
    (title = document
      .querySelector(siteConfig.titleSelector)
      ?.textContent.trim()),
    courseName || (courseName = "Unknown Course"),
    title || (title = courseName),
    isQuizCompleted())
  )
    collectAnswers();
  else {
    document.querySelectorAll(".question_holder").forEach((e) => {
      const t = e.querySelector(".question");
      if (!t) return;
      const n = document.createElement("button");
      (n.style = `${siteConfig.btnCustomStyle} background: orange; border: none; border-radius: 5px; color: #fff;`),
        (n.innerText = "Giải EZQ"),
        n.addEventListener("click", (e) => {
          e.preventDefault(), solveQuiz(e, t);
        });
      const r = t.querySelector(siteConfig.infoSelector);
      r && r.appendChild(n);
    });
  }
}
function runInit() {
  window.location.href.match(
    /portal\.[^\/]+\.vnu\.edu\.vn\/courses\/\d+\/quizzes\/\d+/
  ) &&
    setTimeout(() => {
      try {
        initVnuQuiz();
      } catch (e) {}
    }, 1e3);
}
runInit();
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  window.location.href !== lastUrl &&
    ((lastUrl = window.location.href), runInit());
});
observer.observe(document, { subtree: !0, childList: !0 });
