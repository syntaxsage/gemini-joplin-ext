// 1. Create the right click menu item
browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: "summarize-to-joplin",
        title: "Summarize Page and Send to Joplin",
        contexts: ["all"]
    });
});

// 2. Handle the click event
browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "summarize-to-joplin") {
        try {
            // Show progress notification
            showNotification("Extracting page content and generating summary...", "info");
            
            // Get page content
            const [{ result }] = await browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText,
            });

            const summary = await getGeminiSummary(result);
            await sendToJoplin(tab.title, summary, tab.url);

            // Show success notification
            showNotification(`"${tab.title}" summarized and saved to Joplin!`, "success");
        } catch (error) {
            showNotification(`Failed to summarize: ${error.message}`, "error");
        }
    }
});

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
    // Pull the token from storage
    const settings = await browser.storage.local.get(["joplinToken", "joplinPort"]);
    if (!settings.joplinToken) throw new Error("Missing Joplin Web Clipper Token");
    
    const port = settings.joplinPort || 41184;
    const sanitizedTitle = title.substring(0, 200); // Limit title length

    try {
        const response = await fetch(`http://localhost:${port}/notes?token=${settings.joplinToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: `Summary: ${sanitizedTitle}`,
                body: `${body}\n\n---\nSource: [${sourceUrl}](${sourceUrl})`,
                parent_id: "" // Optional: ID of a specific notebook
            })
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