# Extension Icons

## Icon Requirements

Place your extension icons in this directory with the following filenames and specifications:

### Required Icon Files

1. **icon-48.png** (48x48 pixels)
   - Used in the browser toolbar
   - Used in the Extensions menu
   - Minimum recommended size

2. **icon-96.png** (96x96 pixels)
   - Used on high-DPI displays (retina, 2x pixel ratio)
   - Used in browser extension popups

3. **icon-128.png** (128x128 pixels)
   - Used in the Firefox Add-ons store
   - Used in system theme compatibility checks
   - Recommended for visibility

### Icon Format Specifications

- **Format**: PNG with transparency (RGBA)
- **Background**: Transparent or solid background
- **Style**: Clear and recognizable at small sizes
- **Colors**: Use readable colors that work on both light and dark toolbars

### Design Recommendations

Your icon should:
- Be a simple, recognizable design
- Work well at small sizes (48x48 is the main size)
- Have good contrast for visibility
- Be unique and distinctive for the extension
- Convey the purpose (summarization/note-taking)

### Icon Ideas

Consider using:
- A document/page icon with a summarize/reduce symbol
- A bookmark or note icon
- A brain icon (for AI)
- A combination of page + checkmark/save

### Creating Icons

You can create icons using:
- **Figma** (Free tier available) - https://figma.com
- **Inkscape** (Free, open-source) - https://inkscape.org
- **GIMP** (Free, open-source) - https://www.gimp.org
- **Adobe Illustrator** (Commercial)
- **Photoshop** (Commercial)
- **Online Icon Generators** - Search "Firefox extension icon generator"

### Testing Your Icons

1. Place the PNG files in this `icons` directory
2. Reload the extension in Firefox (about:debugging)
3. Check that the icon appears:
   - In the browser toolbar
   - In the Extensions menu
   - In the popup

### Firefox Store Submission

When submitting to Firefox Add-ons:
- The 128x128 icon is displayed on the store listing
- A 64x64 rounded icon is automatically generated for store use
- Ensure your icon is distinctive and professional

### Tips

- Test your icon with both light and dark Firefox themes
- Make sure the icon is clear even when scaled down to 48x48
- Consider adding a subtle padding around your design for better appearance
- Use solid colors rather than gradients for better scaling
