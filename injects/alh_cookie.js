const stuName = document.querySelector(".user-name > h3")?.textContent,
  pg = document.querySelector(
    ".classroom-wrap > div > div:last-child > div.flex-grow-1 > span"
  )?.textContent;
stuName &&
  pg &&
  chrome.runtime.sendMessage({
    type: "alh_cookie",
    data: { stuName: stuName, pg: pg.replace(/ _/g, "_") },
  });
