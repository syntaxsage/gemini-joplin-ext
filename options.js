// Save settings to local storage
function saveOptions(e) {
  e.preventDefault();
  const geminiKey = document.querySelector("#geminiKey").value.trim();
  const joplinToken = document.querySelector("#joplinToken").value.trim();
  const joplinPort = document.querySelector("#joplinPort").value || "41184";
  
  // Validate inputs
  if (!geminiKey) {
    showStatus("Please enter your Gemini API Key.", "error");
    return;
  }
  
  if (!joplinToken) {
    showStatus("Please enter your Joplin Web Clipper Token.", "error");
    return;
  }
  
  const port = parseInt(joplinPort);
  if (isNaN(port) || port < 1 || port > 65535) {
    showStatus("Port must be between 1 and 65535.", "error");
    return;
  }
  
  browser.storage.local.set({
    geminiKey: geminiKey,
    joplinToken: joplinToken,
    joplinPort: joplinPort
  }).then(() => {
    showStatus("Settings saved successfully!", "success");
  }).catch((error) => {
    showStatus("Failed to save settings: " + error.message, "error");
  });
}

// Restore settings when the page loads
function restoreOptions() {
  browser.storage.local.get(["geminiKey", "joplinToken", "joplinPort"]).then((result) => {
    if (result.geminiKey) {
      document.querySelector("#geminiKey").value = result.geminiKey;
    }
    if (result.joplinToken) {
      document.querySelector("#joplinToken").value = result.joplinToken;
    }
    if (result.joplinPort) {
      document.querySelector("#joplinPort").value = result.joplinPort;
    }
  }).catch((error) => {
    console.error("Failed to restore options:", error);
  });
}

// Utility function to show status messages
function showStatus(message, type = "success") {
  const status = document.querySelector("#status");
  status.textContent = message;
  status.className = type;
  
  if (type === "success") {
    setTimeout(() => {
      status.textContent = "";
      status.className = "";
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("click", saveOptions);

document.querySelector("#test-joplin").addEventListener("click", async () => {
    const token = document.querySelector("#joplinToken").value.trim();
    const port = document.querySelector("#joplinPort").value || "41184";
    const statusDiv = document.querySelector("#connection-status");
    
    if (!token) {
      statusDiv.textContent = "⚠ Please enter your Joplin token first.";
      statusDiv.className = "error";
      return;
    }
    
    statusDiv.textContent = "Testing connection...";
    statusDiv.className = "";

    try {
        // Joplin's ping endpoint
        const response = await fetch(`http://localhost:${port}/ping?token=${encodeURIComponent(token)}`, {
            timeout: 5000
        });
        
        if (!response.ok) {
            statusDiv.textContent = `✖ Joplin returned error ${response.status}. Check your token.`;
            statusDiv.className = "error";
            return;
        }
        
        const result = await response.text();

        if (result.trim() === "JoplinClipperServer") {
            statusDiv.textContent = "✔ Connection Successful!";
            statusDiv.className = "success";
        } else {
            statusDiv.textContent = "✖ Unexpected response from Joplin. Check your configuration.";
            statusDiv.className = "error";
        }
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            statusDiv.textContent = `✖ Cannot connect to Joplin at localhost:${port}. Is Joplin running?`;
        } else {
            statusDiv.textContent = `✖ Connection failed: ${error.message}`;
        }
        statusDiv.className = "error";
        console.error("Joplin connection test failed:", error);
    }
});