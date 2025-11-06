const userMetaData = document.getElementById("user-metadata"),
  courseData = userMetaData
    ? JSON.parse(userMetaData?.textContent.trim())
    : null,
  normalizeText = (e) =>
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
async function getCmsManualAnswer(e, t) {
  return new Promise((n, r) => {
    chrome.runtime.sendMessage(
      { type: "get_cms_manual_answer", courseId: e, questions: t },
      (e) => {
        if (chrome.runtime.lastError) return r("send_message_error");
        n(e);
      }
    );
  });
}
async function startCmsAutoAnswer(e) {
  return new Promise((t, n) => {
    chrome.runtime.sendMessage(
      { type: "start_cms_auto_answer", courseId: e },
      (e) => {
        if (chrome.runtime.lastError) return n("send_message_error");
        t(e);
      }
    );
  });
}
function isQuizTitle(e) {
  const t = ["quiz", "final", "quzi"];
  for (const n of t) if (e.includes(n)) return !0;
  return !1;
}
function addSolveBtn() {
  const e = document.querySelector(".unit-title");
  if (e && isQuizTitle(e.textContent.toLowerCase())) {
    const t = document.createElement("button");
    (t.id = "solveBtn"),
      (t.style =
        "margin-left: 20px; padding: 3px 10px; background: orange; border-radius: 5px; color: #fff; font-size: 16px;"),
      (t.innerText = "Giải EZQ"),
      t.addEventListener("click", solveQuiz),
      e.appendChild(t);
  }
}
function addAutoSolveBtn() {
  const e = document.querySelector(".unit-title");
  if (e && isQuizTitle(e.textContent.toLowerCase())) {
    const t = document.createElement("button");
    (t.id = "autoSolveBtn"),
      (t.style =
        "margin-left: 20px; padding: 3px 10px; background: orange; border-radius: 5px; color: #fff; font-size: 16px;"),
      (t.innerText = "Auto EZQ"),
      t.addEventListener("click", autoSolveQuiz),
      e.appendChild(t);
  }
}
function sleep(e) {
  return new Promise((t) => setTimeout(t, e));
}
function createLogBox() {
  const e = document.createElement("div");
  (e.className = "log"),
    (e.style.cssText =
      "\n    overflow-y: auto;\n    width: 100%;\n    height: 200px;\n    background: #f1f1f1;\n    border: 1px solid #ccc;\n    border-radius: 5px;\n    padding: 10px;\n    margin-bottom: 10px;\n  ");
  const t = document.querySelector("footer");
  return t.insertBefore(e, t.firstChild), e;
}
let logBox = null;
function addLog(e) {
  const t = document.createElement("div");
  (t.textContent = e), logBox.insertBefore(t, logBox.firstChild);
}
async function autoSolveQuiz(e) {
  (e.target.innerText = "Auto EZQ..."), (e.target.disabled = !0);
  const t = courseData.course_key_fields.course,
    [n, r] = await startCmsAutoAnswer(t);
  if (!n)
    return (
      alert(r), (e.target.disabled = !1), void (e.target.innerText = "Auto EZQ")
    );
  function o(e) {
    for (let t = 0; t < e.length; t++) if (((e[t] = !e[t]), !e[t])) return !0;
    return !1;
  }
  function i() {
    return {
      fieldsets: document.querySelectorAll(".choicegroup"),
      fillBlanks: document.querySelectorAll(".poly-input"),
    };
  }
  function s(e, t) {
    return (e + 1) % t;
  }
  "require_auth" == r &&
    (alert(
      "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích đăng nhập sau đó giải lại"
    ),
    (e.target.disabled = !1),
    (e.target.innerText = "Auto EZQ")),
    logBox || (logBox = createLogBox());
  const { fieldsets: l, fillBlanks: c } = i(),
    a = Array.from(l).map((e) => {
      const t = e.querySelectorAll(".field");
      return null !== e.querySelector('input[type="radio"]')
        ? 0
        : new Array(t.length).fill(!0);
    }),
    u = Array.from(c).map((e) => {
      const t = e.querySelectorAll("input.nn-blank").length,
        n = e.querySelectorAll(
          ".poly-choices .tags li:not(.poly-reset)"
        ).length;
      if (0 === n)
        return {
          skipQuestion: !0,
          currentCombinationIndex: 0,
          combinations: [[]],
        };
      const r = [];
      if (t > n) {
        const e = Array(t)
          .fill(0)
          .map((e, t) => t % n);
        r.push(e);
      } else
        !(function e(t, o, i) {
          if (0 !== i)
            for (let r = o; r < n; r++) t.push(r), e(t, r + 1, i - 1), t.pop();
          else r.push([...t]);
        })([], 0, t);
      return { skipQuestion: !1, currentCombinationIndex: 0, combinations: r };
    }),
    d = Array(c.length).fill(!1),
    p = Array.from(c).map((e) => {
      const t = e.querySelectorAll(".poly-choices .tags li:not(.poly-reset)");
      return Array.from(t).map((e) => e.textContent.trim());
    });
  let m = 0,
    g = !1;
  for (; !g && m < 9999; ) {
    m++, addLog(`Giải lần ${m}`);
    const e = document.querySelectorAll(".choicegroup");
    for (const [o, i] of Array.from(e).entries()) {
      const e = i.querySelectorAll(".field"),
        t = null !== e[0].querySelector('input[type="radio"]');
      i.querySelector(".choicegroup_correct") ||
        (t
          ? (e[a[o]].querySelector("input").click(), (a[o] = s(a[o], e.length)))
          : e.forEach((e, t) => {
              e.querySelector("input").checked = a[o][t];
            }));
    }
    const t = document.querySelectorAll(".poly-input");
    for (const [o, i] of Array.from(t).entries()) {
      const e = i.nextElementSibling;
      if (
        e?.querySelector(".status.correct") ||
        i.querySelector(".indicator-container .status.correct")
      )
        continue;
      if (u[o].skipQuestion) continue;
      const t = i.querySelectorAll("input.nn-blank").length,
        n = u[o],
        r = n.combinations[n.currentCombinationIndex];
      if (d[o]) {
        const n = e.querySelectorAll('input[type="text"]');
        if (1 === n.length && t > 1) {
          const e = n[0];
          if (e) {
            const t = u[o],
              n = t.combinations[t.currentCombinationIndex].map((e) =>
                slug(p[o][e]).replace(/, /g, ",")
              );
            e.value = n.join(",");
            const r = new Event("input", { bubbles: !0 });
            e.dispatchEvent(r), addLog(`Câu ${o + 1}: Thử với ${e.value}`);
          }
        } else if (n.length === t)
          for (let e = 0; e < t; e++) {
            const t = n[e];
            if (t) {
              const n = r[e];
              t.value = slug(p[o][n]).replace(/, /g, ",");
              const i = new Event("input", { bubbles: !0 });
              t.dispatchEvent(i);
            }
          }
      } else {
        const e = i.querySelectorAll(".poly-choices .tags li:not(.poly-reset)");
        if (e.length > 0) {
          const n = i.querySelector(".poly-choices .tags li.poly-reset");
          n && n.click();
          for (let o = 0; o < t; o++) {
            e[r[o]].click();
          }
        }
      }
    }
    const n = document.querySelector("button.submit");
    await sleep(1e3),
      n.removeAttribute("disabled"),
      await sleep(1e3),
      n.click(),
      await sleep(2e3),
      1 === m && d.fill(!0);
    const { fieldsets: r, fillBlanks: l } = i();
    g = !0;
    for (const [i, s] of Array.from(r).entries())
      s.querySelector(".choicegroup_correct")
        ? addLog(`Câu ${i + 1}: Đúng`)
        : (addLog(`Câu ${i + 1}: Sai, thử lại`),
          s.querySelector('input[type="radio"]') || o(a[i]),
          (g = !1));
    for (const [o, i] of Array.from(l).entries()) {
      if (u[o].skipQuestion) continue;
      const e = i.nextElementSibling;
      if (
        e?.querySelector(".status.correct") ||
        i.querySelector(".indicator-container .status.correct")
      )
        addLog(`Fill-in-blank ${o + 1}: Đúng`);
      else {
        addLog(`Fill-in-blank ${o + 1}: Sai, thử lại`);
        const e = u[o];
        (e.currentCombinationIndex =
          (e.currentCombinationIndex + 1) % e.combinations.length),
          (g = !1);
      }
    }
    let c = !1;
    for (const [o, i] of Array.from(l).entries())
      if (u[o].skipQuestion) {
        const e = i.nextElementSibling;
        e?.querySelector(".status.correct") ||
          i.querySelector(".indicator-container .status.correct") ||
          ((c = !0), addLog(`Câu ${o + 1}: Cần nhập thủ công`));
      }
    if (g) {
      addLog(
        c
          ? "Tất cả câu hỏi tự động đã giải đúng. Một số câu cần nhập thủ công."
          : "Tất cả câu hỏi đã trả lời đúng!"
      );
      break;
    }
    await sleep(3e3);
  }
  (e.target.innerText = "Auto EZQ"),
    (e.target.disabled = !1),
    addLog(`Quiz đã giải xong sau ${m} lần thử`);
}
async function solveQuiz(e) {
  e.target.disabled = !0;
  const t = courseData.course_key_fields.course,
    n = Array.from(document.querySelectorAll(".poly-body")).map((e) => {
      let t = normalizeText(e.innerText);
      const n = e.querySelectorAll("img");
      n.length &&
        n.forEach((e) => {
          t += `\nImage:${e.src}`;
        });
      const r = e.querySelectorAll("audio");
      r.length &&
        r.forEach((e) => {
          e.src
            ? (t += `\nAudio:${e.src}`)
            : (t += `\nAudio:${e.querySelector("source")?.src}`);
        });
      const o = e.querySelectorAll("a");
      o.length &&
        o.forEach((e) => {
          t += `\nFile:${e.href}`;
        });
      const i = e.querySelector("iframe");
      return i && (t += `\nIframe:${i.src}`), t;
    }),
    [r, o] = await getCmsManualAnswer(t, n);
  if (!r)
    return (
      "Failed to fetch" == o
        ? alert("Không lấy được đáp án, thử lại sau")
        : "no_answer" == o
        ? alert("Hiện chưa có đáp án cho môn học này, thử lại sau")
        : alert(o),
      void (e.target.disabled = !1)
    );
  "require_auth" == o &&
    (alert(
      "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích đăng nhập sau đó giải lại"
    ),
    (e.target.disabled = !1)),
    createAnswerBox(o);
}
function dectectYoutubeVideo() {
  const e = document.querySelector(".video");
  if (!e) return null;
  const t = e.getAttribute("data-metadata");
  if (!t) return null;
  const n = JSON.parse(t);
  if (n.ytApiUrl && n.streams) {
    return `https://www.youtube.com/watch?v=${n.streams.split(":")[1]}`;
  }
  return null;
}
function addSummaryButton() {
  const e = document.createElement("a");
  e.innerHTML = "Tóm tắt video";
  const t = dectectYoutubeVideo();
  t &&
    ((e.href = "https://app.easyquiz.cc/tom-tat?ref=cms_poly&url=" + t),
    (e.target = "_blank"),
    (e.className = "btn btn-primary"),
    document.querySelector(".sequence-bottom")?.appendChild(e));
}
function bypass() {
  const e = window.location.href.split("?")[0].split("#")[0];
  chrome.runtime.sendMessage({ type: "update_seb_url", url: e }, () => {
    window.location.href = e;
  });
}
function getSubmitUrl() {
  if (!courseData) return;
  const e = document
      .querySelector("div.problems-wrapper")
      ?.getAttribute("aria-labelledby")
      .replace("-problem-title", ""),
    t = courseData.course_id.replace("course-v1:", "");
  return t && e
    ? `https://cms.poly.edu.vn/courses/course-v1:${t}/xblock/block-v1:${t}+type@problem+block@${e}/handler/xmodule_handler/problem_check`
    : "";
}
setTimeout(() => {
  addSummaryButton();
}, 2e3);
const mainTitle = document.querySelector("#main > h1");
if ("Error: Access not allowed" === mainTitle?.textContent.trim()) {
  const e = document.createElement("div");
  (e.innerHTML =
    '\n  <h2 class="text-xl font-semibold mb-2 text-blue-500" style="text-align: center;">Easy Quiz Poly thông báo:</h2>\n  <p class="text-lg" style="text-align: center;">\n    <a href="https://quizpoly.xyz/premium" target="_blank">Dùng Easy Quiz Extension sẽ không cần SEB để vào làm quiz</a> <br /> <br />\n    <a id="bypassBtn" href="#"><strong>Nhấn để vào (Bypass)</strong></a>\n  </p>\n  '),
    (e.className = "bg-gray-100 p-4 rounded-md mt-10"),
    mainTitle.parentNode.appendChild(e),
    document.querySelector("#bypassBtn").addEventListener("click", bypass);
}
const submitUrl = getSubmitUrl();
function addAnswered([e, t]) {
  const n = t.querySelector("div.incorrect"),
    r = t.querySelector("div.correct");
  n && getValue(e, n, "incorrect"), r && getValue(e, r, "correct");
}
function getValue(e, t, n) {
  const r = t.querySelector("input").getAttribute("value"),
    o = document.createElement("div");
  o.setAttribute("class", "indicator-container"),
    (o.innerHTML = `<span class='status ${n}' data-tooltip="This answer is ${n}.">\n    <span class="sr">${n}</span><span class="status-icon" aria-hidden="true">${r} </span>\n  </span>`),
    e.firstElementChild.appendChild(o);
}
submitUrl &&
  chrome.runtime.sendMessage({ type: "update_seb_url", url: submitUrl }),
  (() => {
    addSolveBtn();
    const e = Array.from(document.querySelectorAll("div.poly")),
      t = Array.from(document.querySelectorAll("div.wrapper-problem-response"));
    if (e.length !== t.length) throw new Error("quesel and ansel not compare");
    e.map((e, n) => [e, t[n]]).forEach(addAnswered);
    const n = document.querySelector("button.submit");
    setInterval(() => {
      n && n.removeAttribute("disabled");
    }, 2e3);
  })();
