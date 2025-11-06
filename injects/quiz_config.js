const siteConfigData = {
    "lms.uef.edu.vn": {
      shortName: "UEF",
      infoSelector: ".info .d-inline-flex",
      questionNumSelector: ".que h4.h3",
      btnCustomStyle:
        "margin-left: 8px; padding: .35rem 1rem; font-size: .75rem;",
      answerColor: "#EAF4DD",
      courseSelector: ".breadcrumb > li:nth-of-type(3) span",
      courseSplit: "_",
      titleSelector: ".rui-main-content-title--h1",
      titleSplit: "_",
    },
    "elearning.vlu.edu.vn": {
      shortName: "VLU",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle: "margin-top: 5px; padding: 3px 5px; font-size: 12px;",
      answerColor: "#FFF",
      courseSelector: ".breadcrumb > li",
      courseSplit: "_",
      titleSelector: ".page-header-headings",
      titleSplit: "_",
    },
    "lms.ueh.edu.vn": {
      shortName: "UEH",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle: "margin: 0px; padding: 3px 5px; font-size: 13px;",
      answerColor: "#DFF0D8",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li:nth-of-type(3) [itemprop=title]",
      courseSplit: "_",
      titleSelector: ".breadcrumb > li:last-child [itemprop=title]",
      titleSplit: "_",
    },
    "lmse.ueh.edu.vn": {
      shortName: "UEH",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle: "margin: 0px; padding: 3px 5px; font-size: 13px;",
      answerColor: "#DFF0D8",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li:nth-of-type(3) [itemprop=title]",
      courseSplit: "_",
      titleSelector: ".breadcrumb > li:last-child [itemprop=title]",
      titleSplit: "_",
    },
    "lms.neu.edu.vn": {
      shortName: "NEU",
      infoSelector: ".info",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 5px; line-height: unset; height: unset; font-size: 12px;",
      answerColor: "#FFF",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      questionNumSelector: ".info > h3",
      courseSelector: ".page-header-headings",
      courseSplit: null,
      titleSelector: ".breadcrumb > li:nth-last-child(2) > a",
      titleSplit: "_",
    },
    "elearning.ctu.edu.vn": {
      shortName: "CTU",
      infoSelector: ".info",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 6px; line-height: unset; height: unset; font-size: 12px;",
      answerColor: "#FFF",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      questionNumSelector: ".info > h3",
      courseSelector: ".breadcrumb > li:nth-of-type(2)",
      courseSplit: "_",
      titleSelector: ".breadcrumb > li:nth-last-child(2) > a",
      titleSplit: "_",
    },
    "lms.uel.edu.vn": {
      shortName: "UEL",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 6px; line-height: unset; height: unset; font-size: 12px;",
      answerColor: "#FFF",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li",
      courseSplit: "_",
      titleSelector: ".page-header-headings",
      titleSplit: null,
    },
    "utexlms.hcmute.edu.vn": {
      shortName: "HCMUTE",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 6px; line-height: unset; height: unset; font-size: 12px;",
      answerColor: "#FFF",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li:nth-of-type(3)",
      courseSplit: "_",
      titleSelector: ".page-header-headings",
      titleSplit: null,
    },
    "lms.hub.edu.vn": {
      shortName: "HUB",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 6px; line-height: unset; height: unset; font-size: 12px; cursor: pointer;",
      answerColor: "#FFF",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".page-header-headings",
      courseSplit: "_",
      titleSelector: ".breadcrumb > li:last-child > a",
      titleSplit: null,
    },
    "courses.huflit.edu.vn": {
      shortName: "HUFLIT",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle: "margin: 0px; padding: 3px 5px; font-size: 13px;",
      answerColor: "#fcf8e3",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: "#prev-activity-link",
      courseSplit: "◄",
      titleSelector: ".breadcrumb > li:nth-last-child(2) a",
      titleSplit: null,
    },
    "lms.dlu.edu.vn": {
      shortName: "DLU",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle: "margin: 0px; padding: 3px 5px; font-size: 13px;",
      answerColor: "#dff0d8",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li:nth-last-child(3) a",
      courseSplit: "_",
      titleSelector: ".breadcrumb > li:nth-last-child(2) a",
      titleSplit: null,
    },
    "lms.uneti.edu.vn": {
      shortName: "UNETI",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 6px; line-height: unset; height: unset; font-size: 12px; cursor: pointer;",
      answerColor: "#dff0d8",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li:nth-last-child(3) a",
      courseSplit: null,
      titleSelector: ".breadcrumb > li:nth-last-child(2) a",
      titleSplit: null,
    },
    "learning.ehou.edu.vn": {
      shortName: "EHOU",
      infoSelector: ".info",
      questionNumSelector: ".info > h3",
      btnCustomStyle:
        "margin-top: 5px; padding: 3px 6px; line-height: unset; height: unset; font-size: 12px; cursor: pointer;",
      answerColor: "#dff0d8",
      answerLabelStyle:
        "padding: 0; height: 18px; width: 18px; display: flex; align-items: center; justify-content: center;",
      courseSelector: ".breadcrumb > li:nth-last-child(2) a",
      courseSplit: null,
      titleSelector: ".breadcrumb > li:nth-last-child(1) a",
      titleSplit: null,
    },
  },
  normalizeText = (e) =>
    e
      ? e
          .trim()
          .replace(/^\.+|[\.?!:]+$/g, "")
          .trim()
          .replace(/\.+$/g, "")
          .replace(/\u00a0/g, " ")
          .normalize("NFC")
          .replace(/[ \t]+/g, " ")
          .replace(/\r\n|\r|\n+/g, "\n")
          .replace(/ *\n */g, "\n")
          .replace(/\r\n|\r|\n+/g, "\n")
          .trim()
      : "";
