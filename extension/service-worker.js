chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    chrome.contextMenus.create({
        id: "my_menu_item",
        title: "Open Translator Sidebar",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== "my_menu_item" || !tab?.id) return;

    // MUST be immediate for user gesture
    chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);

    // contextMenus gives you selectionText directly ✅
    const text = (info.selectionText || "").trim();
    if (!text) return;

    // cache for sidepanel to pull on startup
    chrome.storage.session.set({ last_selection: text });

    // optional live push (may be missed if sidepanel not ready, that's ok)
    chrome.runtime.sendMessage({ action: "selection_updated", data: text }).catch(() => { });
});

// sidepanel pulls cached selection
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.action === "get_last_selection") {
        chrome.storage.session.get("last_selection").then((res) => {
            sendResponse({ text: res.last_selection || "" });
        });
        return true;
    }
});
