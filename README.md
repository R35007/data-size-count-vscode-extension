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

### Real-Time File & Selection Metrics
Display the following details instantly in your VS Code status bar:

- **File Size** - Total size of the active file
- **Selected Size** - Size of the currently selected text (in bytes)
- **Lines Count** - Number of lines in the selection
- **Words Count** - Number of words in the selection
- **Character Count** - Total characters in the selection
- **Character Count (No Spaces)** - Character count excluding whitespace
- **Array Length** - Automatically detects and displays array length for selected JSON arrays
- **Object Size** - Calculates object properties when selecting JSON objects
- **HTML/XML Tag Count** - Counts elements when selecting HTML or XML markup

### Smart Data Detection
- **JSON Support** - Intelligently parses and analyzes JSON arrays and objects
- **Markup Support** - Detects HTML and XML tags and provides element counts
- **Automatic Updates** - Metrics update instantly as you type or change selections
- **Multi-Cursor Support** - Correctly handles multiple selections simultaneously

### Customizable Status Bar Display
- **Flexible Formatting** - Use custom templates with variables to display exactly what you need
- **Icon Support** - Use VS Code's codicon library for visual indicators
- **Position Control** - Place the status bar item anywhere you want
- **Visibility Toggle** - Show/hide different metrics independently

## 📦 Installation

### From VS Code Marketplace
1. Open **VS Code**
2. Go to **Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for **"Data Size Count"**
4. Click **Install**

