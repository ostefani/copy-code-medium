# Medium Code Copy - Chrome Extension

A lightweight Chrome extension that adds copy buttons to code blocks on Medium articles.

## Installation for Development

1. Make sure you have Node.js installed
2. Run: `npm install`
3. Run: `npm run build`
4. Download or clone this repository
5. Open Chrome and go to `chrome://extensions/`
6. Enable "Developer mode"
7. Click "Load unpacked"
8. Load the `dist/` directory in Chrome
9. Visit any Medium article with code blocks

## File Structure

```
my-project/
|── docs/
| └── privacy.html
|── public/
| └── icon16.png
| └── icon48.png
| └── icon128.png
├── src/
│ ├── content/
│ │ └──content.js
| | └──content.css
| | └──copy-button.html
├── manifest.json
├── package.json
├── vite.config.js
├── README.md
└── LICENSE
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Attribution

If you use this code in your own project, please credit the original author: [Olha Stefanishyna](https://github.com/ostefani).

## Privacy

Read full document at [Privacy](https://ostefani.github.io/copy-code-medium/privacy.html)

## Contributing

Pull requests welcome! Please:

-   Create dedicated feature branch
-   Test on multiple Medium articles
-   Follow existing code style
-   Update README for new features
-   Create PR

## Support

If you encounter issues open an issue with details
