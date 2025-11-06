function isQuizTitle(e) {
  const t = ["quiz", "final", "quzi"];
  for (const n of t) if (e.includes(n)) return !0;
  return !1;
}
if (window.location.pathname.endsWith("/progress")) {
  const e = document.createElement("button");
  (e.textContent = "Chỉ hiện Quiz"),
    (e.style.position = "fixed"),
    (e.style.top = "10px"),
    (e.style.right = "10px"),
    (e.style.zIndex = "50"),
    (e.style.borderRadius = "5px"),
    document.body.appendChild(e),
    e.addEventListener("click", () => {
      document.querySelectorAll(".sections div a").forEach((e) => {
        isQuizTitle(e.innerText.toLowerCase().trim()) ||
          e.parentNode.parentNode.remove();
      });
    });
  const t = document.createElement("button");
  (t.textContent = "Mở tất cả Quiz"),
    (t.style.position = "fixed"),
    (t.style.top = "10px"),
    (t.style.right = "140px"),
    (t.style.zIndex = "50"),
    (t.style.borderRadius = "5px"),
    document.body.appendChild(t),
    t.addEventListener("click", () => {
      document.querySelectorAll(".sections div a").forEach((e) => {
        isQuizTitle(e.innerText.toLowerCase().trim()) &&
          window.open(e.href, "_blank");
      });
    });
}
