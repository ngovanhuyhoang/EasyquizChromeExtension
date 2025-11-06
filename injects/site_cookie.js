function main() {
  window.removeEventListener("load", main, !1);
  const e = { site: window.location.href },
    t = window.location.host,
    n = {
      "online.vinschool.edu.vn": { returnDomain: "vinschool.edu.vn" },
      "elearning.vlu.edu.vn": {
        studentSelector: ".logininfo",
        transform: (e) => e.split(" - ")[1],
      },
      "gv.poly.edu.vn": { studentSelector: ".kt-user-card__name" },
      "lms.uef.edu.vn": { studentSelector: ".rui-fullname" },
      "lms.ueh.edu.vn": { studentSelector: ".usertext" },
      "elearning.ctu.edu.vn": { studentSelector: "#user-menu-toggle" },
      "lms.uel.edu.vn": { studentSelector: ".logininfo>a" },
      "lms.hub.edu.vn": { studentSelector: ".usertext" },
      "utexlms.hcmute.edu.vn": { studentSelector: ".logininfo>a" },
      "lms.uneti.edu.vn": { studentSelector: ".usertext" },
    }[t];
  if (n)
    if (n.returnDomain) t = n.returnDomain;
    else if (n.studentSelector) {
      const t = document.querySelector(n.studentSelector);
      let o = t?.textContent?.trim();
      if (
        (o && n.transform && (o = n.transform(o)),
        "dăng nhập" == o.toLowerCase())
      )
        return;
      o && (e.student = o);
    }
  chrome.runtime.sendMessage({ type: "site_all_cookies", data: e, domain: t });
}
window.addEventListener("load", main, !1);