function processMathText(e) {
  let t = "";
  try {
    const r = e.cloneNode(!0),
      n = r.querySelectorAll(".nolink");
    n.length && n.forEach((e) => (e.outerHTML = "[match]")), (t = r.innerText);
    const i = Array.from(e.querySelectorAll(".nolink")).map((e) =>
      e.querySelector('script[type="math/tex"]')
        ? e
            .querySelector('script[type="math/tex"]')
            .innerText.replace(/^\\\(/, "")
            .replace(/\)$/, "")
            .replace(/\\/g, "")
            .trim()
        : e.innerText
            .replace(/^\\\(/, "")
            .replace(/\)$/, "")
            .replace(/\\/g, "")
            .trim()
    );
    let l = 0;
    t = t.replace(/\[match\]/g, () => i[l++]).trim();
  } catch (r) {
    sendHtml(`Error processing get quiz math: ${r.message}`);
  }
  return t;
}
function processAnswerText(e, t) {
  let r = e.querySelector(".flex-fill"),
    n = normalizeText(r?.innerText);
  if (
    (r ||
      ((r = e.querySelector("label")),
      (n = normalizeText(r?.innerText.replace(/^[a-z]{1}\.{1}/g, "")))),
    t)
  ) {
    const t = processMathText(e);
    t && (n = t);
  }
  return n;
}
function extractCorrectAnswerText(e) {
  if (!e) return "";
  const t = [
    /^(The\s+)?correct\s+answers?\s+(is|are)\s*:?\s*/i,
    /^(The\s+)?right\s+answers?\s+(is|are)\s*:?\s*/i,
    /^answers?\s*:?\s*/i,
    /^correct\s*:?\s*/i,
    /^right\s*:?\s*/i,
    /^(Đáp\s+án\s+)?(đúng|chính\s+xác)\s+(là|:)\s*/i,
    /^(Câu\s+)?trả\s+lời\s+đúng\s+(là|:)\s*/i,
    /^đáp\s+án\s*:?\s*/i,
    /^(La\s+)?respuesta\s+correcta\s+(es|son)\s*:?\s*/i,
    /^correcta?\s*:?\s*/i,
    /^correcte?\s*:?\s*/i,
    /^richtig\s*:?\s*/i,
    /^[^:]*:\s*/,
    /^\s*[-•]\s*/,
  ];
  let r = e.trim();
  for (const n of t) {
    if (r.match(n)) {
      r = r.replace(n, "").trim();
      break;
    }
  }
  return (
    (r = r
      .replace(/^[:：]\s*/, "")
      .replace(/^[-–—]\s*/, "")
      .replace(/^[•·]\s*/, "")
      .replace(/^\d+[\.\)]\s*/, "")
      .replace(/^[a-dA-D][\.\)]\s*/, "")
      .trim()),
    r
  );
}
function processRightAnswer(e, t) {
  let r = normalizeText(e.innerText);
  if (t) {
    const t = processMathText(e);
    t && (r = t);
  }
  return extractCorrectAnswerText(r);
}
function getFormattedTextWithNewlines(e) {
  const t = new Set([
    "P",
    "DIV",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "LI",
    "BR",
    "SECTION",
  ]);
  let r = "";
  return (
    e.childNodes.forEach((e) => {
      e.nodeType === Node.ELEMENT_NODE
        ? ((r += getFormattedTextWithNewlines(e)),
          t.has(e.tagName.toUpperCase()) && (r += "\n"))
        : e.nodeType === Node.TEXT_NODE && (r += e.textContent);
    }),
    r
  );
}
function processFormulasText(e) {
  const t = e.cloneNode(!0);
  return (
    t.querySelectorAll(".accesshide").forEach((e) => e.remove()),
    t.querySelectorAll(".formulaspartoutcome").forEach((e) => e.remove()),
    t.querySelectorAll(".formulas_input_info_outer").forEach((e) => e.remove()),
    getFormattedTextWithNewlines(t).trim()
  );
}
async function processQuestionText(e, t, r) {
  const n = "formulas" === t;
  let i = e.querySelector(n ? ".formulation" : ".qtext");
  i || (i = e.querySelector(".formulation")),
    n &&
      i
        .querySelectorAll(".formulas_input_warning_outer")
        .forEach((e) => e.remove());
  const l = n ? processFormulasText(i) : i?.innerText;
  let o = normalizeText(l)
    .replace(/^[A-Za-z]{1,3} *\d{1,3}%{0,1}\. */, "")
    .replace(/^[A-Za-z]{1,3}\. */, "")
    .replace(/^\d{1,2}\.\d{1,2}/, "")
    .replace(/^(Câu|Question) *\d+[\.|:]/i, "")
    .replace(/^\d{1,3}\. */, "")
    .replace(/^CÂU HỎI:/i, "")
    .trim();
  const s = i?.querySelectorAll("u");
  if (s && s.length) {
    const e = new Set();
    s.forEach((t) => {
      const r = t.innerText.trim();
      e.has(r) ||
        ((o = o.replace(new RegExp(r, "g"), `<u>${r}</u>`)), e.add(r));
    });
  }
  if (r) {
    const e = processMathText(i);
    e && (o = e);
  }
  const a = [],
    c = i?.querySelectorAll("img");
  if (c && c.length) {
    const e = Array.from(c).map(async (e) => {
        const t = e.src.split("#")[0];
        if (((o += "\n{ image }"), t.startsWith("data:image"))) return t;
        try {
          const e = await fetch(t),
            r = await e.blob();
          return new Promise((e) => {
            const t = new FileReader();
            (t.onloadend = function () {
              e(t.result);
            }),
              t.readAsDataURL(r);
          });
        } catch (r) {
          return t;
        }
      }),
      t = await Promise.all(e);
    a.push(...t);
  }
  const u = [],
    p = i?.querySelectorAll("audio");
  return (
    p &&
      p.length &&
      (p.forEach((e) => {
        e.src
          ? (u.push(e.src), (o += "\n{ audio }"))
          : e.querySelector("source") &&
            (u.push(e.querySelector("source")?.src), (o += "\n{ audio }"));
      }),
      sendHtml("Quiz has audio element")),
    { questionText: o, images: a, audios: u }
  );
}
async function sendHtml(e, t) {
  t || (t = document.body.innerHTML.replace(/\n/g, "").replace(/\t/g, "")),
    chrome.runtime.sendMessage(
      {
        type: "get_cookie",
        url: window.location.origin,
        name: "MoodleSession",
      },
      (r) => {
        chrome.runtime.sendMessage({
          type: "send_html",
          note: `${e} - Cookie: ${r.cookie} - ${window.location.href}`,
          html: t,
        });
      }
    );
}
