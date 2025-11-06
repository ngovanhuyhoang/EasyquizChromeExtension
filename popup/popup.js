document.querySelector("#btnLogin").addEventListener("click", function () {
  chrome.runtime.sendMessage({ type: "login" }, function (e) {
    "success" == e && window.close();
  });
});
