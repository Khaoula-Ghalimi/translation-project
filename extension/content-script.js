// content-script.js
let lastSent = "";

function send(text) {
  text = (text || "").trim();
  if (!text || text === lastSent) return;
  lastSent = text;
  chrome.runtime.sendMessage({ action: "selection_updated", data: text });
}

function currentSelection() {
  return window.getSelection()?.toString() || "";
}

document.addEventListener("mouseup", () => send(currentSelection()));
document.addEventListener("contextmenu", () => send(currentSelection())); // right-click
