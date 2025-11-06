var server = window.location.origin,
  currentUrl = window.location.href,
  version = chrome.runtime.getManifest().version,
  host = window.location.host;
async function sendHtml(e, t) {
  t || (t = document.body.innerHTML.replace(/\n/g, "").replace(/\t/g, "")),
    chrome.runtime.sendMessage({ type: "send_html", note: e, html: t });
}
function getSubject(e = document) {
  const t = e.querySelectorAll(".breadcrumb a"),
    n = /\b[A-Za-z]{3}\s?\d{3,4}/;
  let r = null;
  if (0 === t.length) return { subjectCode: "", subjectName: "" };
  for (const o of t) {
    const e = o.textContent.trim();
    if (
      !e.replace("_HK", "HK").startsWith("HK") &&
      ((r = e.replace(/_/g, "-").match(n)), r)
    ) {
      const t = r[0].trim().replace(" ", ""),
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
  let o = n.join("-");
  return (
    o.includes("Chuyên đề") &&
      (o = o.split("Chuyên đề").pop().split(".").pop()),
    o.startsWith("Môn ") && (o = o.substring(4)),
    o.trim()
  );
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
function parseHTML(e) {
  const t = document.createElement("div");
  return (t.innerHTML = e), t;
}
async function getUserInfo() {
  const e = window.location.origin,
    t = "lms-ptcd.poly.edu.vn" === host || "lms9.poly.edu.vn" === host,
    n = "fpl4.poly.edu.vn" === host;
  let r = "NULL",
    o = "NULL",
    s = e;
  const c = `${e}/ilias.php?cmdClass=ilpersonalprofilegui&cmdNode=${
    t ? "vh:n6" : "cl:7"
  }&baseClass=${t ? "ilPersonalDesktopGUI" : "ilDashboardGUI"}`;
  let i = "<div></div>";
  try {
    const e = await fetch(c, { method: "GET" });
    if (!e.ok) return { name: r, studentCode: o, userServer: s };
    i = await e.text();
    const u = parseHTML(i);
    (r = u.querySelector("#usr_firstname").value),
      (o = u.querySelector("#hiddenne_un").value),
      (s = u
        .querySelector("#hiddenne_dr")
        ?.value?.replace("USER_", "")
        .replace("User, ", "")),
      s && (t ? (s = "PTCD " + s) : n && (s = "Orit " + s));
  } catch (u) {
    [
      "an error occurred",
      "Too many connections",
      "turn JavaScript on",
      "Login to ILIAS",
    ].some((e) => i.includes(e)) ||
      chrome.runtime.sendMessage({ type: "get_cookies", domain: host }, (e) => {
        sendHtml(`getUserInfo error: ${u} - ${c} - ${e.cookie}`, i);
      });
  }
  return { name: r, studentCode: o, userServer: s };
}
async function main(
  { quizNumber: e, subjectName: t, subjectCode: n, userLms: r },
  o
) {
  chrome.runtime.sendMessage({ type: "open_quiz_popup" }),
    chrome.storage.local.remove("listQA"),
    chrome.storage.local.set(
      {
        subjectName: t,
        subjectCode: n,
        quizNumber: e,
        userLms: r,
        isStart: !0,
      },
      () => {
        o();
      }
    );
}
function setSebUrlFormSubmit(e) {
  const t = document.getElementById("ilToolbar")?.getAttribute("action"),
    n = window.location.origin + "/" + t;
  chrome.runtime.sendMessage({ type: "update_seb_url", url: n }, () => {
    e();
  });
}
function setSebUrlStartTest() {
  const e = new URLSearchParams(window.location.search).get("ref_id"),
    t = `${window.location.origin}/ilias.php?ref_id=${e}&sequence=0&cmd=startTest&cmdClass=iltestplayerfixedquestionsetgui&cmdNode=4t:pc:op&baseClass=ilrepositorygui`;
  chrome.runtime.sendMessage({ type: "update_seb_url", url: t }, () => {
    window.location.href = t;
  });
}
(async () => {
  const e = document.querySelector(".navbar-form > input");
  if (e) {
    const { subjectName: t, subjectCode: n } = getSubject();
    if (!t && !n) return;
    const r = getQuizNumber(),
      o = await getUserInfo().catch((e) => {});
    e.setAttribute("type", "button");
    const s = e.cloneNode(!0);
    s.setAttribute("type", "submit"),
      s.setAttribute("style", "display:none"),
      s.setAttribute("type", "submit"),
      document.querySelector(".navbar-form").appendChild(s),
      e.addEventListener("click", () => {
        e.setAttribute("disabled", ""),
          main(
            { quizNumber: r, subjectName: t, subjectCode: n, userLms: o },
            () => {
              s.dispatchEvent(new MouseEvent("click"));
            }
          );
      });
  }
})();
