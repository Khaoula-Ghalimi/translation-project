const frame = document.getElementById("translator-frame");

let iframeReady = false;
let pendingText = "";

// 1️⃣ Listen for READY from Next.js iframe
window.addEventListener("message", (event) => {
    console.log("sidepanel received message:", event.data);
    if (event.data?.type === "TRANSLATOR_READY") {
        iframeReady = true;

        chrome.runtime.sendMessage({ action: "get_last_selection" }, (res) => {
            const text = (res?.text || "").trim();
            console.log("sidepanel got cached selection:", text);

            if (text) {
                frame.contentWindow.postMessage(
                    { type: "selection_updated", text },
                    "*"
                );
            }
        });

        // flush pending selection
        if (pendingText) {
            console.log("sidepanel flushing pending text to iframe:", pendingText);
            frame.contentWindow.postMessage(
                { type: "selection_updated", text: pendingText },
                "*"
            );
            pendingText = "";
        }

        // tell background we are ready
        chrome.runtime.sendMessage({ action: "panel_ready" });
    }
});

// 2️⃣ Receive selection from background
chrome.runtime.onMessage.addListener((message) => {
    console.log("sidepanel received runtime message:", message);
    if (message.action !== "selection_updated") return;

    const text = message.data;

    // iframe not ready yet → buffer it
    if (!iframeReady) {
        pendingText = text;
        return;
    }

    // iframe ready → send immediately
    frame.contentWindow.postMessage(
        { type: "selection_updated", text },
        "*"
    );
});
