# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this extension, please email us privately at [thirumoorthisundhar@gmail.com] instead of using the issue tracker. Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

We will acknowledge your report within 48 hours and provide an estimated timeline for a fix.

## Security Practices

### Data Handling

1. **API Keys**: Your Gemini API key and Joplin tokens are stored locally in your browser's storage and never transmitted to our servers or any third party.

2. **Network Communication**: 
   - All communication with Google Gemini API uses HTTPS
   - Joplin Web Clipper communication is local (localhost) and unencrypted by default
   - Consider enabling HTTPS on your Joplin instance for remote access

3. **Content Extraction**: Web page content is extracted and sent to Google Gemini API for summarization. Please review Google's privacy policy at https://policies.google.com/privacy

### Input Validation

- Page content is limited to 15,000 characters to prevent abuse
- Title length is limited to 200 characters
- All API responses are validated for correct structure before use

### Storage Security

- Credentials are stored in `browser.storage.local` which is:
  - Isolated per user profile
  - Encrypted by the browser
  - Not synced to cloud by default
  - Only accessible by this extension

### Recommendations for Users

1. **API Key Management**:
   - Use unique API keys if possible
   - Regularly rotate your Gemini API key
   - Monitor your API usage in Google Cloud Console
   - Set spending limits on your Gemini projects

2. **Joplin Token**:
   - Regenerate tokens periodically
   - If you suspect a token is compromised, regenerate it immediately
   - Only enable Web Clipper if you need to use it

3. **Network Security**:
   - Keep Firefox and Joplin updated
   - Use a VPN if accessing Joplin remotely
   - Don't share your API keys or tokens with others

### Third-Party Services

This extension communicates with:

- **Google Generative Language API** (generativelanguage.googleapis.com)
  - Privacy Policy: https://policies.google.com/privacy
  - Terms of Service: https://ai.google.dev/terms

- **Joplin Web Clipper API** (local)
  - No privacy concerns as communication is local
  - Data stored in your local Joplin instance

## Known Limitations

1. Very long pages (>15,000 chars) are truncated before sending to Gemini
2. Some sensitive content may be filtered by Gemini's safety guidelines
3. Network errors will show error messages in the browser console
4. API rate limits apply to both Gemini and Joplin

## Security Updates

We recommend:

- Enabling automatic Firefox updates
- Checking this repository periodically for security advisories
- Subscribing to GitHub notifications for this repository

## Questions?

For security-related questions that aren't vulnerabilities, please open a discussion on GitHub with the "security" label.
