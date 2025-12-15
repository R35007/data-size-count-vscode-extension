# Data Size Count

> 📊 **A powerful VS Code extension that displays file statistics and data insights directly in your status bar.**

![VS Code](https://img.shields.io/badge/VS%20Code-v1.30.0+-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-3.0.0-brightgreen?style=flat-square)

Shows file size, lines count, words count, array length, object size, and HTML/XML tag counts directly in your VS Code status bar—all updated in real-time as you work.

<div align="center">
  <a href="https://buymeacoffee.com/r35007" target="_blank">
    <img src="https://r35007.github.io/Siva_Profile/images/buymeacoffee.png" alt="Buy Me A Coffee" height="40" />
  </a>
</div>

## ✨ Features

### Core Metrics

Display instantly in your VS Code status bar:

- **File Size** – Total size of the active file
- **Selected Size** – Size of selected text in bytes
- **Lines Count** – Number of selected lines
- **Words Count** – Number of selected words
- **Character Count** – Total and whitespace-excluded character counts
- **Array Length** – Automatic JSON array detection and element count
- **Object Size** – JSON object property count
- **HTML/XML Tags** – Element counts for markup

### Intelligent Features

- **Real-Time Updates** – Metrics refresh instantly as you type or change selections
- **Multi-Cursor Support** – Handles multiple selections correctly
- **JSON Parsing** – Automatically detects and analyzes JSON structures
- **Markup Detection** – Recognizes HTML and XML content
- **Custom Formatting** – Use template variables and VS Code icons to design your display
- **Regex Counting** – Define custom patterns to count imports, exports, comments, and more

### Flexible Customization

- Define custom display formats with variables and icons
- Choose status bar position (left/right) and priority
- Configure separators for metrics

## Usage

### Basic Operation

Once installed, the extension works automatically:

1. Open any file in VS Code
2. Make a selection to see metrics
3. Click the status bar item to view details in a popup
4. Customize display format in settings

### Commands

| Command | Purpose |
|---------|---------|
| `data-size-count.showCombinedDetails` | Display detailed statistics popup |

Access via **Command Palette** (Ctrl+Shift+P / Cmd+Shift+P) or click the status bar item.

### Visual Examples

<div align="center">
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437226-dc753331-d2e4-47a6-a2eb-356da600b52d.png" alt="File Size Display" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437260-c61d8df3-919c-410a-a431-1aa6cbda1b46.png" alt="Selection Metrics" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437279-4230192c-2ef5-484e-9251-03f1dd3720b2.png" alt="Array Detection" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437296-3a0161c8-c21b-4534-8e06-5dcc2ed35493.png" alt="Object Metrics" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437318-df8f9ecc-7b72-4773-bf8d-ec50d6e80ecd.png" alt="Tag Count" />
</div>

### Interactive Preview
<img src="https://user-images.githubusercontent.com/23217228/205437199-a879dc6e-32b6-46b9-abc2-ec20dd33c4f1.gif" alt="Extension Demo" />

## Configuration

All settings are optional with sensible defaults. Customize the extension to match your workflow.

### Display Format Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `data-size-count.statusBar.fileSizeFormat` | `"$(file-text) ${fileSize}"` | Format for file size display |
| `data-size-count.statusBar.selectedSizeFormat` | `"$(selection) ${selectedSize}"` | Format for selected text size |
| `data-size-count.statusBar.selectionCountFormat` | `"${linesCount} : ${wordsCount} : ${charCount}"` | Format for selection metrics |
| `data-size-count.statusBar.dataCountFormat` | `"$(database) ${dataCountWithBrackets} / ${maxDepth}"` | Format for data counts |

### Position & Priority

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `data-size-count.statusBar.position` | string | `"Left"` | Position (`"Left"` or `"Right"`) |
| `data-size-count.statusBar.priority` | number | `-1` | Controls position order (higher = more to the left) |
| `data-size-count.statusBar.selectionMetricsSeparator` | string | `"  |  "` | Separator between selection metrics |
| `data-size-count.statusBar.regexCountSeparator` | string | `", "` | Separator between regex counts |

### Format Variables

Use these variables in your custom format strings:

#### File Metrics
- `${fileSize}` – File size with unit (e.g., "2.5 MB")

#### Selection Metrics
- `${selectedSize}` – Size of selection in bytes
- `${linesCount}` – Number of selected lines
- `${wordsCount}` – Number of selected words
- `${charCount}` – Total characters in selection
- `${charCountWithoutSpaces}` – Characters excluding whitespace
- `${emptyLineCount}` – Number of empty lines in selection
- `${duplicateLinesCount}` – Count of duplicate lines
- `${duplicateWordsCount}` – Count of duplicate words

#### Data Type Metrics
- `${dataType}` – Type of data detected: "Array", "Object", "HTML", or "Other"
- `${dataCount}` – Count of elements/properties/tags
- `${uniqueDataCount}` – Count of unique items (arrays only)
- `${maxDepth}` – Maximum nesting depth
- `${dataCountWithBrackets}` – Count with brackets: `[12]`, `{8}`, `<5>`
- `${uniqueDataCountWithBrackets}` – Unique count with brackets
- `${dataCountDesc}` – Human-readable description
- `${openBracket}` / `${closeBracket}` – Bracket characters

#### Regex Metrics
- `${matchCount}` – Number of regex pattern matches

### Icons

Enhance your display using [VS Code Codicons](https://microsoft.github.io/vscode-codicons/). Examples:

```json
{
  "data-size-count.statusBar.fileSizeFormat": "$(file-text) ${fileSize}",
  "data-size-count.statusBar.selectionCountFormat": "$(pencil) ${linesCount}L : $(list) ${wordsCount}W",
  "data-size-count.statusBar.dataCountFormat": "$(symbol-array) ${dataCountWithBrackets}"
}
```

### Custom Regex Counting

Add custom regex patterns to count specific elements (imports, exports, comments, etc.):

```json
{
  "data-size-count.statusBar.regexCount": [
    {
      "title": "Imports",
      "format": "$(cloud-download) ${matchCount} Imports",
      "regex": "^\\s*import\\b.*$"
    },
    {
      "title": "Exports",
      "format": "$(cloud-upload) ${matchCount} Exports",
      "regex": "^\\s*export\\b.*$"
    },
    {
      "title": "Comments",
      "format": "$(comment) ${matchCount} Comments",
      "regex": "^\\s*(//.*|#.*|<!--.*-->)$"
    }
  ]
}
```

**Regex Entry Properties:**
- `title` – Human-readable name for this pattern
- `format` – Display format (use `${matchCount}` for the match count)
- `regex` – Regular expression pattern (supports JS RegExp syntax)
- `onlyOnSelection` – Evaluate only when text is selected (default: false)
- `alwaysShow` – Show entry even if match count is zero (default: false)

### Quick Configuration Examples

#### Minimal Display
```json
{
  "data-size-count.statusBar.fileSizeFormat": "${fileSize}",
  "data-size-count.statusBar.selectionCountFormat": "",
  "data-size-count.statusBar.dataCountFormat": ""
}
```

#### Developer-Focused
```json
{
  "data-size-count.statusBar.fileSizeFormat": "$(file-text) ${fileSize}",
  "data-size-count.statusBar.selectionCountFormat": "$(pencil) ${linesCount}L | $(list) ${wordsCount}W | ${charCount}C",
  "data-size-count.statusBar.dataCountFormat": "$(database) ${dataCountWithBrackets} / Depth: ${maxDepth}",
  "data-size-count.statusBar.regexCount": [
    {
      "title": "Imports",
      "format": "$(cloud-download) ${matchCount} Imports",
      "regex": "^\\s*import\\b.*$"
    }
  ]
}
```

#### Detailed Display with All Metrics
```json
{
  "data-size-count.statusBar.fileSizeFormat": "$(file-text) Size: ${fileSize}",
  "data-size-count.statusBar.selectedSizeFormat": "Selected: ${selectedSize}",
  "data-size-count.statusBar.selectionCountFormat": "$(pencil) ${linesCount}L | $(list) ${wordsCount}W | $(symbol-character) ${charCount}C",
  "data-size-count.statusBar.dataCountFormat": "$(symbol-array) ${dataCountWithBrackets} | Depth: ${maxDepth}",
  "data-size-count.statusBar.regexCount": [
    {
      "title": "TODOs",
      "format": "$(checklist) TODOs: ${matchCount}",
      "regex": "TODO"
    }
  ]
}
```

## Troubleshooting

### Status bar item not appearing

- **File too large**: Extension doesn't process files larger than 20 MB
- **Extension disabled**: Check Extensions → "Data Size Count" is enabled
- **Status bar hidden**: Use View → Toggle Status Bar


### Metrics not updating

- **Reload window**: Ctrl+Shift+P → "Developer: Reload Window"
- **Active editor required**: Ensure a text editor is open
- **Binary files**: Only text files are supported

### JSON/Array detection issues

- **Valid JSON required**: Remove trailing commas, comments, and unquoted keys
- **Complete selection**: Select entire JSON structure
- **Examples**:
  - ✅ Valid: `[1, 2, 3]`, `{"name": "John"}`
  - ❌ Invalid: `[1, 2,]`, `{name: firstName}`


### Performance Issues with Large Files

**Problem**: Slow performance when working with very large files.

**Solutions**:
1. **File Size Optimization**: The extension avoids processing files larger than 20 MB to prevent performance degradation.
2. **Selection Optimization**: Making large selections (>100K characters) may cause slight delays.
3. **Other Extensions**: Other extensions might also affect performance. Try disabling other extensions to isolate the issue.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Issues**: Found a bug? [Open an issue](https://github.com/R35007/data-size-count-vscode-extension/issues) with details about the problem.
2. **Request Features**: Have a feature idea? [Create a discussion](https://github.com/R35007/data-size-count-vscode-extension/discussions) to share your suggestion.
3. **Submit PRs**: Want to contribute code? Fork the repo, make your changes, and submit a pull request.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sivaraman** (R35007)
- Email: [sendmsg2siva@gmail.com](mailto:sendmsg2siva@gmail.com)
- GitHub: [@R35007](https://github.com/R35007)
- Repository: [data-size-count-vscode-extension](https://github.com/R35007/data-size-count-vscode-extension)

## ☕ Support

If you find this extension helpful, consider supporting the developer:

<a href="https://buymeacoffee.com/r35007" target="_blank">
  <img src="https://r35007.github.io/Siva_Profile/images/buymeacoffee.png" alt="Buy Me A Coffee" height="50" />
</a>

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.

## 🙏 Acknowledgments

- Built with ❤️ using [VS Code API](https://code.visualstudio.com/api)
- Inspired by the need for quick file and selection metrics
- Thanks to all contributors and users who have provided feedback and support

---

<div align="center">

**Happy Coding! 🚀**

Made with ❤️ by [Sivaraman](https://github.com/R35007)

</div>
