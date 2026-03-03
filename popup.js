// Open settings page
document.getElementById('open-settings').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
});

// Open guide (can be a local guide or external documentation)
document.getElementById('open-guide').addEventListener('click', () => {
    browser.tabs.create({
        url: 'https://github.com/your-username/gemini-joplin-ext#readme'
    });
});

// Optional: Check if settings are configured on popup open
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await browser.storage.local.get(['geminiKey', 'joplinToken']);
    
    if (!settings.geminiKey || !settings.joplinToken) {
        const statusDiv = document.getElementById('status');
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ Please configure your settings before using this extension.';
    }
});
