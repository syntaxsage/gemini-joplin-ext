# Contributing to Web Page Summarizer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing opinions and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list to see if the problem has already been reported. When you create a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs. actual behavior
- **Screenshots or error messages** if applicable
- **Your environment**: Firefox version, OS, extension version
- **Additional context** that might be helpful

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Why this enhancement would be useful**
- **Possible implementation approach** (if you have ideas)
- **Alternative solutions or workarounds** you've considered

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/syntaxsage/gemini-joplin-ext.git
   cd gemini-joplin-ext
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clear, understandable code
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```
   
   Use clear commit messages:
   - Start with a verb: "Add", "Fix", "Update", "Remove"
   - Keep the first line under 50 characters
   - Add a detailed description if needed

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear title and description
   - Reference any related issues using `#issue-number`
   - Explain the changes and why they're needed
   - Ask for help if you get stuck

## Development Setup

### Prerequisites

- Node.js 14 or higher
- Firefox browser
- Git

### Installation

1. Clone the repository (see "Pull Requests" above)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install web-ext globally (for development):
   ```bash
   npm install -g web-ext
   ```

### Running in Development Mode

```bash
web-ext run
```

This opens a test Firefox instance with your extension loaded.

### Building the Extension

```bash
web-ext build
```

This creates a signed `.xpi` file in `web-ext-artifacts/`.

### Testing Your Changes

1. **Manual Testing**:
   - Use `web-ext run` to test the extension in Firefox
   - Test all features: summarization, settings, error handling
   - Test on different websites to ensure compatibility

2. **Configuration Testing**:
   - Test with valid Gemini API key
   - Test with invalid API key
   - Test with valid/invalid Joplin token
   - Test Joplin connection testing

3. **Error Cases**:
   - Test behavior with empty page
   - Test with very long pages
   - Test network disconnection scenarios

## Code Style

### JavaScript

- Use `const` by default, `let` when needed
- Use arrow functions for callbacks
- Use descriptive variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### HTML/CSS

- Use semantic HTML elements
- Use CSS classes for styling
- Maintain consistency with existing styles
- Ensure accessibility (alt text, proper ARIA labels)

## Documentation

When making changes that affect functionality:

1. **Update the README.md** if adding new features or changing usage
2. **Update inline code comments** for complex logic
3. **Add/update error messages** to be user-friendly
4. **Document configuration options** if adding new ones

## Security Considerations

When contributing code, please keep in mind:

1. **Never commit API keys or tokens**
2. **Validate all user inputs**
3. **Handle errors gracefully without exposing sensitive info**
4. **Use HTTPS for external API calls** (already implemented)
5. **Store sensitive data securely** (use browser.storage.local)
6. **Sanitize data** before displaying to users

## Performance Considerations

1. **Minimize DOM manipulation**
2. **Avoid unnecessary API calls**
3. **Implement proper error handling** to avoid silent failures
4. **Use async/await** for clarity over promise chains

## Commit Message Convention

We follow conventional commits:

```
type(scope): subject

body

footer
```

Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding tests
- **chore**: Maintenance tasks

Examples:
```
fix(background): handle empty page content errors

Improved error message when page has no text content.
Fixes #42
```

## Licensing

By contributing to this project, you agree that your contributions will be licensed under its MIT License.

## Questions?

- Check existing issues and discussions
- Open a new discussion on GitHub
- Review the code comments and documentation
- Reach out respectfully on the project channels

## Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!
