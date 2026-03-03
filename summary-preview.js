// Summary Preview Script
// Handles the preview window for summary before saving

let originalContent = null;
let pageTitle = null;
let pageUrl = null;
let isSelection = false;

// Extract parameters from URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        content: decodeURIComponent(params.get('content') || ''),
        title: decodeURIComponent(params.get('title') || ''),
        url: decodeURIComponent(params.get('url') || ''),
        isSelection: params.get('isSelection') === 'true'
    };
}

// Generate summary from content
async function generateSummary(content) {
    console.log("[Preview] Starting summary generation");
    showStatus("Generating summary with Gemini AI...", "loading");
    
    try {
        const summary = await browser.runtime.sendMessage({
            action: "generateAndPreview",
            content: content
        });
        
        console.log("[Preview] Summary received, length:", summary.length);
        return summary;
    } catch (error) {
        console.error("[Preview] Generation failed:", error);
        showStatus(`Failed to generate summary: ${error.message}`, "error");
        throw error;
    }
}

// Get summary using background script function
async function getSummaryFromBackground(content) {
    return new Promise((resolve, reject) => {
        // We'll call the background script's getGeminiSummary through a message
        browser.runtime.sendMessage({
            action: "generateSummary",
            content: content
        }).then(response => {
            if (response.error) {
                reject(new Error(response.error));
            } else {
                resolve(response.summary);
            }
        }).catch(error => {
            reject(error);
        });
    });
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.classList.remove('loading', 'error');
    
    if (type === 'loading') {
        statusEl.innerHTML = `<span class="spinner"></span>${message}`;
        statusEl.classList.add(type);
    } else if (type === 'error') {
        statusEl.textContent = message;
        statusEl.classList.add(type);
    } else {
        statusEl.style.display = 'none';
    }
}

// Save summary to Joplin
async function saveSummary() {
    console.log("[Preview] Saving summary");
    
    const editedSummary = document.getElementById('summary-edit').value || 
                          document.getElementById('summary-content').textContent;
    
    try {
        showStatus("Saving to Joplin...", "loading");
        
        // Send message to background script to save
        const response = await browser.runtime.sendMessage({
            action: "saveSummary",
            text: editedSummary,
            title: pageTitle,
            url: pageUrl,
            isSelection: isSelection
        });
        
        console.log("[Preview] Save response:", response);
        showStatus("Saved successfully!", "success");
        
        // Close window after short delay
        setTimeout(() => {
            window.close();
        }, 1500);
        
    } catch (error) {
        console.error("[Preview] Save failed:", error);
        showStatus(`Failed to save: ${error.message}`, "error");
    }
}

// Initialize the preview
async function init() {
    console.log("[Preview] Initializing preview window");
    
    const params = getUrlParams();
    pageTitle = params.title;
    pageUrl = params.url;
    isSelection = params.isSelection;
    originalContent = params.content;
    
    console.log("[Preview] Parameters:", { 
        title: pageTitle, 
        url: pageUrl, 
        isSelection: isSelection,
        contentLength: originalContent.length 
    });
    
    // Update header
    const headerSubtitle = isSelection ? 
        "You selected a portion of text for summarization" :
        "The entire page will be summarized";
    document.querySelector('.header p').textContent = headerSubtitle;
    
    try {
        // Generate summary
        showStatus("Generating summary with Gemini AI...", "loading");
        
        const summary = await getSummaryFromBackground(originalContent);
        
        // Display summary
        document.getElementById('summary-content').textContent = summary;
        document.getElementById('summary-edit').value = summary;
        
        showStatus("", "complete");
        console.log("[Preview] Summary displayed");
        
    } catch (error) {
        console.error("[Preview] Initialization failed:", error);
        showStatus(`Failed to generate summary: ${error.message}`, "error");
    }
}

// Event listeners
document.getElementById('btn-cancel').addEventListener('click', () => {
    console.log("[Preview] Cancel clicked");
    window.close();
});

document.getElementById('btn-save').addEventListener('click', () => {
    console.log("[Preview] Save clicked");
    saveSummary();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Preview] DOM loaded, starting init");
    init();
});