let dragStartX,
  dragStartY,
  answerBox = null,
  isDragging = !1;
function closeAnswerBox() {
  answerBox &&
    (answerBox.remove(),
    document.removeEventListener("mousemove", handleDrag),
    document.removeEventListener("mouseup", stopDragging),
    (answerBox = null),
    (document.getElementById("solveBtn").disabled = !1));
}
function createAnswerBox(e) {
  (answerBox = document.createElement("div")),
    (answerBox.id = "answers-box"),
    (answerBox.style.cssText =
      "\n    position: fixed;\n    z-index: 10000;\n    background: white;\n    border: 1px solid #ccc;\n    border-radius: 10px;\n    padding: 10px;\n    box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n    top: 10px;\n    right: 10px;\n  ");
  const t = document.createElement("div");
  t.style.cssText =
    "\n    height: 14px;\n    background: #ef9403;\n    border-bottom: 1px solid #ccc;\n    margin-bottom: 8px;\n    cursor: move;\n    border-radius: 4px 4px 0 0;\n    position: relative;\n  ";
  const n = document.createElement("div");
  n.style.cssText =
    "\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  ";
  for (let l = 0; l < 3; l++) {
    const e = document.createElement("div");
    (e.style.cssText =
      "\n      width: 4px;\n      height: 4px;\n      background-color: #fff;\n      border-radius: 50%;\n      margin: 0 2px;\n    "),
      n.appendChild(e);
  }
  t.appendChild(n),
    answerBox.appendChild(t),
    t.addEventListener("mousedown", startDragging);
  const r = document.createElement("button");
  (r.innerHTML = "&times;"),
    (r.style.cssText =
      "\n    position: absolute;\n    top: 7px;\n    right: 10px;\n    background: none;\n    border: none;\n    font-size: 18px;\n    cursor: pointer;\n    padding: 0;\n    line-height: 1;\n    color: #fff;\n  "),
    r.addEventListener("click", (e) => {
      e.stopPropagation(), closeAnswerBox();
    }),
    answerBox.appendChild(r);
  const o = document.createElement("div");
  (o.id = "list-answer"),
    (o.style.cssText =
      "\n    width: 500px;\n    margin-bottom: 10px;\n    border: none;\n    padding: 10px;\n    overflow-y: auto;\n  ");
  const i = document.createElement("style");
  (i.innerHTML =
    "\n    #answers-box div::-webkit-scrollbar {\n      width: 10px; /* Width of the scrollbar */\n    }\n    #answers-box div::-webkit-scrollbar-thumb {\n      background-color: #DFDFDF; /* Color of the scrollbar thumb */\n      border-radius: 10px; /* Roundness of the thumb */\n    }\n    #answers-box div::-webkit-scrollbar-thumb:hover {\n      background-color: #CECECE; /* Hover color of the scrollbar thumb */\n    }\n    #answers-box div::-webkit-scrollbar-track {\n      background-color: #f1f1f1; /* Color of the scrollbar track */\n      border-radius: 10px;\n    }\n  "),
    document.head.appendChild(i);
  const s = Math.min(300, 40 * e.length);
  (o.style.height = `${s}px`),
    e.forEach((e, t) => {
      const n = document.createElement("div");
      if (
        ((n.style.cssText =
          "\n      padding: 5px 0;\n      border-bottom: 1px solid #ddd;\n      font-size: 14px;\n      color: #333;\n    "),
        e)
      )
        if (Array.isArray(e)) n.textContent = `${t + 1}. ${e.join(" / ")}`;
        else if (e.includes(",")) {
          const r = e.split(",");
          n.textContent = `${t + 1}. ${r.join(", ")}`;
        } else n.textContent = `${t + 1}. ${e}`;
      else
        (n.textContent = `${t + 1}. Không có đáp án`), (n.style.color = "#ccc");
      o.appendChild(n), hightlightAnswer(t, e);
    }),
    answerBox.appendChild(o),
    document.body.appendChild(answerBox),
    document.addEventListener("mousemove", handleDrag),
    document.addEventListener("mouseup", stopDragging);
}
const wrapperProblemResponses = document.querySelectorAll(
  ".wrapper-problem-response"
);
function hightlightAnswer(e, t) {
  const n = wrapperProblemResponses[e];
  if (!n) return;
  const r = n.querySelectorAll(".field label"),
    o = n.previousElementSibling,
    i = o && o.className.includes("poly-input");
  let s = !1;
  if (i) {
    const e = o.querySelectorAll(".poly-choices .tags li:not(.poly-reset)");
    "string" == typeof t && t.includes(",") && (t = t.split(",")),
      0 === e.length
        ? (s = !0)
        : e.forEach((e) => {
            const n = e.textContent.toLowerCase().replace(/\s/g, "").trim(),
              r = slug(e.textContent.toLowerCase().trim());
            if (
              (Array.isArray(t) && t.includes(n)) ||
              n === t ||
              (Array.isArray(t) && t.includes(r)) ||
              r === t
            ) {
              if (
                ((e.style.boxShadow = "inset 0 0 10px 0 rgba(39, 168, 13)"),
                Array.isArray(t))
              ) {
                const n = createBadgeAnswer(t, r);
                e.parentElement.insertBefore(n, e);
              }
              s = !0;
            }
          });
  } else
    r.forEach((e) => {
      const n = e.querySelector("img");
      let r = normalizeText(e.textContent);
      n && (r += `\nImage:${n.src}`),
        Array.isArray(t)
          ? t.includes(r) && ((e.style.backgroundColor = "#e6ffe6"), (s = !0))
          : r === t && ((e.style.backgroundColor = "#e6ffe6"), (s = !0));
    });
}
function createBadgeAnswer(e, t) {
  const n = document.createElement("span");
  return (
    (n.style.cssText =
      "\n    display: inline-block;\n    background-color: #27a80d;\n    color: white;\n    border-radius: 50%;\n    width: 20px;\n    height: 20px;\n    text-align: center;\n    line-height: 20px;\n    font-size: 12px;\n    font-weight: bold;\n  "),
    (n.textContent = e.indexOf(t) + 1),
    n
  );
}
function slug(e) {
  if (!e) return "";
  const t = {
    đ: "d",
    Đ: "D",
    ă: "a",
    Ă: "A",
    â: "a",
    Â: "A",
    ê: "e",
    Ê: "E",
    ô: "o",
    Ô: "O",
    ơ: "o",
    Ơ: "O",
    ư: "u",
    Ư: "U",
  };
  return e
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split("")
    .map((e) => t[e] || e)
    .join("")
    .toLowerCase()
    .replace(/  +/g, " ")
    .trim();
}
function startDragging(e) {
  isDragging = !0;
  const t = answerBox.getBoundingClientRect();
  (dragStartX = e.clientX - t.left),
    (dragStartY = e.clientY - t.top),
    (answerBox.style.left = `${t.left}px`),
    (answerBox.style.right = "auto");
}
function handleDrag(e) {
  if (!isDragging) return;
  const t = e.clientX - dragStartX,
    n = e.clientY - dragStartY;
  (answerBox.style.left = `${t}px`), (answerBox.style.top = `${n}px`);
}
function stopDragging() {
  isDragging = !1;
}
