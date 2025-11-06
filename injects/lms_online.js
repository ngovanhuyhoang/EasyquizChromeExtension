var subjectEl = document.querySelector(".ilc_rte_tlink_RTETreeLink"),
  subject = subjectEl ? subjectEl.textContent.replace(/\?/g, "") : "",
  server = window.location.origin;
async function main() {
  if (!subject)
    return void alert("Không lấy được bài học, làm mới trang và thử lại");
  let [e, n, t] = await getOnlineAnswer(subject);
  const s = await getUserInfo();
  if (e)
    if ("require_auth" != n)
      if (n && n.length)
        chrome.runtime.sendMessage({ type: "open_quiz_popup" }, async () => {
          chrome.storage.local.set({ subjectName_: subject }),
            writeHTML(n),
            sendUserUsing(s, "lms-online", subject);
        });
      else {
        confirm(
          "Bài này chưa có đáp án, bạn có muốn đóng góp đáp án cho người làm sau?"
        ) &&
          chrome.runtime.sendMessage({ type: "open_online_popup" }, () => {
            chrome.storage.local.set({ subjectName_: subject }),
              setTimeout(
                () =>
                  chrome.runtime.sendMessage({
                    type: "online_data",
                    subject: subject,
                    studentCode: s.studentCode,
                  }),
                1e3
              );
          });
      }
    else
      alert(
        "Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích sau đó đăng nhập và làm mới trang lại"
      );
  else if ("no_answer" == n) {
    confirm(
      "Bài này chưa có đáp án, bạn có muốn đóng góp đáp án cho người làm sau?"
    ) &&
      chrome.runtime.sendMessage({ type: "open_online_popup" }, () => {
        chrome.storage.local.set({ subjectName_: subject }),
          setTimeout(
            () =>
              chrome.runtime.sendMessage({
                type: "online_data",
                subject: subject,
                studentCode: s.studentCode,
              }),
            1e3
          );
      }),
      sendUserUsing(s, "self_doing_no_answer", subject);
  } else
    "INSUFFICIENT_POINTS" == n
      ? (alert(`Không đủ Easy Point, cần ${t} Points để giải`),
        sendUserUsing(s, "self_doing_points", subject))
      : (alert(
          `Không lấy được đáp án, nếu wifi trường chặn đổi qua mạng khác và làm lại\n${n}`
        ),
        sendUserUsing(s, "self_doing_error", subject));
}
function writeHTML(e) {
  let n = "",
    t = 1,
    s = document.createElement("span"),
    r = document.createElement("em");
  for (let i of e)
    (s.innerText = i.ques),
      (r.innerText = i.ans),
      (n += `\n    <tr><td style='width:2.5rem; text-align:center';>${t++}</td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></td><td>${
        s.outerHTML
      }</td></tr>\n    <tr><td></td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></td><td>${
        r.outerHTML
      }</td></tr>\n    `);
  setTimeout(
    () =>
      chrome.runtime.sendMessage({ type: "quiz_data", html: n, online: !0 }),
    1e3
  );
}
function parseHTML(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
async function sendUserUsing(e, n, t) {
  chrome.runtime.sendMessage({
    type: "send_user_using",
    domain: window.location.host,
    data: { ...e, getQuizType: n, subjectName: t },
  });
}
async function getOnlineAnswer(e) {
  return new Promise((n, t) => {
    chrome.runtime.sendMessage(
      { type: "get_online_answer", subject: e },
      (e) => {
        if (chrome.runtime.lastError) return t("send_message_error");
        n(e);
      }
    );
  });
}
async function getUserInfo() {
  let e = "NULL",
    n = "NULL",
    t = server;
  const s = window.location.host,
    r = `${server}/ilias.php?baseClass=${
      "lms-ptcd.poly.edu.vn" == s ? "ilPersonalDesktopGUI" : "ilDashboardGUI"
    }&cmd=jumpToProfile`;
  let i = "<div></div>";
  try {
    const o = await fetch(r, { method: "GET", redirect: "follow" });
    if (!o.ok) return { name: e, studentCode: n, userServer: t };
    i = await o.text();
    const c = parseHTML(i);
    (e = c.querySelector("#usr_firstname").value),
      (n = c.querySelector("#hiddenne_un").value),
      (t = c.querySelector("#hiddenne_dr")?.value?.replace("USER_", "")),
      "lms-ptcd.poly.edu.vn" == s && t && (t = "PTCD " + t);
  } catch (o) {}
  return { name: e, studentCode: n, userServer: t };
}
main();
