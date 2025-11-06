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
      .trim() || "",
  title =
    document
      .querySelector(siteConfig.titleSelector)
      ?.textContent.split(siteConfig.titleSplit)[0]
      .trim() || "EMPTY_TITLE",
  hostAllowFlex = [
    "lms.ueh.edu.vn",
    "lmse.ueh.edu.vn",
    "elearning.ctu.edu.vn",
    "lms.uel.edu.vn",
    "lms.neu.edu.vn",
    "utexlms.hcmute.edu.vn",
    "lms.dlu.edu.vn",
    "courses.huflit.edu.vn",
    "learning.ehou.edu.vn",
  ];
async function getQuizAnswer(e, t, n) {
  const r = siteConfig.shortName || "";
  return new Promise((o, s) => {
    chrome.runtime.sendMessage(
      {
        type: "get_quiz_answer",
        data: { courseName: e, question: t, school: r, answerCount: n },
      },
      (e) => {
        if (chrome.runtime.lastError) return s("send_message_error");
        o(e);
      }
    );
  });
}
function solveMultichoice(e, t) {
  const n = Array.from(t).find((n) => {
    if (!e.num) return !1;
    let r = n
      .querySelector(".answernumber")
      ?.textContent.replace(".", "")
      .trim();
    return (
      r || (r = (Array.from(t).indexOf(n) + 1).toString()),
      e.num.toLowerCase() === r.toLowerCase()
    );
  });
  if (!n) return void alert(`Đáp án: ${e.value}`);
  n.style.backgroundColor = siteConfig.answerColor;
  let r = n.querySelector(".flex-fill");
  if (
    (r || (r = n.querySelector("label")),
    hostAllowFlex.includes(window.location.hostname) &&
      ((r.style.display = "inline-flex"),
      (r.style.alignItems = "center"),
      (r.style.margin = "0")),
    "ai" === e.type || "user" === e.type)
  ) {
    const t = createAnswerLabel(e.type);
    r.appendChild(t);
  }
  const o = n.querySelector('input[type="radio"], input[type="checkbox"]');
  if (o) {
    o.checked = !0;
    const e = new Event("change", { bubbles: !0 });
    o.dispatchEvent(e);
    const t = new Event("click", { bubbles: !0 });
    o.dispatchEvent(t);
  } else {
    const e = r || n,
      t = new MouseEvent("click", { bubbles: !0 });
    e.dispatchEvent(t);
  }
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
function getAnswerCount(e, t) {
  return "formulas" === t
    ? e.querySelectorAll('.formulation input[type="text"]').length
    : 1;
}
async function solveQuiz(e, t) {
  e.target.disabled = !0;
  const n = t.classList[1],
    r = t.querySelector(".nolink");
  if (
    ![
      "multichoice",
      "multianswer",
      "shortanswer",
      "truefalse",
      "essay",
      "numerical",
      "formulas",
    ].includes(n)
  )
    return (
      alert("Dạng câu hỏi chưa được hỗ trợ"),
      sendHtml(
        `Solve quiz ${courseName} - ${title}: Not support quiz type ${n}`
      ),
      void e.target.remove()
    );
  const {
      questionText: o,
      images: s,
      audios: l,
    } = await processQuestionText(t, n, r),
    i = [],
    a = t.querySelectorAll(".answer > div");
  "multichoice" === n &&
    a.forEach((e, t) => {
      let n = e
        .querySelector(".answernumber")
        ?.textContent.replace(".", "")
        .trim();
      n || (n = (t + 1).toString());
      const o = processAnswerText(e, r);
      i.push({ num: n, text: o });
    });
  const c = { question: o, options: i, type: n, images: s, audios: l };
  "multichoice" === n &&
    t.querySelector('input[type="checkbox"]') &&
    (c.multiple = !0);
  const u = getAnswerCount(t, n),
    [d, p] = await getQuizAnswer(courseName, c, u);
  if (!d) return alert(p), void (e.target.disabled = !1);
  if ("require_auth" == p)
    return (
      alert(
        "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích đăng nhập sau đó giải lại"
      ),
      void (e.target.disabled = !1)
    );
  if (!p || "no_answer" == p || !p.answer)
    return (
      alert("Không có đáp án"),
      sendHtml(`Solve quiz ${courseName} - ${title}: No answer`),
      void (e.target.disabled = !1)
    );
  const { answer: m } = p;
  if ("multichoice" === n) {
    (Array.isArray(m) ? m : [m]).forEach((e) => solveMultichoice(e, a));
  } else if ("truefalse" === n) {
    const n = t.querySelector(`.answer > div > label[for*="answer${m.value}"]`);
    if (!n) return alert(`Đáp án: ${m.value}`), void e.target.remove();
    const r = n.parentNode;
    (r.style.backgroundColor = siteConfig.answerColor),
      hostAllowFlex.includes(window.location.hostname) &&
        ((r.style.display = "inline-flex"),
        (r.style.alignItems = "center"),
        (r.style.margin = "0")),
      ("ai" !== m.type && "user" !== m.type) ||
        r.appendChild(createAnswerLabel(m.type));
    const o = r.querySelector('input[type="radio"]');
    if (o) {
      o.checked = !0;
      const e = new Event("change", { bubbles: !0 });
      o.dispatchEvent(e);
      const t = new Event("click", { bubbles: !0 });
      o.dispatchEvent(t);
    } else {
      const e = n || r,
        t = new MouseEvent("click", { bubbles: !0 });
      e.dispatchEvent(t);
    }
  } else if ("shortanswer" === n || "essay" === n || "numerical" === n) {
    const r =
        "shortanswer" === n || "numerical" === n
          ? '.answer > input[type="text"]'
          : ".answer > textarea",
      o = t.querySelector(r);
    if (!o)
      return (
        m.value ? alert(`Đáp án: ${m.value}`) : alert("Không có đáp án"),
        void e.target.remove()
      );
    const s = t.querySelector(".answer");
    o["shortanswer" === n || "numerical" === n ? "value" : "textContent"] =
      m.value;
    const l = new Event("input", { bubbles: !0 });
    o.dispatchEvent(l);
    const i = new Event("change", { bubbles: !0 });
    o.dispatchEvent(i),
      hostAllowFlex.includes(window.location.hostname) &&
        ((s.style.display = "inline-flex"),
        (s.style.alignItems = "center"),
        (s.style.margin = "0")),
      ("ai" !== m.type && "user" !== m.type) ||
        s.appendChild(createAnswerLabel(m.type)),
      "essay" === n &&
        sendHtml(`Solve essay question ${courseName} - ${title}`);
  } else
    "formulas" === n
      ? ("string" == typeof m.value && (m.value = [m.value]),
        t
          .querySelectorAll('.formulation input[type="text"]')
          .forEach((e, t) => {
            e.value = m.value[t];
            const n = new Event("input", { bubbles: !0 });
            e.dispatchEvent(n);
            const r = new Event("change", { bubbles: !0 });
            e.dispatchEvent(r),
              e.parentNode.appendChild(createAnswerLabel(m.type));
          }))
      : "multianswer" === n &&
        ("string" == typeof m.value && (m.value = [m.value]),
        t
          .querySelectorAll('.formulation input[type="text"]')
          .forEach((e, t) => {
            e.value = m.value[t];
            const n = new Event("input", { bubbles: !0 });
            e.dispatchEvent(n);
            const r = new Event("change", { bubbles: !0 });
            e.dispatchEvent(r),
              e.parentNode.appendChild(createAnswerLabel(m.type));
          }));
  e.target.remove();
}
function main() {
  if (title.toLowerCase().includes("điểm danh")) return;
  const e = document.querySelectorAll(".que");
  e.length &&
    e.forEach((e) => {
      const t = document.createElement("button"),
        n = siteConfig.btnCustomStyle;
      (t.style = `${n} background: orange; border: none; border-radius: 5px; color: #fff; display: none; cursor: pointer;`),
        (t.innerText = "Giải EZQ"),
        t.addEventListener("click", (t) => {
          t.preventDefault(), solveQuiz(t, e);
        });
      const r = document.createElement("style");
      (r.textContent =
        "\n      button:disabled {\n        background: #6c757d !important;\n        cursor: not-allowed !important;\n        opacity: 0.6 !important;\n      }\n    "),
        document.querySelector("style[data-ezq-disabled]") ||
          (r.setAttribute("data-ezq-disabled", "true"),
          document.head.appendChild(r)),
        e.addEventListener("mouseenter", () => {
          t.style.display = "inline-block";
        }),
        e.addEventListener("mouseleave", () => {
          t.style.display = "none";
        });
      const o = siteConfig.infoSelector;
      e.querySelector(o)?.appendChild(t);
    });
}
main();