### Manual Installation
1. Clone or download this repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm run compile` to build the extension
5. Press `F5` to run the extension in debug mode

## 🎯 Usage

### Basic Usage
Once installed, the extension automatically activates and displays metrics in your status bar:
- Metrics update in real-time as you open files and make selections
- Click on the status bar item to view detailed information in a popup
- The status bar intelligently updates based on your current selection

### Commands
The extension provides the following VS Code commands:

| Command | Description |
|---------|-------------|
| `data-size-count.showFileDetails` | Display detailed file and selection information |
| `data-size-count.showHideStatusBar` | Toggle the status bar visibility |

You can access these commands via:
- **Command Palette** (Ctrl+Shift+P / Cmd+Shift+P) → Search for "Data Size Count"
- **Status Bar Click** → Click the status bar item to show details

## 📸 Screenshots

<div align="center">
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437226-dc753331-d2e4-47a6-a2eb-356da600b52d.png" alt="File Size Display" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437260-c61d8df3-919c-410a-a431-1aa6cbda1b46.png" alt="Selection Metrics" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437279-4230192c-2ef5-484e-9251-03f1dd3720b2.png" alt="Array Detection" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437296-3a0161c8-c21b-4534-8e06-5dcc2ed35493.png" alt="Object Metrics" />
  <img height="30" src="https://user-images.githubusercontent.com/23217228/205437318-df8f9ecc-7b72-4773-bf8d-ec50d6e80ecd.png" alt="Tag Count" />
</div>

### Interactive Preview
<img src="https://user-images.githubusercontent.com/23217228/205437199-a879dc6e-32b6-46b9-abc2-ec20dd33c4f1.gif" alt="Extension Demo" />

## ⚙️ Configuration

### Settings Overview

All settings are optional. The extension provides sensible defaults but can be customized to match your workflow.

#### Status Bar Position & Priority

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `data-size-count.statusBar.position` | string | `"right"` | Position of the status bar item (`"left"` or `"right"`) |
| `data-size-count.statusBar.priority` | number | `99` | Priority determines position (higher values appear more to the left) |
| `data-size-count.statusBar.visibility` | object | `{ ... }` | Controls visibility of different metrics |

#### Display Format Settings

| Setting | Type | Default Value | Description |
|---------|------|------------------|-------------|
| `data-size-count.statusBar.fileSizeFormat` | string | `"$(file-text) ${fileSize}"` | Format for displaying file size |
| `data-size-count.statusBar.selectedSizeFormat` | string | `"${selectedSize}"` | Format for displaying selected text size |
| `data-size-count.statusBar.selectionCountFormat` | string | `"${linesCount} : ${wordsCount}"` | Format for line and word counts |
| `data-size-count.statusBar.dataCountFormat` | string | `": ${dataCountWithBrackets}"` | Format for array/object/tag counts |

### Format Variables Reference

Use these variables in your custom format strings:

#### File Metrics
| Variable | Description | Example |
|----------|-------------|---------|
| `${fileSize}` | Total size of the active file | `"2.5 MB"` |

#### Selection Metrics
| Variable | Description | Example |
|----------|-------------|---------|
| `${selectedSize}` | Size of selected text in bytes | `"1.2 KB"` |
| `${linesCount}` | Number of selected lines | `5` |
| `${wordsCount}` | Number of selected words | `42` |
| `${charCount}` | Total characters in selection | `234` |
| `${charCountWithoutSpaces}` | Characters excluding whitespace | `198` |

#### Data Type Metrics
| Variable | Description | Example |
|----------|-------------|---------|
| `${dataCount}` | Count of array elements, object properties, or HTML elements | `12` |
| `${dataCountWithBrackets}` | Data count with appropriate brackets | `[12]`, `{8}`, `<5>` |
| `${openBracket}` | Opening bracket for detected data type | `[`, `{`, `<` |
| `${closeBracket}` | Closing bracket for detected data type | `]`, `}`, `>` |
| `${dataCountDesc}` | Descriptive label for data type | `"Array"`, `"Object"`, `"HTML"` |

### Icon Support

You can enhance your display format with VS Code icons. Visit the [VS Code Codicon Library](https://microsoft.github.io/vscode-codicons/dist/codicon.html) to explore available icons.

#### Icon Examples
```json
{
  "data-size-count.statusBar.fileSizeFormat": "$(file-text) ${fileSize}",
  "data-size-count.statusBar.selectionCountFormat": "$(pencil) ${linesCount}L : $(list) ${wordsCount}W",
  "data-size-count.statusBar.dataCountFormat": "$(symbol-array) ${dataCountWithBrackets}"
}
```

### Example Configurations

#### Minimal Display
```json
{
  "data-size-count.statusBar.fileSizeFormat": "${fileSize}",
  "data-size-count.statusBar.selectionCountFormat": "",
  "data-size-count.statusBar.dataCountFormat": ""
}
```

#### Detailed Display
```json
{
  "data-size-count.statusBar.fileSizeFormat": "$(file-text) Size: ${fileSize}",
  "data-size-count.statusBar.selectedSizeFormat": "Selected: ${selectedSize}",
  "data-size-count.statusBar.selectionCountFormat": "$(pencil) ${linesCount}L | $(symbol-string) ${wordsCount}W | $(symbol-character) ${charCount}C",
  "data-size-count.statusBar.dataCountFormat": "$(symbol-array) ${dataCountWithBrackets}"
}
```

#### Developer-Focused Display
```json
{
  "data-size-count.statusBar.fileSizeFormat": "$(file-text) ${fileSize}",
  "data-size-count.statusBar.selectionCountFormat": "$(pencil) ${linesCount} lines | $(list) ${wordsCount} words",
  "data-size-count.statusBar.dataCountFormat": "Data: ${dataCountWithBrackets}"
}
```

## 🐛 Troubleshooting

### Status Bar Item Not Appearing

**Problem**: The status bar item is not visible in VS Code.

**Solutions**:
1. **File Size Limit**: The extension doesn't display metrics for files larger than **20 MB**. Check your file size.
2. **Visibility Setting**: Verify that `data-size-count.statusBar.visibility` is enabled for the metrics you want to see:
   ```json
   {
     "data-size-count.statusBar.visibility": {
       "fileSize": true,
       "selectedSize": true,
       "linesCount": true,
       "wordsCount": true,
       "dataCount": true
     }
   }
   ```
3. **Extension Disabled**: Ensure the extension is enabled:
   - Open Extensions (Ctrl+Shift+X)
   - Search for "Data Size Count"
   - If disabled, click the disable/enable toggle
4. **Status Bar Hidden**: The status bar might be hidden. Show it via:
   - View → Toggle Status Bar (or press Ctrl+J in some configurations)

### Metrics Not Updating

**Problem**: Status bar metrics are not updating when you make changes.

**Solutions**:
1. **Reload Extension**: Press `Ctrl+Shift+P` → Search for "Developer: Reload Window" → Press Enter
2. **Check File Support**: The extension currently supports all text-based files. Binary files are not supported.
3. **Active Editor Required**: Ensure you have an active text editor open.

### Incorrect Array/Object Detection

**Problem**: JSON arrays or objects are not being detected correctly.

**Solutions**:
1. **Valid JSON**: Ensure your selected text is valid JSON:
   ```json
   // ✅ Valid
   [1, 2, 3, 4]
   {"name": "John", "age": 30}
   
   // ❌ Invalid
   [1, 2, 3,]  // Trailing comma
   {name: firstName}  // using variables
   ```
2. **Selection**: Make sure you've selected the entire JSON structure.
3. **Comments**: JSON does not support comments. Remove any comments from your selection.

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
