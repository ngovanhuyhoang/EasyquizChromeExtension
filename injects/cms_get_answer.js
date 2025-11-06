const apiUrl = "https://api.quizpoly.xyz";
let open = window.XMLHttpRequest.prototype.open,
  send = window.XMLHttpRequest.prototype.send;
function openReplacement(e, t, r, n, o) {
  return (this._url = t), open.apply(this, arguments);
}
function sendReplacement(e) {
  this.onreadystatechange &&
    (this._onreadystatechange = this.onreadystatechange),
    (this.onreadystatechange = onReadyStateChangeReplacement);
  try {
    return send.apply(this, arguments);
  } catch (t) {}
}
function onReadyStateChangeReplacement() {
  if (
    (4 == this.readyState &&
      this.responseURL.includes("problem_check") &&
      submit(JSON.parse(this.response)),
    this._onreadystatechange)
  )
    return this._onreadystatechange.apply(this, arguments);
}
function parseHTML(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
(window.XMLHttpRequest.prototype.open = openReplacement),
  (window.XMLHttpRequest.prototype.send = sendReplacement);
const normalizeText = (e) =>
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
      : "",
  formatAns = (e) => e.trim().replace(/\s+correct+$/g, "");
async function addQuiz(e) {
  try {
    const t = document.title.split("|")[2].replace("Courseware", "").trim();
    if (!t) return;
    const r = await fetch(apiUrl + "/cms/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: t, quizzes: e }),
      credentials: "include",
    });
    await r.json();
  } catch (t) {}
}
function submit(e) {
  if (!e.contents) return;
  const t = parseHTML(
      e.contents.replace(
        /allowfullscreen="true"\/>/g,
        'allowfullscreen="true"/></iframe>'
      )
    ),
    r = Array.from(t.querySelectorAll("div.poly")),
    n = Array.from(t.querySelectorAll("div.wrapper-problem-response"));
  if (r.length !== n.length) throw new Error("quesel and ansel not compare");
  qaEle = r.map((e, t) => [e, n[t]]);
  addQuiz(
    qaEle
      .map(([e, t]) => {
        const r = e.querySelector(".poly-body");
        let n = normalizeText(r.innerText);
        const o = r.querySelectorAll("img");
        o.length &&
          o.forEach((e) => {
            n += `\nImage:${e.src}`;
          });
        const a = r.querySelectorAll("audio");
        a.length &&
          a.forEach((e) => {
            e.src
              ? (n += `\nAudio:${e.src}`)
              : (n += `\nAudio:${e.querySelector("source")?.src}`);
          });
        const l = r.querySelectorAll("a");
        l.length &&
          l.forEach((e) => {
            n += `\nFile:${e.href}`;
          });
        const c = r.querySelector("iframe");
        c && (n += `\nIframe:${c.src}`);
        let s = "";
        const i = t.querySelectorAll("input[checked=true]");
        if (!t.querySelector(".correct")) return { q: null, a: null };
        if (i && i.length)
          if (i.length > 1)
            s = Array.from(i).map((e) => {
              const t = e.parentNode.querySelector("img");
              return `${normalizeText(
                formatAns(e.parentNode.innerText.trim())
              )}${t ? `\nImage:${t.src}` : ""}`.trim();
            });
          else {
            const e = i[0].parentNode.querySelector("img");
            s = `${normalizeText(formatAns(i[0].parentNode.innerText.trim()))}${
              e ? `\nImage:${e.src}` : ""
            }`.trim();
          }
        else {
          const e = t.querySelector("div.correct > input");
          e && (s = e.getAttribute("value")), s && (s = s.toLowerCase().trim());
        }
        return { q: n.trim(), a: s };
      })
      .filter((e) => e.q && e.a)
  );
}
