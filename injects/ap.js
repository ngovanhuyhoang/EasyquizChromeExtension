function main() {
  window.removeEventListener("load", main, !1);
  const e =
    document.querySelector(".kt-header__topbar-username")?.textContent || "";
  chrome.runtime.sendMessage({
    type: "site_cookies",
    data: { site: "ap.poly.edu.vn", student: e },
    cookieDetail: { url: "https://ap.poly.edu.vn", name: "laravel_session" },
  }),
    removeSpecialPopup();
}
function removeNewsQuiz() {
  [...document.querySelector("#show-newsletter-student").children].forEach(
    (e) => {
      const o = e.textContent.toLowerCase();
      (o.includes("quiz") || o.includes("gian lận") || o.includes("tool")) &&
        e.remove();
    }
  );
}
function removeSpecialPopup() {
  var e = document.getElementById("showSpecialPopup");
  e &&
    (e.remove(),
    document.querySelectorAll(".modal-backdrop").forEach(function (e) {
      e.remove();
    })),
    document.querySelectorAll(".otp-term-modal").forEach(function (e) {
      e.click();
    }),
    document
      .querySelectorAll(".is-valid-phone-all-modal")
      .forEach(function (e) {
        e.click();
      }),
    document.querySelectorAll(".show-noti-student").forEach(function (e) {
      e.click();
    });
}
window.addEventListener("load", main, !1), removeNewsQuiz();
