function getSubjectCode(e = document) {
  const t = e.querySelectorAll(".breadcrumb a");
  for (let r = 0; r < t.length; r++) {
    const e = /\b[A-Z]{3} {0,1}\d{3,4}/,
      n = t[r].textContent.trim();
    if (n.startsWith("HK")) continue;
    const a = n.match(e);
    if (a) return a[0].replace(" ", "");
  }
}
function getSubject(e = document) {
  const t = e.querySelectorAll(".breadcrumb a"),
    r = /\b[A-Za-z]{3}\s?\d{3,4}/;
  let n = null;
  if (0 === t.length) return { subjectCode: "", subjectName: "" };
  for (const a of t) {
    const e = a.textContent.trim();
    if (
      !e.replace("_HK", "HK").startsWith("HK") &&
      ((n = e.replace(/_/g, "-").match(r)), n)
    ) {
      const t = n[0].replace(" ", ""),
        r = extractSubjectName(e, t);
      return { subjectCode: t.toUpperCase(), subjectName: r };
    }
  }
  return n ? { subjectCode: "", subjectName: "" } : getOnlySubjectName(t);
}
function getOnlySubjectName(e) {
  const t = /^[A-Z]{2,3}[0-9]{3,5}([_|\.] ?[0-9]{1,3})?(_[A-Za-z]{1,15})?$/;
  let r = "";
  for (const n of e) {
    const e = n.textContent.trim();
    e.replace("_HK", "HK").startsWith("HK") ||
      (e.toLowerCase().startsWith("block")
        ? (r =
            n.parentNode.nextElementSibling.nextElementSibling.textContent.trim())
        : t.test(e) &&
          (r = n.parentNode.previousElementSibling.textContent.trim()));
  }
  return (
    r.toLowerCase().includes("liên cơ sở") && (r = r.split("-")[0].trim()),
    { subjectCode: "", subjectName: r }
  );
}
function extractSubjectName(e, t) {
  let r = (e = e
      .replace("z_", "")
      .replace("Các Lớp - ", "")
      .replace(/_/g, "-")).split("-"),
    n = r.findIndex((e) => e.trim().replace(/\s/g, "") === t);
  1 === n &&
    /^[A-Za-z]{2} ?\d{2}$|^[A-Z]{2,3}[0-9]{3,5}([_|\.] ?[0-9]{1,3})?(_[A-Za-z]{1,15})?$/.test(
      r[0]
    ) &&
    (r.shift(), (n -= 1)),
    0 == n && r.length >= 4 && r.splice(-2),
    (r = r.map((e) => e.trim().replace(t, "")).filter(Boolean));
  let a = r.join("-");
  return (
    a.includes("Chuyên đề") &&
      (a = a.split("Chuyên đề").pop().split(".").pop()),
    a.startsWith("Môn ") && (a = a.substring(4)),
    a.trim()
  );
}
async function getQuesId(e) {
  try {
    (response = await fetch(e, { method: "GET", redirect: "error" })),
      (htmlData = await response.text());
    const t = parseHTML(htmlData);
    return Array.from(t.querySelectorAll("tbody > tr a")).map((e) =>
      e.getAttribute("href")
    );
  } catch (t) {
    return [];
  }
}
function formatImg(e) {
  return e.replace(/(style=".*?"|\?il_wac_token=.*?")/g, "");
}
async function getQA(e, t) {
  let r = "",
    n = "";
  const a = `${server}/${t}`,
    c = await fetch(a, { method: "GET", redirect: "error" }),
    o = await c.text(),
    i = parseHTML(o);
  let l = i.querySelector(
    ".ilc_question_Standard:nth-of-type(4) > div > .answer-table"
  );
  if (!l) throw new Error(`tableAnswer null - ${e}`);
  (r = getQues(i)),
    (r && "Câu hỏi" == r) || "Question" == r
      ? sendHtml("ques = Câu hỏi | Question", o)
      : r || sendHtml(`ques null - ${r} ${e}`, o);
  try {
    const e = [...l.querySelectorAll("img[title=Checked]")].map((e) => {
      const t = e.parentNode.nextElementSibling.querySelector("img");
      return t
        ? formatImg(t.outerHTML)
        : formatBeforeAdd(e.parentNode.nextElementSibling.textContent);
    });
    n = 1 == e.length ? e[0] : e;
  } catch (s) {
    throw new Error(`getQA error: ${s}`);
  }
  if (!n) throw new Error(`ans null - ${e}`);
  return { ques: r, ans: n };
}
function capitalizeFirstLetter(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
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
function formatBeforeAdd(e) {
  return normalizeText(e);
}
function getQues(e = document) {
  const t = e.querySelector(".ilc_qtitle_Title");
  if (!t) return "";
  try {
    const r = e.querySelector(".ilc_qtitle_Title img"),
      n = r ? "\nImage:" + formatImg(r.src) : "";
    return formatBeforeAdd(`${t.innerText.trim()}${n}`);
  } catch (r) {
    return "";
  }
}
async function addQuiz(e, t, r) {
  chrome.runtime.sendMessage({
    type: "add_quiz_poly",
    data: { subjectName: e, subjectCode: t, quizzes: r },
  });
}
function getQuizId() {
  return urlParsed.searchParams.get("ref_id");
}
function parseHTML(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
async function main() {
  if (!document.querySelector(".alert")) return;
  const { subjectName: e, subjectCode: t } = getSubject();
  if (!e && !t) return;
  const r = document.querySelector(
    ".ilTableOuter table > tbody > tr:last-child > td:last-child > a"
  );
  if (!r) return;
  const n = window.location.origin + "/" + r.getAttribute("href"),
    a = await getQuesId(n);
  let c = [];
  if (a && a.length) {
    const t = a.map((t) => getQA(e, t));
    c = await Promise.all(t).catch((e) => {});
  }
  c && c.length && addQuiz(e, t, c);
}
main();
