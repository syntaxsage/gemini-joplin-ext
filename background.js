// Global variable to store selected text
let lastSelectedText = null;
let lastPageUrl = null;
let lastPageTitle = null;

// 1. Create the right click menu items
browser.runtime.onInstalled.addListener(() => {
    // Summarize entire page context menu
    browser.contextMenus.create({
        id: "summarize-page",
        title: "Summarize Page and Send to Joplin",
        contexts: ["page"]
    });
    
    // Summarize selection context menu
    browser.contextMenus.create({
        id: "summarize-selection",
        title: "Summarize Selection and Send to Joplin",
        contexts: ["selection"]
    });
});

// Message listener for content script and preview window
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setSelectedText") {
        lastSelectedText = message.text;
    } else if (message.action === "saveSummary") {
        // Preview window asking to save
        handleSummarization(message.text, message.title, message.url, message.isSelection)
            .catch(error => {
                showNotification(`Failed to save: ${error.message}`, "error");
            });
        sendResponse({ status: "processing" });
    } else if (message.action === "generateSummary") {
        // Preview window asking to generate summary
        getGeminiSummary(message.content)
            .then(summary => {
                sendResponse({ summary: summary });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true; // Keep channel open for async response
    }
});

// Handle keyboard shortcut
browser.commands.onCommand.addListener((command) => {
    console.log("[Background] Command triggered:", command);
    
    if (command === "summarize-page") {
        // Get active tab and summarize
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            if (tabs[0]) {
                handleContextMenuClick({
                    menuItemId: "summarize-page",
                    targetId: tabs[0].id
                }, tabs[0]);
            }
        });
    }
});

// 2. Handle the click event
browser.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log("[Background] Context menu clicked:", info.menuItemId);
    
    if (info.menuItemId === "summarize-page" || info.menuItemId === "summarize-selection") {
        handleContextMenuClick(info, tab);
    }
});

async function handleContextMenuClick(info, tab) {
    try {
        let contentToSummarize = null;
        let isSelection = false;
        
        if (info.menuItemId === "summarize-selection") {
            // Use selected text
            contentToSummarize = info.selectionText;
            isSelection = true;
            console.log("[Background] Summarizing selection, length:", contentToSummarize.length);
        } else {
            // Get entire page content
            showNotification("Extracting page content and generating summary...", "info");
            const [{ result }] = await browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText,
            });
            contentToSummarize = result;
            isSelection = false;
            console.log("[Background] Summarizing page, length:", contentToSummarize.length);
        }

        // Show preview window
        showSummaryPreview(contentToSummarize, tab.title, tab.url, isSelection);
        
    } catch (error) {
        showNotification(`Failed to process: ${error.message}`, "error");
    }
}

async function handleSummarization(text, title, url, isSelection) {
    try {
        showNotification("Generating summary with Gemini AI...", "info");
        const summary = await getGeminiSummary(text);
        
        showNotification("Saving to Joplin...", "info");
        await sendToJoplin(title, summary, url);

        const summaryType = isSelection ? "selection" : "page";
        showNotification(`"${title}" ${summaryType} summarized and saved to Joplin!`, "success");
    } catch (error) {
        showNotification(`Failed to summarize: ${error.message}`, "error");
        throw error;
    }
}

// Helper function to show summary preview window
async function showSummaryPreview(content, title, url, isSelection) {
    try {
        const encodedContent = encodeURIComponent(content);
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);
        
        const previewUrl = browser.runtime.getURL("summary-preview.html") + 
            `?content=${encodedContent}&title=${encodedTitle}&url=${encodedUrl}&isSelection=${isSelection}`;
        
        console.log("[Background] Opening preview window");
        
        // Open preview in a new window or tab
        browser.windows.create({
            url: previewUrl,
            type: "normal",
            width: 800,
            height: 600
        });
    } catch (error) {
        console.error("Failed to open preview:", error);
        // Fallback: proceed without preview
        showNotification("Opening preview failed, proceeding with summarization...", "info");
        // Don't throw, just continue
    }
}

// Helper function to show notifications to the user
function showNotification(message, type = "success") {
    let title = "Web Page Summarizer";
    const iconUrl = "icons/icon-96.png";
    
    if (type === "error") {
        title = "Web Page Summarizer - Error";
    } else if (type === "info") {
        title = "Web Page Summarizer - Processing...";
    }
    
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    browser.notifications.create({
        type: "basic",
        title: title,
        message: message,
        iconUrl: iconUrl
    }).catch(error => {
        // Fallback: just log if notifications API fails
        console.error("Notification failed:", error);
    });
}

// 3. Call Gemini API
async function getGeminiSummary(text) {
    // Pull the key from storage
    const settings = await browser.storage.local.get("geminiKey");
    if (!settings.geminiKey) throw new Error("Missing Gemini API Key");

    // Validate input
    if (!text || text.trim().length === 0) {
        throw new Error("No page content to summarize");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Please summarize the following content in a clear and concise manner. Use markdown formatting for better readability:\n\n${text.substring(0, 15000)}` }]
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`Gemini API Error (${response.status}): ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.error) {
        throw new Error(`Gemini API Error (${data.error.code}): ${data.error.message}`);
    }

    // Check if candidates exist (Safety blocks or empty responses)
    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("Gemini returned no results. The content may have been blocked by safety filters.");
    }

    // Validate the response structure
    if (!data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
        throw new Error("Invalid response format from Gemini API");
    }

    return data.candidates[0].content.parts[0].text;
}

// 4. Send to Joplin Local API
async function sendToJoplin(title, body, sourceUrl) {
    // Pull the token and settings from storage
    const settings = await browser.storage.local.get(["joplinToken", "joplinPort", "joplinNotebook"]);
    if (!settings.joplinToken) throw new Error("Missing Joplin Web Clipper Token");
    
    const port = settings.joplinPort || 41184;
    const sanitizedTitle = title.substring(0, 200); // Limit title length

    try {
        const payload = {
            title: `Summary: ${sanitizedTitle}`,
            body: `${body}\n\n---\nSource: [${sourceUrl}](${sourceUrl})`,
        };
        
        // Add parent_id if a specific notebook was selected
        if (settings.joplinNotebook && settings.joplinNotebook !== "default") {
            payload.parent_id = settings.joplinNotebook;
        }

        const response = await fetch(`http://localhost:${port}/notes?token=${encodeURIComponent(settings.joplinToken)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid Joplin token. Please check your settings.");
            } else if (response.status === 404) {
                throw new Error(`Joplin not accessible at localhost:${port}. Is Joplin running?`);
            } else {
                throw new Error(`Joplin API Error (${response.status})`);
            }
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error(`Cannot connect to Joplin at localhost:${port}. Make sure Joplin is running and Web Clipper is enabled.`);
        }
        throw error;
    }
}