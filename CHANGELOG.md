## v1.1.1

- Build size reduced using webpack.
  
## v1.0.0

- Stable Version release.

## v0.0.19

- fixed - words count not considering the word with two letters.

## v0.0.18

- added - editor context menu `Show File Details` - Helps to show file size larger than 5mb.
- added - `${openBracket}` and `${closeBracket}` variables. WHich gives us the current selected data type brackets.
- Support for Larger Files. The File details may not show in statusbar if the file size is larger than 5mb.</br>
  We can now right click on the file and select `Show File Details` to get the File Details which will now show the file size even if the file is larger than 5mb.</br> The selection and data count will still not show if the file size exceeds the limit of 5mb.

## v0.0.17

- Statusbar details is hidden always bug is fixed.

## v0.0.16

- Bug Fixes

## v0.0.15

- added `Data Size Count: Show Details` Command - Shows VSCode Information box with details
- added `Data Size Count: Show / Hide Count StatusBar` Command - Shows a quickPick to Show / Hide the StatusBar details.

## v0.0.14

- Code Optimized.
- Bug Fix.

## v0.0.13

- Code Optimized.

## v0.0.12

- Code Optimized.
- Tried to get counts in larger json file. May take few seconds to get the counts.

## v0.0.11

- Counts not showing up on a new unsaved file - `Fixed`
- More durable JSON - gets selected JSON object size or Array length even if it contains any script variables
- If the we select one single tag then it shows number of child elements. If we select multiple tags it shows number of selected tags.

## v0.0.10

- support to count selected HTML tag children - For now its count for tags that are selected under `<body>` tag.

## v0.0.9

- removed `data-size-count.statusBar.itemSeperator`
- renamed `data-size-count.statusBar.countsformat` to `data-size-count.statusBar.selectionCountFormat`
- added `data-size-count.statusBar.dataCountFormat`

## v0.0.8

Added Custom Display Format and some additional statusbar settings

- `data-size-count.statusBar.position` - Set Custom Statusbar position.
- `data-size-count.statusBar.priority` - The priority of the statusbar. Higher value means the statusbar should be shown more to the left.
- `data-size-count.statusBar.fileSizeformat` - You can use these variables to custom display format: \${fileSize}.
- `data-size-count.statusBar.countsformat` - You can use these variables to custom display format: \${linesCount} \${wordsCount} \${dataCount} \${dataCountWithBrackets}.
- `data-size-count.statusBar.visibility` - Show/Hide File Size or Selection Count details in statusbar.
- `data-size-count.statusBar.itemSeperator` - Separator between File Size and Selection Counts in statusbar. The default value is 2 blank spaces.

Fixes

- lines count is incorrect when using multi cursor selection - `Fixed`

## v0.0.7

- Changed Details format to `FileSize LinesCount : WordsCount : DataCount`

## v0.0.6

- updated repo url
- Added File Size in status bar
- Added icons to statusbar details

## v0.0.5

- handled malformedJSON selection

## v0.0.4

- bug fix.

## v0.0.3

- code optimized to backward compatible. now available from vs code v1.30

## v0.0.2

- updated MIT `LICENSE`

## v0.0.1

- Initial release
