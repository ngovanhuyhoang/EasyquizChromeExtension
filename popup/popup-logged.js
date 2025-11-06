function e() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, async (e) => {
    chrome.runtime.sendMessage(
      {
        type: "open_sidepanel",
        url: "https://cms.quizpoly.xyz",
        tabId: e[0].id,
      },
      () => {
        window.close();
      }
    );
  });
}
function t() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, async (e) => {
    chrome.runtime.sendMessage(
      {
        type: "open_sidepanel",
        url: "https://app.easyquiz.cc/chat",
        tabId: e[0].id,
      },
      () => {
        window.close();
      }
    );
  });
}
function n(e) {
  const t = e.target.checked;
  chrome.storage.local.set({ hightlightAnswerSetting: t });
}
function s() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, async (e) => {
    const t = e[0].url;
    if (t.includes("&sequence="))
      chrome.storage.local.set({ execute: !0 }, () => {
        chrome.scripting.executeScript({
          target: { tabId: e[0].id },
          files: ["injects/lms_script.js"],
        }),
          window.close();
      });
    else if (t.toLowerCase().includes("ilsahspresentationgui"))
      chrome.scripting.executeScript({
        target: { tabId: e[0].id },
        files: ["injects/lms_online.js"],
      }),
        window.close();
    else {
      (document.getElementById(
        "message"
      ).innerHTML = `\n        <div class="flex flex-col gap-2">\n          \x3c!-- School Support Info --\x3e\n          <div class="text-blue-400 text-sm">\n            <a href="https://app.easyquiz.cc/extension-support" target="_blank">➡ Xem danh sách các trường hỗ trợ tại đây</a>\n          </div>\n\n          \x3c!-- Instructions --\x3e\n          <div class="text-green-400 text-sm">\n            Truy cập lms trường làm quiz để giải đáp án\n          </div>\n\n          \x3c!-- Action Links --\x3e\n          <div class="flex flex-col gap-2">\n            <a class="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors" \n              href="https://quizpoly.xyz/huong-dan-lms" \n              target="_blank">\n              <span>📖</span> Xem video hướng dẫn giải quiz FPOLY\n            </a>\n            <a class="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors" \n              href="https://quizpoly.xyz/online.html" \n              target="_blank">\n              <span>📝</span> Xem danh sách bài online FPOLY\n            </a>\n          </div>\n\n          \x3c!-- Settings --\x3e\n          <label class="inline-flex items-center gap-2 text-sm text-gray-300 mt-2">\n            <input type="checkbox" \n                  id="hightlightAnswer"\n                  class="form-checkbox h-3 w-3 text-blue-500 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"\n                  ${
        (await chrome.storage.local.get(["hightlightAnswerSetting"]))
          .hightlightAnswerSetting
          ? "checked"
          : ""
      }>\n            <span>Tự động đánh dấu đáp án đúng</span>\n          </label>\n        </div>\n      `),
        document
          .getElementById("hightlightAnswer")
          .addEventListener("change", n);
    }
  });
}
function a(e, t) {
  (e.innerText = t),
    "Premium" === t || "Pro" === t
      ? (e.classList.remove("from-orange-500", "to-amber-500"),
        e.classList.add(
          "from-blue-500",
          "to-indigo-500",
          "shadow-md",
          "shadow-blue-500/20"
        ))
      : (e.classList.remove(
          "from-blue-500",
          "to-indigo-500",
          "shadow-md",
          "shadow-blue-500/20"
        ),
        e.classList.add("from-orange-500", "to-amber-500"));
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resolveLmsBtn").addEventListener("click", s),
    document.getElementById("resolveCmsBtn").addEventListener("click", e),
    document.getElementById("aiAssistantBtn").addEventListener("click", t),
    document.getElementById("logout").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "logout" }, function (e) {
        window.close();
      });
    }),
    chrome.storage.local.get(["user"], async ({ user: e }) => {
      var t;
      document.getElementById("userName").innerText = e.name;
      const n = (
        null == (t = null == e ? void 0 : e.avatar)
          ? void 0
          : t.startsWith("http")
      )
        ? e.avatar
        : "https://app.easyquiz.cc" + (null == e ? void 0 : e.avatar) ||
          "/avatars/male-1.svg";
      document.getElementById("userAvatar").src = n;
      const s = document.getElementById("userType"),
        i = document.getElementById("expDate"),
        o = document.getElementById("btnUpgrade");
      a(s, e.plan.name),
        ("Premium" !== e.plan.name && "Pro" !== e.plan.name) ||
          ((i.innerText =
            "Exp: " + new Date(e.plan.endDate).toLocaleDateString("vi")),
          (o.innerText = "Nạp Point"),
          (o.href = "https://app.easyquiz.cc/nap-point"));
      const r = await new Promise((e, t) => {
        chrome.runtime.sendMessage({ type: "get_user" }, (t) => {
          e(t);
        });
      });
      if (!r) return;
      const { plan: c, totalPoints: l } = r;
      a(s, c.name),
        "Premium" === e.plan.name || "Pro" === e.plan.name
          ? ((i.innerText =
              "Exp: " + new Date(e.plan.endDate).toLocaleDateString("vi")),
            (o.innerText = "Nạp Point"),
            (o.href = "https://app.easyquiz.cc/nap-point"),
            chrome.runtime.sendMessage({ type: "set_seb_key" }))
          : ((i.innerText = ""), (o.innerText = "Nâng cấp Premium")),
        l && (document.getElementById("points").innerText = l);
    });
});
