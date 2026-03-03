// Content script - runs on all web pages
// Handles selected text extraction and communication with background script

// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[Content] Received message:", message.action);
    
    if (message.action === "getSelectedText") {
        const selectedText = window.getSelection().toString();
        console.log("[Content] Selected text length:", selectedText.length);
        sendResponse({ text: selectedText });
    } else if (message.action === "getPageContent") {
        const pageContent = document.body.innerText;
        sendResponse({ text: pageContent });
    }
});

// Add context menu listener for selection
document.addEventListener("contextmenu", (event) => {
    const selectedText = window.getSelection().toString();
    
    // Store selected text in a way background.js can access it
    if (selectedText && selectedText.trim().length > 0) {
        browser.runtime.sendMessage({
            action: "setSelectedText",
            text: selectedText
        }).catch(() => {
            // Silent fail if background isn't ready
        });
    }
}, true);
