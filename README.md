# Web Page Summarizer

A Firefox extension that summarizes any web page using Google's Gemini AI and sends the summary directly to Joplin for note-taking.

## Features

- 🤖 **AI-Powered Summarization**: Uses Google's Gemini AI to create intelligent summaries of web content
- 📝 **Direct Joplin Integration**: Automatically saves summaries to your Joplin notebook
- 🔍 **Selection Summarization**: Right-click and summarize any selected text on a page
- 👁️ **Summary Preview**: Review the AI-generated summary before saving to Joplin
- 📚 **Notebook Selection**: Choose which Joplin notebook to save summaries to
- 🔔 **Desktop Notifications**: Get instant feedback when summaries are saved
- 🔐 **Secure**: Your API keys are stored locally and never shared
- ⚙️ **Customizable**: Configure API keys, Joplin settings, and target notebooks

## Installation

### Prerequisites

Before installing this extension, you need:

1. **Firefox Browser** (version 109 or later)
2. **Google Gemini API Key** (free) - Get one at [Google AI Studio](https://aistudio.google.com/apikey)
3. **Joplin Application** with Web Clipper enabled
4. **Joplin Web Clipper Token** - Available in Joplin's settings

### Step 1: Get Your API Keys

#### Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Get API key"
4. Create a new API key or use an existing one
5. Copy the API key (you'll need it in Step 4)

#### Joplin Web Clipper Token

1. Open Joplin
2. Go to **Tools** → **Options** (or **Preferences** on macOS)
3. Navigate to **Web Clipper**
4. Enable "Web Clipper" if not already enabled
5. Copy your **token** (the long string under Web Clipper settings)
6. Note the **port** (default is 41184)

### Step 2: Install the Extension

#### Option A: Install from Firefox Add-ons Store (Recommended)

*Coming soon! The extension will be available on the official Firefox Add-ons store.*

#### Option B: Install Manually

1. Download the latest `.xpi` file from the [Releases](https://github.com/your-username/gemini-joplin-ext/releases) page
2. Open Firefox
3. Press `Ctrl+Shift+A` (or go to `about:addons`)
4. Click the gear icon and select "Install Add-on from File"
5. Select the downloaded `.xpi` file
6. Click "Add" to install

#### Option C: Install for Development

1. Clone this repository:
   ```bash
   git clone https://github.com/syntaxsage/gemini-joplin-ext.git
   cd gemini-joplin-ext
   ```

2. Install [web-ext](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext):
   ```bash
   npm install -g web-ext
   ```

3. Run the extension in development mode:
   ```bash
   web-ext run
   ```

### Step 3: Configure the Extension

1. Click the extension icon in your Firefox toolbar
2. Click **Settings**
3. Enter your **Google Gemini API Key**
4. Enter your **Joplin Web Clipper Token**
5. (Optional) If your Joplin is on a custom port, update it here (default is 41184)
6. Click **Test Joplin Connection** to verify everything works
7. Click **Save Settings**

## Usage

### Method 1: Summarize Entire Page

1. **Right-click** anywhere on a web page
2. Select **"Summarize Page and Send to Joplin"** from the context menu
3. A preview window opens with the generated summary
4. Review the summary (optional: edit before saving)
5. Click **"Save to Joplin"** to create the note

### Method 2: Summarize Selected Text

1. **Highlight/select** the text you want to summarize
2. **Right-click** on the selection
3. Select **"Summarize Selection and Send to Joplin"** from the context menu
4. A preview window opens with the summary of just that text
5. Review and save to Joplin

### Setting Your Preferred Notebook

1. Go to **Extension Settings** (Click the extension icon → Settings)
2. In the **Joplin Configuration** section, click **"Refresh Notebooks"**
3. Select your preferred notebook from the dropdown
4. Click **"Save Settings"**
5. All future summaries will be saved to this notebook

### How It Works

1. You submit a page or selection for summarization
2. The extension extracts the content
3. Sends it to Google Gemini AI for intelligent summarization
4. The preview window shows the generated summary
5. You can review and optionally edit before confirming
6. The note is created in your selected Joplin notebook
7. A desktop notification confirms the save
8. The source URL is automatically included for reference

### Troubleshooting

#### "Missing Gemini API Key"
- Go to **Settings** and add your Google Gemini API key
- Ensure you copied the entire key correctly

#### "Missing Joplin Token"
- Open the extension settings
- Copy your Joplin Web Clipper token from Joplin **Tools** → **Options** → **Web Clipper**

#### "Cannot connect to Joplin"
- Make sure Joplin is running
- Verify the port is correct (default: 41184)
- Try clicking "Test Joplin Connection" in settings
- Ensure Web Clipper is enabled in Joplin

#### Content blocked by safety filters
- Gemini AI may block summarization of certain content (adult, violence, etc.)
- Try a different page or section of content

#### Very long pages not summarizing
- The extension limits content to the first 15,000 characters
- This is intentional to optimize API usage and avoid token limits

## Technical Details

### Architecture

- **background.js**: Handles context menu creation and API calls
- **options.html/js**: Settings management interface
- **popup.html/js**: Extension popup UI
- **manifest.json**: Extension configuration and permissions

### API Integrations

1. **Google Gemini API** (generativelanguage.googleapis.com)
   - Used for intelligent text summarization
   - Free tier available

2. **Joplin Web Clipper API** (localhost)
   - Used to create notes in your local Joplin instance
   - No internet connection required

### Data Privacy

- Your API keys are stored locally in your browser
- All summarization is done through Google's APIs
- Notes are sent to your local Joplin (no cloud sync unless you enable it)
- No data is collected by this extension

## Development

### Project Structure

```
gemini-joplin-ext/
├── background.js           # Main extension logic
├── manifest.json           # Extension configuration
├── options.html/js         # Settings UI
├── popup.html/js           # Popup UI
├── web-ext-artifacts/      # Built extension packages
├── README.md              # This file
├── LICENSE                # MIT License
└── CONTRIBUTING.md        # Contribution guidelines
```

### Requirements

- Node.js 14+ (for development)
- web-ext CLI tool

### Building for Release

```bash
web-ext build
```

This creates a `.xpi` file in `web-ext-artifacts/` ready for distribution.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to:

- Report bugs
- Suggest features
- Submit pull requests
- Set up the development environment

## Support

- 📖 [Read the documentation](https://github.com/syntaxsage/gemini-joplin-ext#readme)
- 🐛 [Report a bug](https://github.com/your-username/gemini-joplin-ext/issues)
- 💬 [Request a feature](https://github.com/your-username/gemini-joplin-ext/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/)
- [Joplin](https://joplinapp.org/)
- [Mozilla WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

## Changelog

### Version 1.0.0

- ✨ Initial release
- 🎯 Summarize any web page with Gemini AI
- 📝 Direct integration with Joplin
- ⚙️ Configurable API keys and settings
- 🔍 Context menu integration
- 🔐 Local storage of credentials
