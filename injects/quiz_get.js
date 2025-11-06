const siteConfig = siteConfigData[window.location.hostname],
  courseElement = document.querySelector(siteConfig.courseSelector),
  courseName =
    courseElement?.textContent
      .split(siteConfig.courseSplit)[0]
      .replace(/\[[A-Za-z0-9\.]+\]/, "")
      .replace(/ - \d{1,4}$/, "")
      .replace(/_\d{1,4}$/, "")
      .replace(/\(\d{1,4}\)$/, "")
      .replace(/[A-Z]{1,5}[0-9]{1,5}\([0-9]{1,4}\)_[0-9]{1,4}-/, "")
      .trim() || "EMPTY_COURSE_NAME",
  title =
    document
      .querySelector(siteConfig.titleSelector)
      ?.textContent.split(siteConfig.titleSplit)[0]
      .trim() || "EMPTY_TITLE",
  school = siteConfig.shortName || "";
async function checkAddQuiz(e) {
  e.questions &&
    0 !== Object.keys(e.questions).length &&
    chrome.runtime.sendMessage({ type: "add_quiz", data: e });
}
const extractQuestionNum = (e) => {
  if (!e) return null;
  const t = e.match(/\b\d+\b/);
  return t ? t[0] : null;
};
function isCorrectAnswer(e, t, r) {
  if ("notanswered" === r || "incorrect" === r) return !1;
  const n = e.match(/(\d+(\.|,\d+)?)(?:\s*\w+\s*)(\d+(\.|,\d+)?)/i);
  if (!n) return !1;
  const s = parseFloat(n[1]),
    o = n[3] ? parseFloat(n[3]) : null;
  return (null !== o && s === o) || (s > 0 && "essay" !== t);
}
async function getAnswerQuiz(e, t) {
  const r = e.querySelector(".nolink"),
    {
      questionText: n,
      images: s,
      audios: o,
    } = await processQuestionText(e, t, r),
    i = [];
  let l = "",
    c = [];
  const u = e.querySelectorAll(".answer > div"),
    a = e.classList[3],
    m = e.querySelector(".grade")?.textContent.trim();
  let p = isCorrectAnswer(m.replace(/,/g, "."), t, a);
  const f = e.querySelector(".rightanswer");
  if ("multichoice" === t)
    u.forEach((e, t) => {
      let n = e
        .querySelector(".answernumber")
        ?.textContent.replace(".", "")
        .trim();
      n || (n = (t + 1).toString());
      const s = processAnswerText(e, r);
      i.push({ num: n, text: s });
      const o = e.querySelector("input");
      o &&
        o.checked &&
        ("radio" === o.type ? (l = s) : "checkbox" === o.type && c.push(s));
    }),
      !p &&
        f &&
        ((l = processRightAnswer(f, r)),
        c.length && (c = l.split(",").map((e) => e.trim())),
        (p = !0));
  else if ("shortanswer" === t)
    (l = e.querySelector('.answer > input[type="text"]')?.value.trim()),
      !p && f && ((l = processRightAnswer(f, r)), (p = !0));
  else if ("truefalse" === t) {
    const r = e.querySelector('.answer > div > input[type="radio"]:checked');
    if (!r)
      return (
        sendHtml(
          `Not found answer element ${courseName} - ${title}, questionType: ${t}`
        ),
        null
      );
    if ("1" === r.value.trim()) l = "true";
    else {
      if ("0" !== r.value.trim())
        return (
          sendHtml(
            `Invalid answer element ${courseName} - ${title}, questionType: ${t}`
          ),
          null
        );
      l = "false";
    }
    p || ((l = "true" === l ? "false" : "true"), (p = !0));
  } else if ("essay" === t)
    sendHtml(`Get essay quiz ${courseName} - ${title}`),
      (l = e.querySelector(".answer")?.textContent.trim()),
      !p && f && ((l = f.innerText.trim()), (p = !0));
  else if ("numerical" === t)
    (l = e.querySelector('.answer > input[type="text"]')?.value.trim()),
      !p && f && ((l = extractCorrectAnswerText(f.innerText)), (p = !0));
  else {
    if ("formulas" !== t)
      return (
        sendHtml(`Not support quiz type ${courseName} - ${title}: ${t}`), null
      );
    (c = [...e.querySelectorAll('.formulation input[type="text"]')].map((e) =>
      e.value.trim()
    )),
      e.querySelector(".formulaspartcorrectanswer") &&
        ((c = [...e.querySelectorAll(".formulaspartcorrectanswer")].map((e) =>
          extractCorrectAnswerText(e.innerText)
        )),
        c.length && (p = !0));
  }
  c.length && (l = c);
  return {
    question: n,
    answer: l,
    isCorrect: p,
    options: i,
    type: t,
    images: s,
    audios: o,
  };
}
const questionTypes = [
  "multichoice",
  "shortanswer",
  "truefalse",
  "essay",
  "numerical",
  "formulas",
];
async function main() {
  if (title.toLowerCase().includes("điểm danh")) return;
  const e = {},
    t = document.querySelectorAll(".que");
  if (!t.length) return;
  for (const n of t) {
    const t = n.classList[1];
    if ("description" === t) return;
    const s = extractQuestionNum(
      n.querySelector(siteConfig.questionNumSelector)?.textContent.trim()
    );
    if (!s) return;
    if ("multianswer" === t);
    else if (questionTypes.includes(t))
      try {
        const r = await getAnswerQuiz(n, t);
        r && (e[s] = r);
      } catch (r) {}
  }
  checkAddQuiz({
    school: school,
    courseName: courseName,
    title: title,
    questions: e,
  });
}
main();
