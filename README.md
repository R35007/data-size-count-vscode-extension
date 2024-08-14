# Data Size Count

Shows: File Size, Lines count, Words count, Array Length, Object size, HTML or XML Tags Count in Statusbar

<a href="https://buymeacoffee.com/r35007" target="_blank">
  <img src="https://r35007.github.io/Siva_Profile/images//buymeacoffee.png" />
</a>

## Features

Display following details in the vscode statusbar

- File Size
- Number of selected Lines
- Number of selected Words
- Array Length if the selected data is an array
- Object Size if the selected data is an object
- HTML or XML Tags count if the selected text is an HTML or XML tag.

## Screenshots

<img height="30" src="https://user-images.githubusercontent.com/23217228/205437226-dc753331-d2e4-47a6-a2eb-356da600b52d.png" alt="screenshot-1">
<img height="30" src="https://user-images.githubusercontent.com/23217228/205437260-c61d8df3-919c-410a-a431-1aa6cbda1b46.png" alt="screenshot-2">
<img height="30" src="https://user-images.githubusercontent.com/23217228/205437279-4230192c-2ef5-484e-9251-03f1dd3720b2.png" alt="screenshot-3">
<img height="30" src="https://user-images.githubusercontent.com/23217228/205437296-3a0161c8-c21b-4534-8e06-5dcc2ed35493.png" alt="screenshot-4">
<img height="30" src="https://user-images.githubusercontent.com/23217228/205437318-df8f9ecc-7b72-4773-bf8d-ec50d6e80ecd.png" alt="screenshot-5">

> Note: The statusbar item may not show if the file size exceed the limit of 20mb.

## Preview

<img src="https://user-images.githubusercontent.com/23217228/205437199-a879dc6e-32b6-46b9-abc2-ec20dd33c4f1.gif">


## Display Format

You can use $(icon-name) to show icon, visit this site [https://microsoft.github.io/vscode-codicons/dist/codicon.html](https://microsoft.github.io/vscode-codicons/dist/codicon.html) to find icon name.

### Default Format :

- `data-size-count.statusBar.fileSizeformat` - "\$(file-text) \${fileSize}"
- `data-size-count.statusBar.selectionCountFormat` - " \${linesCount} : \${wordsCount}"
- `data-size-count.statusBar.dataCountFormat` - " : \${dataCountWithBrackets}"

### Variable Description :

- `${fileSize}` - Gives the ActiveTextEditor File Size.
- `${linesCount}` - Gives the selected line(s) count.
- `${wordsCount}` - Gives the selected word(s) count.
- `${dataCount}` - Gives the selected data count. It can be either Array length or an Object size or HTML Elements count.
- `${dataCountWithBrackets}` - Gives the selected data count with brackets. ex : `[12]` - Array or `{12}` - Object or `<12>` - HTML.
- `${openBracket}` - Gives the selected data type open brackets. ex : `[` - Array or `{` - Object or `<` - HTML.
- `${closeBracket}` - Gives the selected data type close brackets. ex : `]` - Array or `}` - Object or `>` - HTML.

## Settings

- `data-size-count.statusBar.position` - Set Custom Statusbar position.
- `data-size-count.statusBar.priority` - The priority of the statusbar. Higher value means the statusbar should be shown more to the left.
- `data-size-count.statusBar.fileSizeFormat` - You can use these variables to custom display format: \${fileSize}.
- `data-size-count.statusBar.selectionCountFormat` - You can use these variables to custom display format: \${linesCount} \${wordsCount}.
- `data-size-count.statusBar.dataCountFormat` - You can use these variables to custom display format: \${dataCountWithBrackets}.
- `data-size-count.statusBar.visibility` - Show/Hide File Size, Lines Count, Words and Data Count details in statusbar.
