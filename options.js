// Utility function to show status messages
function showStatus(message, type = "success") {
  const status = document.querySelector("#status");
  if (!status) {
    console.error("Status element not found");
    return;
  }
  
  status.textContent = message;
  status.className = type;
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  if (type === "success") {
    setTimeout(() => {
      status.textContent = "";
      status.className = "";
    }, 3000);
  }
}

// Save settings to local storage
function saveOptions(e) {
  console.log("Save button clicked");
  e.preventDefault();
  
  const geminiKey = document.querySelector("#geminiKey").value.trim();
  const joplinToken = document.querySelector("#joplinToken").value.trim();
  const joplinPort = document.querySelector("#joplinPort").value || "41184";
  const joplinNotebook = document.querySelector("#joplinNotebook").value || "default";
  
  console.log("Values to save:", {
    geminiKey: geminiKey ? "***" : "empty",
    joplinToken: joplinToken ? "***" : "empty",
    joplinPort: joplinPort,
    joplinNotebook: joplinNotebook
  });
  
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
    joplinPort: joplinPort,
    joplinNotebook: joplinNotebook
  }).then(() => {
    console.log("Settings saved successfully");
    showStatus("Settings saved successfully!", "success");
  }).catch((error) => {
    console.error("Failed to save settings:", error);
    showStatus("Failed to save settings: " + error.message, "error");
  });
}

// Restore settings when the page loads
function restoreOptions() {
  console.log("Restoring options");
  browser.storage.local.get(["geminiKey", "joplinToken", "joplinPort", "joplinNotebook"]).then((result) => {
    console.log("Retrieved stored values");
    if (result.geminiKey) {
      document.querySelector("#geminiKey").value = result.geminiKey;
      console.log("Restored Gemini key");
    }
    if (result.joplinToken) {
      document.querySelector("#joplinToken").value = result.joplinToken;
      console.log("Restored Joplin token");
    }
    if (result.joplinPort) {
      document.querySelector("#joplinPort").value = result.joplinPort;
      console.log("Restored Joplin port:", result.joplinPort);
    }
    if (result.joplinNotebook) {
      document.querySelector("#joplinNotebook").value = result.joplinNotebook;
      console.log("Restored Joplin notebook:", result.joplinNotebook);
    }
  }).catch((error) => {
    console.error("Failed to restore options:", error);
  });
}

// Fetch notebooks from Joplin
async function refreshNotebooks() {
  console.log("Refreshing notebooks from Joplin");
  const token = document.querySelector("#joplinToken").value.trim();
  const port = document.querySelector("#joplinPort").value || "41184";
  
  if (!token) {
    showStatus("Please enter your Joplin token first.", "error");
    return;
  }
  
  const btn = document.getElementById('refresh-notebooks');
  btn.disabled = true;
  btn.textContent = "Refreshing...";
  
  try {
    console.log(`Fetching notebooks from localhost:${port}`);
    
    const response = await fetch(`http://localhost:${port}/folders?token=${encodeURIComponent(token)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch notebooks`);
    }
    
    const folders = await response.json();
    console.log("Received folders:", folders.length);
    
    const select = document.querySelector("#joplinNotebook");
    
    // Clear existing options except default
    while (select.options.length > 1) {
      select.remove(1);
    }
    
    // Add folders to dropdown
    if (Array.isArray(folders)) {
      folders.forEach(folder => {
        if (folder.id && folder.title) {
          const option = document.createElement("option");
          option.value = folder.id;
          option.textContent = folder.title;
          select.appendChild(option);
          console.log("Added folder:", folder.title);
        }
      });
    }
    
    showStatus(`[SUCCESS] Found ${folders.length} notebooks!`, "success");
    
  } catch (error) {
    console.error("Failed to fetch notebooks:", error);
    showStatus(`Failed to refresh notebooks: ${error.message}`, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Refresh Notebooks";
  }
}

// Test Joplin connection
async function testJoplinConnection() {
  console.log("Test Joplin connection clicked");
  
  const token = document.querySelector("#joplinToken").value.trim();
  const port = document.querySelector("#joplinPort").value || "41184";
  const statusDiv = document.querySelector("#connection-status");
  
  if (!statusDiv) {
    console.error("Connection status element not found");
    return;
  }
  
  if (!token) {
    statusDiv.textContent = "[WARNING] Please enter your Joplin token first.";
    statusDiv.className = "error";
    console.warn("No Joplin token provided");
    return;
  }
  
  statusDiv.textContent = "Testing connection...";
  statusDiv.className = "";
  console.log(`Testing Joplin connection to localhost:${port}`);

  try {
    // Joplin's ping endpoint
    const response = await fetch(`http://localhost:${port}/ping?token=${encodeURIComponent(token)}`);
    console.log("Received response:", response.status);
    
    if (!response.ok) {
      statusDiv.textContent = `[ERROR] Joplin returned error ${response.status}. Check your token.`;
      statusDiv.className = "error";
      console.error(`HTTP error: ${response.status}`);
      return;
    }
    
    const result = await response.text();
    console.log("Ping response:", result.trim());

    if (result.trim() === "JoplinClipperServer") {
      statusDiv.textContent = "[SUCCESS] Connection Successful!";
      statusDiv.className = "success";
      console.log("Connection test passed!");
    } else {
      statusDiv.textContent = "[ERROR] Unexpected response from Joplin. Check your configuration.";
      statusDiv.className = "error";
      console.warn("Unexpected response:", result.trim());
    }
  } catch (error) {
    console.error("Connection test error:", error);
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      statusDiv.textContent = `[ERROR] Cannot connect to Joplin at localhost:${port}. Is Joplin running?`;
    } else {
      statusDiv.textContent = `[ERROR] Connection failed: ${error.message}`;
    }
    statusDiv.className = "error";
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing options page");
  
  // Restore settings
  restoreOptions();
  
  // Attach save button listener
  const saveBtn = document.querySelector("#save");
  if (saveBtn) {
    console.log("Save button found, attaching listener");
    saveBtn.addEventListener("click", saveOptions);
  } else {
    console.error("Save button not found!");
  }
  
  // Attach test Joplin button listener
  const testJoplinBtn = document.querySelector("#test-joplin");
  if (testJoplinBtn) {
    console.log("Test Joplin button found, attaching listener");
    testJoplinBtn.addEventListener("click", testJoplinConnection);
  } else {
    console.error("Test Joplin button not found!");
  }
  
  // Attach refresh notebooks button listener
  const refreshBtn = document.querySelector("#refresh-notebooks");
  if (refreshBtn) {
    console.log("Refresh notebooks button found, attaching listener");
    refreshBtn.addEventListener("click", refreshNotebooks);
  } else {
    console.error("Refresh notebooks button not found!");
  }
  
  console.log("Options page initialization complete");
});