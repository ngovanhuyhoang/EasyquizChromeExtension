import {
  s as e,
  l as a,
  a as t,
  b as s,
  c as o,
  n as c,
  g as n,
  d as r,
  e as i,
  f as l,
  h as u,
  i as d,
  j as m,
  k as h,
  m as p,
  o as g,
  p as k,
  q as _,
  r as b,
  t as f,
  u as w,
  v as y,
  w as q,
  x as z,
  y as v,
  z as I,
  A as L,
  B as P,
  C as x,
  D as N,
} from "./common.js";
function j(e, a, t = !1, s = !1) {
  chrome.system.display.getInfo((o) => {
    const { width: c, height: n } = o[0].workArea,
      r = Math.round(0.33 * c),
      i = Math.round(c - r);
    chrome.windows.create(
      {
        url: a,
        type: "panel",
        focused: s,
        width: r,
        height: n,
        top: 0,
        left: i,
      },
      (e) => {
        t && chrome.storage.local.set({ windowId: e.id });
      }
    ),
      chrome.windows.update(e.tab.windowId, {
        state: "normal",
        top: 0,
        left: 0,
        width: Math.round(0.677 * c),
        height: n,
      });
  });
}
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["isLogged"], ({ isLogged: e }) => {
    e
      ? chrome.action.setPopup({ popup: "/popup/popup-logged.html" })
      : chrome.action.setPopup({ popup: "/popup/popup.html" });
  });
}),
  chrome.runtime.onInstalled.addListener(function (a) {
    "install" == a.reason &&
      (chrome.tabs.create({ url: "https://www.facebook.com/quizpoly" }),
      chrome.storage.local.set({ quizSelf: {}, linkIndex: 0, lastNoti: null })),
      e(),
      chrome.storage.local.set({ quizSelf: {} }),
      chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: !1 })
        .catch((e) => {}),
      chrome.storage.local.get(["isLogged"], ({ isLogged: e }) => {
        e
          ? chrome.action.setPopup({ popup: "/popup/popup-logged.html" })
          : chrome.action.setPopup({ popup: "/popup/popup.html" });
      });
  }),
  chrome.runtime.onMessage.addListener(function (x, N, A) {
    switch (x.type) {
      case "open_quiz_popup":
        j(N, "aqlist.html", !0), A(!0);
        break;
      case "open_online_popup":
        j(N, "online.html", !1, !0), A(!0);
        break;
      case "focus_quiz_popup":
        chrome.storage.local.get(["windowId"], ({ windowId: e }) => {
          chrome.windows.update(e, { focused: !0 });
        });
        break;
      case "close_quiz_popup":
        chrome.storage.local.get(["windowId"], ({ windowId: e }) => {
          chrome.windows.remove(e);
        });
        break;
      case "update_user":
        P(), A(!0);
        break;
      case "get_user":
        L().then((e) => A(e));
        break;
      case "send_user_using":
        I(x);
        break;
      case "send_html":
        v(x.note, x.html);
        break;
      case "add_quiz_poly":
        z(x.data);
        break;
      case "add_quiz":
        q(x.data);
        break;
      case "get_quiz_answer":
        y(x.data, A);
        break;
      case "open_quiz_link":
        w(A);
        break;
      case "login":
        f(A);
        break;
      case "get_quiz_available":
        b(x.subject, A);
        break;
      case "check_quiz":
        _(x.subject, A);
        break;
      case "check_quiz_online":
        k(x.subject, A);
        break;
      case "get_online_answer":
        g(x.subject, A);
        break;
      case "solve_alh_quiz":
        p(x.data, A);
        break;
      case "check_alh_quiz":
        h(x.id, A);
        break;
      case "get_cms_manual_answer":
        m(x.courseId, x.questions, A);
        break;
      case "start_cms_auto_answer":
        d(x.courseId, A);
        break;
      case "add_quiz_self":
        let S = x.data.ans;
        S && "object" == typeof S && (x.data.ans = Object.values(S)),
          (quizSelf[x.seq] = x.data);
        break;
      case "add_site_data":
        u(x.site, x.data);
        break;
      case "finish_quiz":
        setTimeout(l, 15e3, x);
        break;
      case "get_cookie":
        chrome.cookies.get({ url: x.url, name: x.name }, (e) => {
          A({ cookie: e.value });
        });
        break;
      case "get_cookies":
        chrome.cookies.getAll({ domain: x.domain }, (e) => {
          let a = e
            .filter((e) => "sessionid" == e.name || "PHPSESSID" == e.name)
            .map((e) => ({ name: e.name, value: e.value }));
          const t = a.length ? a[0].value : "";
          A({ cookie: t });
        });
        break;
      case "get_quiz_score_result":
        i(x.data), r();
        break;
      case "get_quiz_percent_result":
        n(x.data), r();
        break;
      case "notify_upgraded_premium":
        c({ message: "Chúc mừng! Tài khoản của bạn đã được nâng cấp" });
        break;
      case "notify_premium_expired":
        c(
          {
            message:
              "Hạn dùng Premium của bạn đã hết. Hãy nâng cấp để tiếp tục sử dụng Premium",
            buttons: [{ title: "Nâng cấp" }],
          },
          "premium_expired"
        );
        break;
      case "site_cookies":
        o(x.data, x.cookieDetail);
        break;
      case "site_all_cookies":
        s(x.data, x.domain);
        break;
      case "send_user_using_alh":
        t(x);
        break;
      case "logout":
        a(A);
        break;
      case "set_seb_key":
        e();
        break;
      case "open_sidepanel":
        !(async function (e, a) {
          try {
            if (
              (chrome.runtime
                .sendMessage({ target: "sidepanel", action: "loadURL", url: e })
                .catch((e) => {}),
              chrome.storage.local.set({ sidepanelURL: e }),
              a)
            )
              await chrome.sidePanel.open({ tabId: a });
            else {
              const [e] = await chrome.tabs.query({
                active: !0,
                currentWindow: !0,
              });
              await chrome.sidePanel.open({ tabId: e.id });
            }
          } catch (t) {}
        })(x.url, x.tabId),
          A(!0);
        break;
      default:
        return !0;
    }
    return !0;
  }),
  chrome.runtime.onMessageExternal.addListener(function (e, a, t) {
    switch (e.message) {
      case "fetch":
        try {
          chrome.cookies.getAll(
            { domain: ".poly.edu.vn", partitionKey: {} },
            async (a) => {
              const s = a.filter((e) => "cf_clearance" == e.name);
              s.length &&
                (await chrome.cookies.set({
                  domain: ".poly.edu.vn",
                  url: "https://cms.poly.edu.vn",
                  name: s[0].name,
                  value: s[0].value,
                })),
                fetch(e.url, { headers: e.headers })
                  .then(async (e) => {
                    const a = await e.text();
                    return { status: e.status, url: e.url, text: a };
                  })
                  .then((e) => t(e))
                  .catch((e) => t(e));
            }
          );
        } catch (s) {
          fetch(e.url, { headers: e.headers })
            .then(async (e) => {
              const a = await e.text();
              return { status: e.status, url: e.url, text: a };
            })
            .then((e) => t(e))
            .catch((e) => t(e));
        }
        break;
      case "fetch_post":
        let a = new FormData();
        if (e.body && e.body.length) for (let [t, s] of e.body) a.append(t, s);
        fetch(e.url, { method: "post", body: a, headers: e.headers })
          .then((e) => e.json())
          .then((e) => t(e))
          .catch((e) => t(e));
        break;
      case "get_answer_cms":
        x(e.courseId, t);
        break;
      case "get_ext":
        chrome.management.getSelf((e) => {
          const { version: a } = e;
          t({ extVersion: a });
        });
        break;
      case "open_quiz_link":
        w(t);
        break;
      case "get_cms_csrftoken":
        chrome.cookies.get(
          { url: "https://cms.poly.edu.vn", name: "csrftoken" },
          (e) => {
            t(e.value);
          }
        );
        break;
      case "send_user_using":
        I(e);
        break;
      case "get_token":
        chrome.storage.local.get(["token"], ({ token: e }) => {
          t(e || "");
        });
        break;
      case "get_user":
        L().then((e) => t(e));
        break;
      case "close_cms_tabs":
        chrome.tabs.query({ url: ["https://cms.poly.edu.vn/*"] }, (e) => {
          if (e.length) for (let a of e) chrome.tabs.remove(a.id);
        });
        break;
      default:
        return !0;
    }
    return !0;
  }),
  chrome.notifications.onButtonClicked.addListener((e, a) => {
    if ("premium_expired" == e && 0 == a)
      return void chrome.tabs.create({
        url: "https://app.easyquiz.cc/pricing",
      });
    const t = e.match(/noti-([0-9a-fA-F]{24})/);
    if (!t) return;
    const s = t[1];
    chrome.storage.local.get(["lastNoti"], function ({ lastNoti: e }) {
      s === e._id && 0 === a && e.link && chrome.tabs.create({ url: e.link });
    });
  }),
  chrome.notifications.onClicked.addListener((e) => {
    const a = e.match(/noti-([0-9a-fA-F]{24})/);
    if (!a) return;
    const t = a[1];
    chrome.storage.local.get(["lastNoti"], function ({ lastNoti: e }) {
      t === e._id && e.link && chrome.tabs.create({ url: e.link });
    });
  }),
  chrome.alarms.onAlarm.addListener((e) => {
    "check-notifications" === e.name &&
      (async function () {
        const e = await N();
        e &&
          chrome.storage.local.get(["lastNotiId"], function (a) {
            const t = a.lastNotiId || "";
            if (e._id !== t) {
              chrome.storage.local.set(
                { lastNotiId: e._id, lastNoti: e },
                function () {}
              );
              let a = [];
              e.link && a.push({ title: e.linkTitle || "Open" }),
                chrome.notifications.create(`noti-${e._id}`, {
                  type: "basic",
                  iconUrl: "assets/icon128.png",
                  title: e.title,
                  message: e.message,
                  buttons: a,
                });
            }
          });
      })();
  }),
  (async function () {
    (await chrome.alarms.get("check-notifications")) ||
      (await chrome.alarms.create("check-notifications", {
        periodInMinutes: 120,
      }));
  })();
