"use strict";
var version = chrome.runtime.getManifest().version,
  server = window.location.origin,
  host = window.location.host,
  isPTCD = "lms-ptcd.poly.edu.vn" === host || "lms9.poly.edu.vn" === host,
  isPTCD9 = "lms9.poly.edu.vn" === host,
  isOrit = "fpl4.poly.edu.vn" === host,
  currentUrl = window.location.href,
  urlParsed = new URL(currentUrl),
  quizId = getQuizId(),
  [sequence, totalQues] = getSequence(),
  CanNotGetAvailableAnswerMessage =
    "Không lấy được đáp án, thử lại sau, thử lại sau",
  NoAvailableAnswerMessage = "Hiện chưa có đáp án cho môn học này, thử lại sau";
function decodeEntities(e) {
  let t = document.createElement("div");
  return (
    e &&
      "string" == typeof e &&
      ((e = (e = e.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "")).replace(
        /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim,
        ""
      )),
      (t.innerHTML = e),
      (e = t.textContent),
      (t.textContent = "")),
    e
  );
}
function getRandomInt(e, t) {
  return (
    (e = Math.ceil(e)),
    (t = Math.floor(t)),
    Math.floor(Math.random() * (t - e) + e)
  );
}
function capitalizeFirstLetter(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
"function" != typeof String.prototype.replaceAll &&
  (String.prototype.replaceAll = function (e, t) {
    return this.split(e).join(t);
  });
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
function formatBeforeAdd(e) {
  return normalizeText(e);
}
function formatImg(e) {
  return e.replace(/(style=".*?"|\?il_wac_token=.*?")/g, "");
}
function formatCompare(e) {
  return normalizeText(e).toLowerCase();
}
function parseHTML(e) {
  const t = document.createElement("div");
  return (t.innerHTML = e), t;
}
async function sendHtml(e, t) {
  t || (t = document.body.innerHTML.replace(/\n/g, "").replace(/\t/g, "")),
    chrome.runtime.sendMessage({ type: "send_html", note: e, html: t });
}
function getQuizNumber() {
  try {
    let e = document.querySelector(".ilAccAnchor");
    return (
      e || (e = document.querySelector("#kioskTestTitle")),
      e && e.textContent
        ? (function (e) {
            let t = e.match(/(^|\D)([1-9][0-9]?)(\D|$)/);
            return t ? Number(t[2]) : 0;
          })(e.textContent)
        : 0
    );
  } catch (e) {
    return 0;
  }
}
function getSubject(e = document) {
  const t = e.querySelectorAll(".breadcrumb a"),
    n = /\b[A-Za-z]{3}\s?\d{3,4}/;
  let r = null;
  if (0 === t.length) return { subjectCode: "", subjectName: "" };
  for (const s of t) {
    const e = s.textContent.trim();
    if (
      !e.replace("_HK", "HK").startsWith("HK") &&
      ((r = e.replace(/_/g, "-").match(n)), r)
    ) {
      const t = r[0].replace(" ", ""),
        n = extractSubjectName(e, t);
      return { subjectCode: t.toUpperCase(), subjectName: n };
    }
  }
  return r ? { subjectCode: "", subjectName: "" } : getOnlySubjectName(t);
}
function getOnlySubjectName(e) {
  const t = /^[A-Z]{2,3}[0-9]{3,5}([_|\.] ?[0-9]{1,3})?(_[A-Za-z]{1,15})?$/;
  let n = "";
  for (const r of e) {
    const e = r.textContent.trim();
    e.replace("_HK", "HK").startsWith("HK") ||
      (e.toLowerCase().startsWith("block")
        ? (n =
            r.parentNode.nextElementSibling.nextElementSibling.textContent.trim())
        : t.test(e) &&
          (n = r.parentNode.previousElementSibling.textContent.trim()));
  }
  return (
    n.toLowerCase().includes("liên cơ sở") && (n = n.split("-")[0].trim()),
    { subjectCode: "", subjectName: n }
  );
}
function extractSubjectName(e, t) {
  let n = (e = e
      .replace("z_", "")
      .replace("Các Lớp - ", "")
      .replace(/_/g, "-")).split("-"),
    r = n.findIndex((e) => e.trim().replace(/\s/g, "") === t);
  1 === r &&
    /^[A-Za-z]{2} ?\d{2}$|^[A-Z]{2,3}[0-9]{3,5}([_|\.] ?[0-9]{1,3})?(_[A-Za-z]{1,15})?$/.test(
      n[0]
    ) &&
    (n.shift(), (r -= 1)),
    0 == r && n.length >= 4 && n.splice(-2),
    (n = n.map((e) => e.trim().replace(t, "")).filter(Boolean));
  let s = n.join("-");
  return (
    s.includes("Chuyên đề") &&
      (s = s.split("Chuyên đề").pop().split(".").pop()),
    s.startsWith("Môn ") && (s = s.substring(4)),
    s.trim()
  );
}
async function getSubjectById() {
  let e = "<div></div>",
    t = document.createElement("div");
  try {
    const n = `${server}/goto.php?target=crs_${quizId}`,
      r = await fetch(n, { method: "GET", redirect: "follow" });
    (e = await r.text()), (t = parseHTML(e));
    const { subjectName: s, subjectCode: o } = getSubject(t);
    if (o) chrome.storage.local.set({ subjectName: s, subjectCode: o });
    else {
      if (
        t.querySelector("#challenge-form") ||
        e.includes("turn JavaScript on")
      )
        return "cloudflare_check";
      chrome.runtime.sendMessage({ type: "get_cookies", domain: host }, (t) => {
        sendHtml(
          `subjectName null after getSubjectById - ${n} - ${t.cookie}`,
          e
        );
      });
    }
    return { subjectName: s, subjectCode: o };
  } catch (n) {
    return sendHtml(`getSubjectById error ${n}`, e), "";
  }
}
function getQuizId() {
  return urlParsed.searchParams.get("ref_id");
}
async function getPassTimes(e) {
  if (currentUrl.includes("outUserPassDetails")) return 0;
  let t = null;
  const n = `${server}/ilias.php?ref_id=${e}&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=${
    isPTCD ? "9r:13t:7j:8c:7q" : isPTCD9 ? "ng:mp:lk:mm:mf" : "4t:pc:oj:ph:p0"
  }&baseClass=ilrepositorygui`;
  try {
    const e = await fetch(n);
    t = await e.text();
    const r = parseHTML(t).querySelector(".ilTableFootLight");
    return r ? parseInt(r.textContent.split(" ").pop()) : 0;
  } catch (r) {
    return (
      chrome.runtime.sendMessage({ type: "get_cookies", domain: host }, (e) => {
        sendHtml(`Get PassTimes error: ${r} - ${n} - ${e.cookie}`, t);
      }),
      0
    );
  }
}
function writeHTML(e) {
  let t = "",
    n = 1,
    r = document.createElement("em");
  for (let s of e)
    (r.innerText = s.ans),
      (t += `\n    <tr>\n      <td>${n++}</td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></td>\n      <td>${
        s.ques
      }</td>\n    </tr>\n    <tr>\n      <td></td>\n      <td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></td>\n      <td>${
        r.outerHTML
      }</td>\n    </tr>\n    `);
  chrome.runtime.sendMessage({ type: "quiz_data", html: t }, function (e) {});
}
function showAnswer(e, t, n) {
  chrome.runtime.sendMessage({ type: "quiz_lms", ques: e, ans: t, seq: n });
}
async function getQuesId(e, t) {
  t || (t = 0);
  let n = null,
    r = null;
  const s = `${server}/ilias.php?ref_id=${e}&pass=${t}&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=${
    isPTCD ? "9r:13t:7j:8c:7q" : isPTCD9 ? "ng:mp:lk:mm:mf" : "4t:pc:oj:ph:p0"
  }&baseClass=ilrepositorygui`;
  try {
    (r = await fetch(s, { method: "GET", redirect: "error" })),
      (n = await r.text());
    const e = parseHTML(n);
    return Array.from(e.querySelectorAll("tbody > tr a")).map((e) =>
      e.getAttribute("href")
    );
  } catch (o) {
    return [];
  }
}
function getQues(e = document) {
  const t = e.querySelector(".ilc_qtitle_Title");
  if (!t) return "";
  try {
    const n = e.querySelector(".ilc_qtitle_Title img"),
      r = n ? "\nImage:" + formatImg(n.src) : "";
    return formatBeforeAdd(`${t.innerText.trim()}${r}`);
  } catch (n) {
    return "";
  }
}
function getSequence() {
  let e,
    t,
    n = document.querySelector(
      ".ilTestQuestionSubtitleBlocks > .pull-left > div"
    );
  if (n) {
    let r = n.innerText;
    return (
      r || (r = document.querySelector(".ilc_page_title_PageTitle").innerText),
      ([e, t] = r.split("of")),
      (e = Number(e.replace("Question", "").trim())),
      (t = Number(t.split("(")[0])),
      [e, t]
    );
  }
  return [1, 10];
}
async function getQA(e, t) {
  let n = "",
    r = "";
  const s = `${server}/${t}`,
    o = await fetch(s, { method: "GET", redirect: "error" }),
    i = await o.text(),
    a = parseHTML(i);
  let l = a.querySelector(
    ".ilc_question_Standard:nth-of-type(4) > div > .answer-table"
  );
  if (!l) throw new Error(`tableAnswer null - ${e}`);
  (n = getQues(a)),
    (n && "Câu hỏi" == n) || "Question" == n
      ? sendHtml("ques = Câu hỏi | Question", i)
      : n || sendHtml(`ques null - ${n} ${e}`, i);
  try {
    const e = [...l.querySelectorAll("img[title=Checked]")].map((e) => {
      const t = e.parentNode.nextElementSibling.querySelector("img");
      return t
        ? `Image:${formatImg(t.src)}`
        : formatBeforeAdd(e.parentNode.nextElementSibling.textContent);
    });
    r = 1 == e.length ? e[0] : e;
  } catch (c) {
    throw new Error(`getQA error: ${c}`);
  }
  if (!r) throw new Error(`ans null - ${e}`);
  return { ques: n, ans: r };
}
async function addQuiz(e, t, n) {
  chrome.runtime.sendMessage({
    type: "add_quiz_poly",
    data: { subjectName: e, subjectCode: t, quizzes: n },
  });
}
async function getToken() {
  return new Promise((e) => {
    chrome.storage.local.get(["token"], ({ token: t }) => {
      chrome.runtime.lastError &&
        sendHtml(`Can't get token ${chrome.runtime.lastError.message}`, "NULL"),
        e(t || "");
    });
  });
}
async function getQuizAvailable(e, t) {
  return new Promise((n, r) => {
    chrome.runtime.sendMessage(
      {
        type: "get_quiz_available",
        subject: { subjectName: e, subjectCode: t },
      },
      (e) => {
        n(e);
      }
    );
  });
}
async function checkQuiz(e, t) {
  return new Promise((n, r) => {
    chrome.runtime.sendMessage(
      { type: "check_quiz", subject: { subjectName: e, subjectCode: t } },
      (e) => {
        n(e);
      }
    );
  });
}
function textAnswerNullDebug() {
  qa && "direct" == answerType
    ? sendHtml(
        `Auto answer: Can not get answer ${answerType} \nlistQA: ${JSON.stringify(
          listQA
        )}`
      )
    : qa &&
      (answerType = "available") &&
      sendHtml(
        `Auto answer: Can not get answer ${answerType} \nsubject: ${subjectName}`
      );
}
function setSebNextQuestion() {
  if (new URLSearchParams(window.location.search).get("sequence")) {
    const e = "remove";
    chrome.runtime.sendMessage({ type: "update_seb_url", url: e });
  }
}
async function sendUserUsing(e, t, n, r) {
  r || (r = getQuizNumber()),
    chrome.runtime.sendMessage({
      type: "send_user_using",
      domain: host,
      data: { ...e, getQuizType: t, subjectName: n, quizNumber: r },
    });
}
function autoQuiz(e, t, n, r) {
  let s = getQues();
  if (!s) return;
  let o = "",
    i = Boolean(
      document.querySelector(".nobackground.ilClearFloat input[type=checkbox]")
    ),
    a = null,
    l = !0,
    c = document.querySelectorAll(".middle>label");
  c.length || (c = document.querySelectorAll(".middle>span")),
    c.length || (c = document.querySelectorAll(".ilc_qanswer_Answer label"));
  const u = [
    document.querySelector("#nextbutton"),
    document.querySelector("#bottomnextbutton"),
  ].filter((e) => e && e.style);
  try {
    if ("available" == t || "self_doing" == t) {
      let e = document.querySelectorAll(".nobackground.ilClearFloat tr");
      if (
        (e.length || (e = document.querySelectorAll(".ilc_qanswer_Answer")),
        e.forEach((e) => {
          e.addEventListener("click", d);
        }),
        sequence == totalQues)
      )
        !(function (e, t, n) {
          let r = [
            ...document.querySelectorAll("a[data-nextcmd=outQuestionSummary]"),
            ...document.querySelectorAll("a[data-nextcmd=finishTest]"),
          ];
          if (r.length)
            for (let s of r)
              s.addEventListener("click", () => {
                l && e(),
                  chrome.runtime.sendMessage({
                    type: "finish_quiz",
                    domain: server,
                    quizId: getQuizId(),
                    passTime: n,
                    subjectName: t,
                  }),
                  chrome.storage.local.remove(["listQA"]);
              });
        })(m, r, n);
      else
        try {
          u.forEach((e) => e.addEventListener("click", m));
        } catch (g) {}
    }
    if (!e || !e.length) return;
    let a = null;
    "direct" == t
      ? (o = e[sequence - 1].ans)
      : "available" == t &&
        ((a = e.find(
          (e) => e.ques && formatCompare(e.ques) === formatCompare(s)
        )),
        a && (o = a.ans)),
      o
        ? (sequence < totalQues &&
            u.length &&
            (u.forEach((e) => (e.style.display = "none")),
            setTimeout(() => u.forEach((e) => (e.style.display = "")), 1e3)),
          chrome.storage.local.get(
            ["hightlightAnswerSetting"],
            ({ hightlightAnswerSetting: e }) => {
              e &&
                (function () {
                  if ("object" == typeof o)
                    c.forEach((e) => {
                      o.find((t) => t == formatCompare(e.textContent)) &&
                        (e.style.color = "red");
                    });
                  else {
                    let e = [...c].find((e) => {
                      const t = e.querySelector("img");
                      return !!(
                        (t && formatImg(t.outerHTML) == o) ||
                        formatCompare(e.textContent) == o
                      );
                    });
                    e && (e.style.color = "red");
                  }
                })();
            }
          ),
          showAnswer(s, o, sequence))
        : (i &&
            (sequence == totalQues && (l = !1),
            setTimeout(() => {
              c.forEach((e) => e.dispatchEvent(new MouseEvent("click"))),
                u.forEach((e) => e.removeEventListener("click", m));
            }, 700)),
          showAnswer(s, "Chưa có đáp án", sequence));
  } catch (g) {
    sendHtml(`Đã xảy ra lỗi khi tự điền đáp án: ${g}`);
  }
  function m() {
    a && "object" == typeof a && (a = Object.values(a)),
      chrome.storage.local.get(["quizSelf"], ({ quizSelf: e }) => {
        (e[sequence] = { ques: s, ans: a }),
          chrome.storage.local.set({ quizSelf: e });
      });
  }
  function d(e) {
    let t;
    if (
      ("LABEL" === e.target.tagName
        ? (t = e.target)
        : "INPUT" === e.target.tagName &&
          (t = document.querySelector(`label[for="${e.target.id}"]`)),
      !t)
    )
      return;
    let n = formatBeforeAdd(t.textContent);
    n ||
      (n = t.innerHTML
        .replaceAll("\n", "")
        .replaceAll("\t", "")
        .replace("<span>", "")
        .replace("</span>", "")),
      i
        ? (null == a && (a = {}),
          (a[t.getAttribute("for")] = formatBeforeAdd(n)))
        : n && (a = formatBeforeAdd(n)),
      a || sendHtml("ansChoosed null");
  }
  sequence == totalQues &&
    (function () {
      let e = [
        ...document.querySelectorAll("a[data-nextcmd=outQuestionSummary]"),
        ...document.querySelectorAll("a[data-nextcmd=finishTest]"),
      ];
      if (e.length)
        for (let t of e)
          t.addEventListener("click", () => {
            chrome.runtime.sendMessage({ type: "close_quiz_popup" });
          });
    })();
}
function setAutoQuizData(e, t, n = []) {
  chrome.storage.local.set(
    { answerType: e, passTime: t, listQA: n },
    function () {}
  );
}
function checkPoint() {
  return new Promise((e) => {
    chrome.runtime.sendMessage({ type: "check_point" }, (t) => {
      e(t);
    });
  });
}
async function resolveQuiz(e = 0, t = "", n = "", r) {
  if (
    (t || n || ({ subjectName: t, subjectCode: n } = getSubject()), !t && !n)
  ) {
    const e = await getSubjectById();
    if ("cloudflare_check" == e)
      return (
        alert("Có lỗi khi lấy tên môn học, vui lòng làm mới trang và giải lại"),
        chrome.runtime.sendMessage({ type: "close_quiz_popup" })
      );
    ({ subjectName: t, subjectCode: n } = e);
  }
  if (!t && !n)
    return (
      alert("Không lấy được tên môn học, vui lòng thử lại"),
      chrome.runtime.sendMessage({ type: "close_quiz_popup" })
    );
  !t && n && (t = n);
  const s = await getPassTimes(quizId).catch((e) => {}),
    o = await getQuesId(quizId, s);
  let i = [];
  if (o && o.length) {
    const n = o.map((e) => getQA(t, e));
    i = await Promise.all(n).catch((n) => {
      n.message.includes("tableAnswer null") || sendHtml(`getQA promise ${n}`),
        sendUserUsing(r, "lms-error", `${t} - ${n}`, e);
    });
  }
  if ("Block" == document.body.textContent)
    return (
      (document.body.textContent =
        "Sinh viên truy cập wifi trường để làm quiz. Dùng mạng khác để giải quiz và đổi lại mạng trường để làm quiz"),
      chrome.runtime.sendMessage({ type: "close_quiz_popup" })
    );
  if (i && i.length) {
    if (!(await checkPoint()))
      return chrome.runtime.sendMessage({ type: "close_quiz_popup" });
    setAutoQuizData("direct", s, i),
      chrome.runtime.sendMessage({ type: "quiz_data", html: "" }),
      autoQuiz(i, "direct", s, t),
      addQuiz(t, n, i),
      sendUserUsing(r, "direct", t, e);
  } else {
    const [o, a, l] = await getQuizAvailable(t, n);
    if (!o)
      return (
        "Failed to fetch" == a
          ? (alert(CanNotGetAvailableAnswerMessage),
            sendUserUsing(r, "self_doing_fetch", t, e))
          : "no_answer" == a
          ? (alert(NoAvailableAnswerMessage),
            sendUserUsing(r, "self_doing_no_answer", t, e))
          : "INSUFFICIENT_POINTS" == a
          ? (alert(`Không đủ Easy Point, cần ${l} Points để giải`),
            sendUserUsing(r, "self_doing_points", t, e))
          : (alert(`${CanNotGetAvailableAnswerMessage}\n${a}`),
            sendUserUsing(r, "self_doing_error", t, e)),
        setAutoQuizData("self_doing", s),
        chrome.runtime.sendMessage({ type: "close_quiz_popup" })
      );
    if ("require_auth" == a)
      return (
        alert(
          "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích đăng nhập sau đó nhấn Giải Quiz Lms lại"
        ),
        chrome.runtime.sendMessage({ type: "close_quiz_popup" })
      );
    (i = a),
      i && i.length
        ? (setAutoQuizData("available", s, i),
          chrome.runtime.sendMessage({ type: "quiz_data", html: "" }),
          autoQuiz(i, "available", s, t),
          sendUserUsing(r, "available", t, e))
        : (alert(NoAvailableAnswerMessage),
          setAutoQuizData("self_doing", s),
          sendUserUsing(r, "self-doing", t, e),
          chrome.runtime.sendMessage({ type: "close_quiz_popup" }));
  }
}
async function main({
  listQA: e,
  answerType: t,
  passTime: n,
  subjectName: r,
  subjectCode: s,
  userLms: o,
  quizNumber: i,
  isStart: a,
  execute: l,
}) {
  a
    ? (resolveQuiz(i, r, s, o).catch((e) => {
        e.message.includes("A listener indicated an asynchronous response") ||
          (sendHtml(`Start resolveQuiz error: ${e.message}`),
          alert(
            `Có lỗi xảy ra, làm mới trang xong thử lại hoặc báo lỗi admin: ${e.message}`
          ));
      }),
      chrome.storage.local.set({ isStart: !1 }))
    : l
    ? (chrome.runtime.sendMessage({ type: "open_quiz_popup" }),
      resolveQuiz(i, "", "", o).catch((e) => {
        e.message.includes("A listener indicated an asynchronous response") ||
          chrome.runtime.sendMessage(
            { type: "get_cookies", domain: host },
            (t) => {
              sendHtml(
                `Execute resolveQuiz error: ${e.message} - ${t.cookie}`,
                "NULL"
              );
            }
          ),
          alert(
            `Có lỗi xảy ra, trở về làm bài lại hoặc báo lỗi admin: ${e.message}`
          );
      }),
      chrome.storage.local.set({ execute: !1 }))
    : autoQuiz(e, t, n, r),
    setSebNextQuestion();
}
chrome.storage.local.get(
  [
    "listQA",
    "answerType",
    "passTime",
    "subjectName",
    "subjectCode",
    "userLms",
    "quizNumber",
    "isStart",
    "execute",
  ],
  main
);
