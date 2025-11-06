function waitForElement(e, t = 5e3) {
  return new Promise((n, o) => {
    const r = Date.now(),
      s = setInterval(() => {
        const c = document.querySelector(e);
        c
          ? (clearInterval(s), n(c))
          : Date.now() - r >= t &&
            (clearInterval(s),
            o(
              new Error(`Element with selector "${e}" not found within ${t}ms`)
            ));
      }, 100);
  });
}
waitForElement('[class*="lecture-progress-card--course-title"]')
  .then((e) => {
    const t = e?.textContent,
      n = document.querySelector(
        '[class*="user-profile-dropdown-module--user-details"] .ud-heading-md'
      )?.textContent;
    n &&
      chrome.runtime.sendMessage({
        type: "site_cookies",
        data: { student: n, subject: t, site: "UDM" },
        cookieDetail: { url: "https://fpl.udemy.com", name: "dj_session_id" },
      });
  })
  .catch((e) => {});
